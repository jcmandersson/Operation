var changeTableGraphics = function(tablerow, isChecked){//Changes the color of tablerows when they are checked.
  if (isChecked) {
    tablerow.css('background-color', 'rgba(76, 169, 34, 0.2)');
  }
  else {
    tablerow.css('background-color', 'rgba(0,0,0,0)');
  }
};
