$(function () {
  var compiledResults = $('#results-template').html();
  var resultsTemplate = Handlebars.compile(compiledResults);

  $('#search').keyup(function () {
    var url = '/api/search/Operation?text=' + $(this).val();
    $.get(url).done(function (results) {
      $('#results').html(resultsTemplate({results: results}));

      if (results.length) {
        $('#search').addClass('has-results');
      } else {
        $('#search').removeClass('has-results');
      }
    });
  });
});

