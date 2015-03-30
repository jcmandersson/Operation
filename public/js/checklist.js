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
    if(!(e.target.tagName == 'P' || e.target.tagName == 'BUTTON')) {
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
});

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
