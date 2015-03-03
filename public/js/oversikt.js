$(document).ready(function(){
  
  $('.progressbar').each(function(i, e){
    
    var percentage = parseInt($(e).attr('data-value')) + parseInt(Math.random()*75);
    
    $(e).progressbar({
      value: percentage
    }).children('.ui-progressbar-value')
      .html(percentage + '%')
      .css("display", "block");
  });
  
});
