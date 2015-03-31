/**
 * Created by Spinpoo on 2015-02-20.
 */
var socket = io();
var operationId;
var oldText;
var saved = false;

$(function(){
  var rows = $('.check-js');
  rows.each(function(index, row){
    var comment = $('#checkComment' + row.id);
    var commentButton = $('#commentButton' + row.id);
    changeCommentButton(comment, commentButton);
  });

  rows.click(function(e) {
    if(!(e.target.tagName == 'P' || e.target.tagName == 'BUTTON')) {
      if (!$(this).prop('disabled')) {
        var checkbox = $(this).find('input')[0];
        checkbox.checked = !checkbox.checked;
        changeTableGraphics($(this), checkbox.checked); //Function in checkEffect.js
        var checkObject = {operation: operationId, id: $(this).attr('id'), check: checkbox.checked};
        socket.emit('checkboxClick', checkObject);
        
        var done = true;
        $('.checkbox-js').each( function(i, box) {
          if (!box.checked) {
            done = false;
            return false;
          }
        });
        socket.emit('markAsDone', { operation: operationId, isDone: done});
      }      
    }
    
   
  });

  $('.checkbox-js').click(function() {
    this.checked = !this.checked;
  });

  $('.cancelComment').click(function(){
    if(!saved) {
      var id = $(this).data('id');
      var checkComment = $('#checkComment' + id);
      checkComment.val(oldText);
    }else{
      saved = false;
    }
  });

  $('.saveComment').click(function(){
    var id = $(this).data('id');
    var checkComment = $('#checkComment' + id);
    if (checkComment.val() == ""){
      checkComment.val("-");
    }
    var commentObject = {operation: operationId, id: id, comment: checkComment.val()};
    socket.emit('saveComment', commentObject);
    var commentButton = $('#commentButton' + id);
    changeCommentButton(checkComment, commentButton);
    checkComment.attr('disabled', true);
    $(this).attr('disabled', true);
    saved = true;
  });

  $('.showComment').click(function(){
    var id = $(this).data('id');
    $('#commentSaved' + id).hide();
    var checkComment = $("#checkComment" + id);
    checkComment.attr('disabled', false);
    oldText = checkComment.val();
    $('#saveComment' + id).attr('disabled', false);
  });
});

socket.on('saved', function(id){
  $('#commentSaved' + id).show();
});

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

socket.on('markAsDone', function(data) {
  if (data.isDone){
    $('#btn-done').addClass('btn-done');
  } else {
    $('#btn-done').removeClass('btn-done');
  }
});

$('#btn-done').click( function() {
  if ($('#btn-done').hasClass('btn-done')) {
    socket.emit('markAsDone', { operation: operationId, isDone: false});
  } else {   
    socket.emit('markAsDone', { operation: operationId, isDone: true});
  }
});
