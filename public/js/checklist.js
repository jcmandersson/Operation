/**
 * Created by Spinpoo on 2015-02-20.
 */
var socket = io();

$(function(){
  $('.check-js').click(function() {
    console.log("HEEZ");
    checkboxClick($(this).attr('id'));
  });  
})

var checkboxClick = function(id){
  socket.emit('checkboxClick', id);
}

var updateTableRow = function(tableRow, isChecked){
  var checkbox = tableRow.find('input');
  checkbox.prop('checked', isChecked);
  if (isChecked) {
    //$(this).css('cssText', 'background-color: rgba(76, 169, 34, 0.2) !important');
    tableRow.css('background-color', 'rgba(76, 169, 34, 0.2)');
  }
  else {
    tableRow.css('background-color', 'rgba(0,0,0,0)');
  }
  
}

socket.on('checkboxClick', function(checkObject){
  var tableRow = $('#' + checkObject.id);
  updateTableRow(tableRow, checkObject.isChecked);
});

socket.on('getCheckboxes', function(checkboxes){
  for(var index = 0; index < checkboxes.length; index++){
    var tableRow = $('#' + checkboxes[index].id);
    var isChecked = checkboxes[index].isChecked;
    updateTableRow(tableRow, isChecked);
  }
});
