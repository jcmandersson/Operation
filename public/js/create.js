/*
$('.articles').on('click', '.remove', function(){
  $(this).parent().remove();
});

$( "#article" ).change(function() {

  $.ajax({
    type: 'GET',
    url: '/api/Kartotekartikels/'+ $('#article').val()
})
    .done(function( msg ) {
      console.log(msg);
      $( ".articles" ).append( "<div class='item' id="+msg._id+"> <span class='glyphicon glyphicon-remove-circle remove' aria-hidden='true'></span> <span class='item-text'>"+msg.name+"</span> </div>" );

    })
    .fail(function(err, status){
      console.log('Någonting gick fel!');
      console.log(err);
      console.log(status);
    });
});
*/

$(function() {

  var compiledSynonym = $('#synonym-template').html();
  var synonymTemplate = Handlebars.compile(compiledSynonym);

  var compiledResults = $('#results-template').html();
  var resultsTemplate = Handlebars.compile(compiledResults);

  var compiledArticle = $('#article-template').html();
  var articleTemplate = Handlebars.compile(compiledArticle);

  $("#newOperationButton").click(function () {
    console.log("Handler for .click() called.");
    console.log($('#operation-name').val());
    $.ajax({
      type: 'POST',
      url: '/api/operations',
      data: {
        title: $('#operation-name').val(),
        tags: 'exempel' //ska hämta från lista här
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


  $('#synonym-add').on("keypress", function(e) {
    if (e.keyCode == 13) {
      console.log($('#synonym-add').val());
      var tag = $('#synonym-add').val();
      $('#synonyms').append(synonymTemplate({ tag: tag }));
      var tags = '';
      console.log($('.synonym').each(function() {
        tags = tags +($( this ).text());
        console.log(tags);
      }));
      return false; // prevent the button click from happening
    }
  });
  
  
  var addArticle = function(results) {
    var name = $(this).data('name');
    $('#articles').append(articleTemplate({ name: name }));
  };

  $('#article-search').keydown(function() {
    var self = this;

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
});

