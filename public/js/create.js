$(function() {
  var compiledResults = $('#results-template').html();
  var resultsTemplate = Handlebars.compile(compiledResults);

  var compiledArticle = $('#article-template').html();
  var articleTemplate = Handlebars.compile(compiledArticle);

  var addArticle = function(results) {
    var name = $(this).data('name');
    $('#articles').append(articleTemplate({ name: name }));
  };

  $('#article-search').keydown(function() {
    var self = this;

    // Should be replaced by '/api/Kartotekartikels/'
    var url = '/api/artikels?text=' + $(this).val();
    $.get(url).done(function(results) {
      $('#results').html(resultsTemplate({ results: results }));

      if (results.length != 0) {
        $('#search').addClass('has-results');
      }
      else {
        $('#search').removeClass('has-results');
      }

      $('.add-column').click(addArticle);
    });
  });

  var compiledSynonym = $('#synonym-template').html();
  var synonymTemplate = Handlebars.compile(compiledSynonym);
  $('#add-synonym-btn').click(function() {
    var name = $('#synonym-input').val();
    $('#synonyms').append(synonymTemplate({ name: name }));
  });
});

