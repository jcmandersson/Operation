/**
 * Created by Spinpoo on 2015-02-20.
 */
var socket = io();
var operationId;

$(function(){
  $('.check-js').click(function(e) {
    if(!(e.target.tagName == 'P' || e.target.tagName == 'BUTTON' || e.target.className.split(" ")[0] == 'amount')) {
      if (!$(this).prop('disabled')) {
        var checkbox = $(this).find('input')[0];
        checkbox.checked = !checkbox.checked;
        changeTableGraphics($(this), checkbox.checked); //Function in checkEffect.js
        var checkObject = {operation: operationId, id: $(this).attr('id'), check: checkbox.checked};
        socket.emit('checkboxClick', checkObject);
      }
    }
  });
  
  $('.checkbox-js').click(function() {
    this.checked = !this.checked;
  });
  
  $('.saveComment').click(function(){
    var id = $(this).data('id');
    var commentObject = {id: id, comment: $('#checkComment' + id).val()};
    socket.emit('saveComment', commentObject);
    
    console.log($("#checkComment" + $(this).data('id')).val());
    console.log($(this).data('id'));  
  });
  
  addAmountClick($('.amount'));
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

socket.on('connect', function(){ //Runs after socket has been started.
  operationId = $('.check-js').attr('data-operationId');
  socket.emit('operationOpen', operationId);
});

var updateTableRow = function(tableRow, isChecked, isTemplate){
  var checkbox = tableRow.find('input');
  checkbox.prop('checked', isChecked);
  if(isTemplate){
    checkbox.prop('disabled', true);
    tableRow.prop('disabled', true);
  }
  
  changeTableGraphics(tableRow, isChecked); //Function in checkEffect.js
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

