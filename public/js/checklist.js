/**
 * Created by Spinpoo on 2015-02-20.
 */
var socket = io();
var operationId;

$(function(){
  $('.check-js').click(function(e) {
    if(!(e.target.tagName == 'P' || e.target.tagName == 'BUTTON')) {
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
  })
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
