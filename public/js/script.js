$('.check-js').click(function() {
  var checkbox = $(this).find('input');
  var checked = checkbox.prop('checked');
  var checked = !checked;
  checkbox.prop('checked', checked);

  if (checked) {
    //$(this).css('cssText', 'background-color: rgba(76, 169, 34, 0.2) !important');
    $(this).css('background-color', 'rgba(76, 169, 34, 0.2)');
  }
  else {
    $(this).css('background-color', 'rgba(0,0,0,0)');
  }
});
