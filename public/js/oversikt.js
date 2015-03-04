$(document).ready(function(){
  
  $('.progressbar').each(function(i, e){
    
    var percentage = parseInt($(e).attr('data-percent'));
    
    $(e).progressbar({
      value: percentage
    }).children('.ui-progressbar-value')
      //.html('&nbsp;&nbsp;&nbsp;' + $(e).attr('data-checked') + ' / ' + $(e).attr('data-total'))
      .html('&nbsp;&nbsp;&nbsp;' + percentage + '% (' + $(e).attr('data-checked') + '/' + $(e).attr('data-total') + ')')
      .css("display", "block");
  });
  
});
