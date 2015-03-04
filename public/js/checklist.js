/**
 * Created by Spinpoo on 2015-02-20.
 */
var socket = io();
var operationId;

$(function(){
  $('.check-js').click(function() {
    socket.emit('checkboxClick', {operationId:operationId, id:$(this).attr('id')});
  });
});

socket.on('connect', function(){ //Runs after socket has been started.
  operationId = $('.check-js').attr('data-operationId');
  socket.emit('operationOpen', operationId);
});

var updateTableRow = function(tableRow, isChecked){
  var checkbox = tableRow.find('input');
  checkbox.prop('checked', isChecked);
  changeTableGraphics(tableRow, isChecked); //Function in checkEffect.js
};

socket.on('checkboxClick', function(checkObject){
  var tableRow = $('#' + checkObject.id);
  updateTableRow(tableRow, checkObject.isChecked);
});

socket.on('getCheckboxes', function(checkboxes){
  for(var index in checkboxes){
    var checkbox = checkboxes[index];
    var tableRow = $('#' + checkbox._id);
    var isChecked = checkbox.checked;
    //var isDisabled = checkbox.attr("disabled");
    updateTableRow(tableRow, isChecked);
  }
});
