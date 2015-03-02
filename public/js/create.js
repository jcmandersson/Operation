var createNewOperation = function() {
  var tags = $('#tags_1').val();

  $.ajax({
    type: 'POST',
    url: '/api/operations',
    data: {
      title: $('#operation-name').val(),
      tags: tags
    }
  })
    .done(function (msg) {
      // Contains the created model
      console.log(msg);
    })
    .fail(function (err, status) {
      console.log('Någonting gick fel!');
      console.log(err);
      console.log(status);
    });
};

var removeArticle = function(element) {
  var parent = $(element).parent();
  $(parent).remove(); 
};

var addArticle = function(articleTemplate, results) {
  var name = $(this).data('name');
  var newArticle = $(articleTemplate({ name: name })).appendTo('#articles');
  //console.log(newArticle.find('.remove-article'))
  newArticle.find('.remove-article').click(function() {
    //removeArticle.apply(this);
    removeArticle(this);
  });
};

var findArticles = function(resultsTemplate, articleTemplate) {
  var articleName = $('#article-search').val();
  var url = '/api/Kartotekartikels?text=' + articleName;
  $.get(url).done(function(results) {
    $('#kartotekResults').html(resultsTemplate({ results: results }));

    if (results.length != 0) {
      $('#article-search').addClass('has-results');
    }
    else {
      $('#article-search')
    }

    $('.add-column').click(function() {
      addArticle.call(this, articleTemplate, results)
      $('#article-search').val('').removeClass('has-results');
      $('.kartotekResults')
    });
  });
};

var addSynonym = function() {
  var name = $('#synonym-input').val();
  $('#synonyms').append(synonymTemplate({ name: name }));
};

// TODO keyCode == 13
$(function() {
  var compiledSynonym = $('#synonym-template').html();
  var synonymTemplate = Handlebars.compile(compiledSynonym);

  var compiledResults = $('#kartotekResults-template').html();
  var resultsTemplate = Handlebars.compile(compiledResults);

  var compiledArticle = $('#article-template').html();
  var articleTemplate = Handlebars.compile(compiledArticle);

  $('#newOperationButton').click(createNewOperation);
  $('#article-search').keydown(findArticles.bind(undefined, resultsTemplate, articleTemplate));
  $('#add-synonym-btn').click(addSynonym.bind(undefined, synonymTemplate));
  $('#tags_1').tagsInput({
    width: 'auto',
    defaultText: 'Lägg till synonym',
    removeWithBackspace: false,
    height: '40px'
  });
});

