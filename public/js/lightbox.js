$(document).ready(function(){
  $('.process-content').each(function(i, e){
    console.log(e);
    var index = 0;
    var $imgs = $(e).find('.process-content-item img').each(function(i ,e){
      var $img = $(e);
      var $new = $('<a></a>')
        .attr('data-featherlight', 'image')
        .attr('href', $img.attr('src'))
        .attr('target', '_blank');
      
      $img.wrap($new);
    });
  });

  $(document).on('click', '*[data-toggle="lightbox"]', function(event) {
    console.log('click');
    event.preventDefault();
  });
  
  $(document).on('load', '.ekko-lightbox-container img', function(event){
    console.log('load');
  });
});
