
$(function() {
  
  var compiledSynonym = $('#synonym-template').html();
  var synonymTemplate = Handlebars.compile(compiledSynonym);

  var compiledResults = $('#results-template').html();
  var resultsTemplate = Handlebars.compile(compiledResults);

  var compiledArticle = $('#article-template').html();
  var articleTemplate = Handlebars.compile(compiledArticle);

  $("#newOperationButton").click(function () {
    /*
    //Get tags and build string separated with ', '
    var tags = '';
    $('.synonym').each(function(index) {
      if(index == 0){
        tags = $( this ).text();
      }
      else {
        tags += ', ' + ($(this).text());
      }
    });*/
    
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
        console.log(msg); //Innehåller den skapade modellen
      })
      .fail(function (err, status) {
        console.log('Någonting gick fel!');
        console.log(err);
        console.log(status);
      });
  });
  
  var addArticle = function(results) {
    var name = $(this).data('name');
    $('#articles').append(articleTemplate({ name: name }));
  };

  $('#article-search').keydown(function() {
    var self = this;

    var url = '/api/Kartotekartikels/' + $(this).val();
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

 /* $('#add-synonym-btn').on("keypress", function(e) {
    if (e.keyCode == 13) {
      var name = $('#synonym-input').val();
      $('#synonyms').append(synonymTemplate({ name: name }));
      return false; // prevent the button click from happening
    }
  });*/
  
  $('#add-synonym-btn').click(function() {
    var name = $('#synonym-input').val();
    $('#synonyms').append(synonymTemplate({ name: name }));
  });
  
  $('#tags_1').tagsInput({
          width:'auto', 
          defaultText:'Lägg till synonym',
          removeWithBackspace : false,
          height : '40px'});
  
});

