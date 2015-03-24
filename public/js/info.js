$(document).ready(function() {

  $(".process-content").hide();
  $("#content0").show();
  $("#0").addClass('active');

  $(".nav-pills > .navbar-btn").click(function() {
    $(this).addClass('active').siblings().removeClass('active');
    $(".process-content").hide();
    $("#content"+this.id).show();

  });

  var compiledResults = $('#kartotekResults-template').html();
  var kartotekResultsTemplate = Handlebars.compile(compiledResults);
  $('#article-search').keyup(findArticles.bind(undefined, kartotekResultsTemplate));
  
});

$("#createOperationInstanceButton").click(function(){
  createNewOperation();
});

$("#editChecklistButton").click(function(){
  if ($('#editChecklistButton').text() == 'Redigera plocklista') {
    $('#editChecklistButton').text('Spara');
    $('#editChecklist').show();
  }
  else {
    $('#editChecklistButton').text('Redigera plocklista');
    $('#editChecklist').hide();
  }
});

var findArticles = function(resultsTemplate) {
  var articleName = $('#article-search').val();
  var url = '/api/search/Kartotekartikel?text=' + articleName;
  $.get(url).done(function(results) {
    $('#kartotekResults').html(resultsTemplate({ results: results }));

    if (results.length != 0) {
      $('#article-search').addClass('has-results');
    }
    else {
      $('#article-search').removeClass('has-results');
    }

    $('.add-column').click(function() {
      //add here
      //addArticle.call(this, articleTemplate, results);
      $('#article-search').val('').removeClass('has-results');
    });
  });
};
