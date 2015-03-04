var createNewOperation = function() {
  var tags = $('#tags_1').val();
  var specialty = $(".js-data-example-ajax").val();
  var operationName = $('#operation-name').val();
  console.log(specialty);
  
  $.ajax({
    type: 'POST',
    url: '/api/operations',
    data: {
      title: operationName,
      tags: tags,
      specialty: specialty
    }
  })
    .done(function (msg) {
      console.log(msg); //Contains the created Operation-model

      //adding articles here
      $('.article').each(function(index){

        $.ajax({
          type: 'POST',
          url: '/api/artikels',
          data: {
            name: $(this).text(),
            kartotek : $(this).attr("data-kartotekID"),
            operation: msg._id
          }
        })
          .done(function( msg ) {
            console.log(msg); //Contains the created Article-model
          })
          .fail(function(err, status){
            console.log('Någonting gick fel!');
            console.log(err);
            console.log(status);
          });
      });

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
  var kartotekID = $(this).data('kartotekID');

  var newArticle = $(articleTemplate({ name: name, id: kartotekID })).appendTo('#articles');
  newArticle.find('.remove-article').click(function() {
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

var initializeSpecialitetSelect = function() {
  $(".specialitet-select").select2({

    ajax: {
      type: 'GET',
      url: '/api/search/Specialitet/',
      dataType: 'json',
      delay: 250,
      data: function (params) {
        console.log(params);
        console.log(params.term);
        return {

          text: params.term, // search term
          all: 1
        };
      },
      processResults: function (data) {
        console.log(data);

        return {
          results: $.map(data, function (item) {
            return {
              text: item.name, id: item._id
            }
          })
        };
      },
      cache: true
    },
    escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
    minimumInputLength: 0

  });
};

// TODO keyCode == 13
$(function() {
  var compiledSynonym = $('#synonym-template').html();
  var synonymTemplate = Handlebars.compile(compiledSynonym);

  var compiledResults = $('#kartotekResults-template').html();
  var kartotekResultsTemplate = Handlebars.compile(compiledResults);

  var compiledArticle = $('#article-template').html();
  var articleTemplate = Handlebars.compile(compiledArticle);

  var compiledSpecialitetResults = $('#specialitetResults-template').html();
  var specialitetResultsTemplate = Handlebars.compile(compiledSpecialitetResults);
  
  $('#newOperationButton').click(createNewOperation);
  $('#article-search').keydown(findArticles.bind(undefined, kartotekResultsTemplate, articleTemplate));
  $('#add-synonym-btn').click(addSynonym.bind(undefined, synonymTemplate));
  $('#tags_1').tagsInput({
    width: 'auto',
    defaultText: 'Lägg till synonym',
    removeWithBackspace: false,
    height: '40px'
  });
  
  initializeSpecialitetSelect();
  
});

