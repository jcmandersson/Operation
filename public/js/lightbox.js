var initializeImages = function () {
  $('.process-content-item img').load(function (e) {
    var $img = $(this);

    var $new = $('<a></a>')
      .css({
        display: 'block',
        width: $img.width(),
        height: $img.height()
      })
      .addClass('jquery-zoom')
      .attr('data-featherlight', 'image')
      .attr('href', $img.attr('src'))
      .attr('target', '_blank');

    $img.wrap($new);

    $('.jquery-zoom').removeClass('jquery-zoom').zoom({
      url: $img.attr('src'),
      magnify: 1.5
    });
  });
};

$(document).ready(function () {
  initializeImages();
});
