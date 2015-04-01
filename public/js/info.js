tabClick = function(elem) {
  $(elem).addClass('active').siblings().removeClass('active');
  if(elem.id == "all") { 
    $(".process-content").show();
    $("#contentchecklist").hide();
  } else {
    $(".process-content").hide();
    $("#content"+elem.id).show();
  }
};

$(document).ready(function() {
  
  $("#all").addClass('active');

  $(".nav-pills > .navbar-btn").click(function() {
    tabClick(this);
  });

  var compiledResults = $('#kartotekResults-template').html();
  var kartotekResultsTemplate = Handlebars.compile(compiledResults);
  
  $('#article-search').keyup(findArticles.bind(undefined, kartotekResultsTemplate));
  
});

$("#createOperationInstanceButton").click(function(){
  createNewOperation();
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
      var id = $(this).attr('data-kartotekid');
      var articleObject = jQuery.grep(results, function(e){ return e._id == id; });
      
      var operationID = $('#opName').attr("data-operationId");
      socket.emit('articleAdd', articleObject, operationID);

      $('#article-search').val('').removeClass('has-results');
    });
  });
};
