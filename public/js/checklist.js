/**
 * Created by Spinpoo on 2015-02-20.
 */
var socket = io();
var operationId;
var oldText;
var saved = false;

$(function(){
  
  var rows = $('.check-js');
  rows.each(function(index, row){ //Set the color of the comment button depending on if there is a comment.
    var comment = $('#checkComment' + row.id);
    var commentButton = $('#commentButton' + row.id);
    changeCommentButton(comment, commentButton);
  });

  rows.click(function(e) {  //When a checkable row is clicked, check the row and emit to socket.io
    if(!(e.target.tagName == 'P' || e.target.tagName == 'BUTTON' || e.target.className.split(" ")[0] == 'amount')) {
      if (!$(this).prop('disabled')) {
        var checkbox = $(this).find('input')[0];
        var preparation = $(this).hasClass("process-content-item") ? true : false;
        
        checkbox.checked = !checkbox.checked;
        changeTableGraphics($(this), checkbox.checked, preparation); //Function in checkEffect.js
        var checkObject = {preparation: $(this).data('preparation'), operation: operationId, id: $(this).attr('id'), check: checkbox.checked};
        socket.emit('checkboxClick', checkObject);
      }
    }
  });

  //If the actual checkbox is clicked we will get a double-click effect. So we compensate for that here.
  $('.checkbox-js').click(function() {  
    this.checked = !this.checked;
  });

  $('.cancelComment').click(function(){ //Throw away texted comment if cancel button is clicked.
    if(!saved) {
      var id = $(this).data('id');
      var checkComment = $('#checkComment' + id);
      checkComment.val(oldText);
    }else{
      saved = false;
    }
  });

  $('.saveComment').click(function(){ //Save the comment locally and emit to back-end to save in database.
    var id = $(this).data('id');
    var checkComment = $('#checkComment' + id);
    var commentButton = $('#commentButton' + id);
    
    if (checkComment.val() == ""){
      checkComment.val("-");
    }
    
    var commentObject = {operation: operationId, id: id, comment: checkComment.val()};
    socket.emit('saveComment', commentObject);
    changeCommentButton(checkComment, commentButton);
    
    checkComment.attr('disabled', true);
    $(this).attr('disabled', true);
    saved = true;
  });

  $('.showComment').click(function(){ //Hide the "Saved" text, enable the comment field and save the old text if the user presses cancel.
    var id = $(this).data('id');
    var checkComment = $("#checkComment" + id);
    
    $('#commentSaved' + id).hide();
    checkComment.attr('disabled', false);
    oldText = checkComment.val();
    $('#saveComment' + id).attr('disabled', false);
  });
  
  addAmountClick($('.amount'));

  $('.article-remove').click(function() {
    console.log($(this).parent().parent().data("kartotekID"));
    //removeArticle.call(this, $(this).parent().parent().data("slug"));
  });
  
});

var addAmountClick = function(amount){
  amount.click(function(){
    var val = $(this).text();
    var input = $('<input type="text" class="amount form-control" id="editAmount"/>');
    input.val(val);
    $(this).replaceWith(input);
    $(input).focus();

    $(input).keypress(function(e){
      editAmountDone(e, $(input));
    });

    setTimeout(function(){
      $('body').click(function(e){
        if(e.target.id == "editAmount") {
          return;
        }
        editAmountDone(e, $(input));
      });
    },0);

  });
};

var editAmountDone = function (e, tag) {
  var val = $(tag).val();
  if (e.which == 13 || e.type === 'click') {
    $('body').unbind();
    var input = $('<b class="amount">' + val + '</b>');
    input.val(val);
    $(tag).replaceWith(input);
    addAmountClick(input);

    var checkArticleID = $(input).parent().parent().attr('id');
    var operationID = $(input).parent().parent().attr('data-operationId');
    socket.emit('amountChange', checkArticleID, operationID, val);

    return false;
  }
};

socket.on('saved', function(id){ //Show saved text when the database has successfully stored the comment.
  $('#commentSaved' + id).show();
});

socket.on('connect', function(){ //Runs after socket has been started. Get all checkbox statuses from db.
  operationId = $('.check-js').attr('data-operationId');
  socket.emit('operationOpen', operationId);
});

var updateTableRow = function(tableRow, isChecked, isTemplate){ //set checked status and update row color.
  var checkbox = tableRow.find('input');
  checkbox.prop('checked', isChecked);
  var preparation = tableRow.hasClass("process-content-item") ? true : false;
  if(isTemplate){
    checkbox.prop('disabled', true);
    tableRow.prop('disabled', true);
  }

  changeTableGraphics(tableRow, isChecked, preparation); //Function in checkEffect.js
};

socket.on('checkboxClick', function(checkObject){
  var tableRow = $('#' + checkObject.id);
  updateTableRow(tableRow, checkObject.isChecked, false);
});

socket.on('getCheckboxes', function(checkboxesAndTemplate){
  var checkboxes = checkboxesAndTemplate.checkboxes;
  var isTemplate = checkboxesAndTemplate.template;
  for(var index in checkboxes){
    var checkbox = checkboxes[index];
    var tableRow = $('#' + checkbox._id);
    var isChecked = checkbox.checked;
    //var isDisabled = checkbox.attr("disabled");
    updateTableRow(tableRow, isChecked, isTemplate);
  }
});

socket.on('articleAmountUpdate', function(amount, articleID){
  $('#amount'+articleID).children().text(amount);
});

socket.on('newArticleUpdate', function(checkArticle, kartotekArticle, operationID){

  var compiledArticle = $('#article-template').html();
  var articleTemplate = Handlebars.compile(compiledArticle);

  var compiledComment = $('#comment-template').html();
  var commentTemplate = Handlebars.compile(compiledComment);
  
  $(articleTemplate({ kartotekid: kartotekArticle._id, operation: operationID, _id: checkArticle._id,
    amount: 1, kartotekname: kartotekArticle.name, kartotekstorage : kartotekArticle.storage, kartoteksection: kartotekArticle.section,
    kartotekshelf: kartotekArticle.shelf, kartotektray: kartotekArticle.tray  })).appendTo('.articleTable');

  $(commentTemplate({ kartotekname: kartotekArticle.name, _id: checkArticle._id, comment: '' })).appendTo('.process-content');
});

