tabClick = function(elem) {
  $(elem).addClass('active').siblings().removeClass('active');
  if(elem.id == "all") {
    $(".process-content").show();
    $("#contentchecklist").hide();
    window.location.replace('#all');
  } else {
    $(".process-content").hide();
    $("#content"+elem.id).show();
    window.location.replace('#' + elem.id);
  }
};

$(document).ready(function() {
  var hash = window.location.hash.substring(1);
  if (!hash || hash === 'all') {
    $("#all").addClass('active');
  } else {
    $('#' + hash).addClass('active').siblings().removeClass('active');
    $(".process-content").hide();
    $("#content" + hash).show();
  }
  
  $(".nav-pills > .navbar-btn").click(function() {
    tabClick(this);
  });

  var compiledResults = $('#kartotekResults-template').html();
  var kartotekResultsTemplate = Handlebars.compile(compiledResults);

  $('#article-search').keyup( function() {
    if( this.value.length == 0){
      $('#kartotekResults').empty();
      return;
    }
    else if( this.value.length < 3 ){
      return;
    }
    findArticles(kartotekResultsTemplate);
  });
  
  $(".publicera").click(function () {
    var slug = $("#opName").attr('data-operationSlug');

    $.ajax({
      type: 'GET',
      url: '/api/update/operations/' + slug,
      data: {
        state: 'Publicerad'
      }
    })
      .done(function (msg) {
        location.reload();
      })
      .fail(function (err, status) {
        console.log('Någonting gick fel!');
        console.log(err);
        console.log(status);
      });
    
  });
  
});
  
var findArticles = function (resultsTemplate) {
  var articleName = $('#article-search').val();
  var url = '/api/search/Kartotekartikel?text=' + articleName;
  $.get(url).done(function (results) {
    $('#kartotekResults').html(resultsTemplate({ results: results }));

    if (results.length != 0) {
      $('#article-search').addClass('has-results');
    }
    else {
      $('#article-search').removeClass('has-results');
    }

    $('.add-column').click(function () {

      //add here
      var id = $(this).attr('data-kartotekid');
      var articleObject = jQuery.grep(results, function(e){ return e._id == id; });

      var operationID = $('#opName').attr("data-operationId");
      socket.emit('articleAdd', articleObject, operationID);
      $('#article-search').val('').removeClass('has-results');
      $('#kartotekResults').empty();
    });
  });
};

$("#editChecklistButton").click(function(){
  if ($('#editChecklistButton').text() == 'Redigera plocklista') {
    $('#editChecklistButton').text('Klar');
    $('#editChecklist').show();
    $('.centered-remove').show();
    $('.amount-field').show();
    $('.minus-field').show();
    $('.plus-field').show();
    $('.uneditable-amount').hide();
  }
  else {
    $('#editChecklistButton').text('Redigera plocklista');
    $('#editChecklist').hide();
    $('.centered-remove').hide();
    $('.amount-field').hide();
    $('.minus-field').hide();
    $('.plus-field').hide();
    $('.uneditable-amount').show();
  }
});
