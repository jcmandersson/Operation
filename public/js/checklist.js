/**
 * Created by Spinpoo on 2015-02-20.
 */
var socket = io();

$(function() {
  $('.check-js').click(function() {
    socket.emit('checkboxClick', $(this).attr('id'));
  });
});

var updateTableRow = function(tableRow, isChecked) {
  var checkbox = tableRow.find('input');
  checkbox.prop('checked', isChecked);
  if (isChecked) {
    //$(this).css('cssText', 'background-color: rgba(76, 169, 34, 0.2) !important');
    tableRow.css('background-color', 'rgba(76, 169, 34, 0.2)');
  }
  else {
    tableRow.css('background-color', 'rgba(0,0,0,0)');
  }
};

socket.on('checkboxClick', function(checkObject) {
  var tableRow = $('#' + checkObject.id);
  updateTableRow(tableRow, checkObject.isChecked);
});

socket.on('getCheckboxes', function(checkboxes) { //TODO: Ändra så att alla klienter inte uppdaterar för att en ny ansluter.
  for (var index in checkboxes) {
    var checkbox = checkboxes[index];
    var tableRow = $('#' + checkbox._id);
    var isChecked = checkbox.checked;
    updateTableRow(tableRow, isChecked);
  }
  console.log("Stuff");
});
