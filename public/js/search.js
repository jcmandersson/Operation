$(function() {
  var compiledResults = $('#results-template').html();
  var resultsTemplate = Handlebars.compile(compiledResults);

  $('#search').keydown(function() {
    var url = '/api/search?text=' + $(this).val();
    $.get(url).done(function(results) {
      $('#results').html(resultsTemplate({ results: results }));

      if (results.length != 0) {
        $('#search').addClass('has-results');
      }
      else {
        $('#search').removeClass('has-results');
      }
    });
  });
});

