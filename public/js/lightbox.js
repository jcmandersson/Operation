$(document).ready(function() {
  $('.process-content').each(function(i, e) {
    var $imgs = $(e).find('.process-content-item img');
    
    for(var i = 0; i < $imgs.length; ++i) {
      var $img = $imgs.eq(i);
      var $new = $('<a></a>')
        .addClass('jquery-zoom')
        .css('display', 'block')
        .attr('data-featherlight', 'image')
        .attr('href', $img.attr('src'))
        .attr('target', '_blank')

      $img.wrap($new);
    }
    var $zoom = $('.jquery-zoom');
    $zoom.zoom({
      url: $zoom.find('img').attr('src'),
      magnify: 1.5
    });
  });
});
