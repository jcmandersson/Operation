$(document).ready(function(){
  $('.process-content').each(function(i, e){
    var $imgs = $(e).find('.process-content-item img').each(function(i ,e){
      var $img = $(e);
      var $new = $('<a></a>')
        .attr('data-featherlight', 'image')
        .attr('href', $img.attr('src'))
        .attr('target', '_blank');
      
      $img.wrap($new);
    });
  });
});
