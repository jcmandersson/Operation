var initializeImages = function() {
  $('.process-content-item img')
    .load(function(e) {
      var $img = $(this);

      var $new = $('<a></a>')
        .attr('data-featherlight', 'image')
        .attr('href', $img.attr('src'))
        .attr('target', '_blank');

      $img.wrap($new);
    })
    .click(function() {
      setTimeout(function() {
        var $featherlight = $('.featherlight-content:not(.event)').addClass('event');
        if (!$featherlight.length) return;

        var $img = $featherlight.find('img');

        var $new = $('<span></span>')
          .css({
            display: 'block',
            width: $img.width(),
            height: $img.height(),
            cursor: 'pointer'
          })
          .addClass('jquery-zoom')

        $img.wrap($new);

        $('.jquery-zoom').removeClass('jquery-zoom').zoom({
          url: $img.attr('src'),
          magnify: 1.5,
          on: 'grab'
        });
      }, 200);
    });
};

$(document).ready(function() {
  initializeImages();
});
