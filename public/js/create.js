/*
$('.articles').on('click', '.remove', function(){
  $(this).parent().remove();
});

$( "#article" ).change(function() {
  var bla = $('#article').val();
  console.log(bla);

  $.ajax({
    type: 'GET',
    url: '/api/Kartotekartikels/'+bla
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

