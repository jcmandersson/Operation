tabClick = function(elem) {
  $(elem).addClass('active').siblings().removeClass('active');
  if (elem.id == 'all') {
    $('.process-content').show();
    $('#contentchecklist').hide();
    window.location.replace('#tab_all');
  } else {
    $('.process-content').hide();
    $('#content' + elem.id).show();
    window.location.replace('#tab_' + elem.id);
  }
};

$(document).ready(function() {
  var hash = window.location.hash.substring(5);
  if (!hash || hash === 'all') {
    $("#all").addClass('active');
  } else {
    $('#' + hash).addClass('active').siblings().removeClass('active');
    $(".process-content").hide();
    $("#content" + hash).show();
  }

  $(".nav-pills > .navbar-btn").click(function(e) {
    e.preventDefault();
    tabClick(this);
  });

  var compiledResults = $('#kartotekResults-template').html();
  var kartotekResultsTemplate = Handlebars.compile(compiledResults);

  $('#article-search').keyup(function() {
    if (this.value.length == 0) {
      $('#kartotekResults').empty();
    } else {
      findArticles(kartotekResultsTemplate);
    }
  });
  $('.toUtkast').click(function() {
    if(!confirm('Är du säker på att du vill skicka tillbaka handboken till utkast?')) return;
    var slug = $('#opName').attr('data-operationSlug');

    $.ajax({
      type: 'GET',
      url: '/api/update/operations/' + slug,
      data: {
        state: 'Utkast'
      }
    })
      .done(function(msg) {
        location.reload();
      });
  });
  $('.publicera').click(function() {
    if(!confirm('Är du säker på att du vill publicera denna handbok?')) return;
    var slug = $('#opName').attr('data-operationSlug');

    $.ajax({
      type: 'GET',
      url: '/api/update/operations/' + slug,
      data: {
        state: 'Publicerad'
      }
    })
      .done(function(msg) {
        location.reload();
      });
  });

  $('#editChecklistButton').click(toggleEdit);

});

var findArticles = function(resultsTemplate) {
  var articleName = $('#article-search').val();
  var url = '/api/search/Kartotekartikel?text=' + articleName;
  $.get(url).done(function(results) {
    $('#kartotekResults').html(resultsTemplate({results: results}));

    if (results.length != 0) {
      $('#article-search').addClass('has-results');
    } else {
      $('#article-search').removeClass('has-results');
    }

    $('.add-article-info').click(function() {

      // add here
      var id = $(this).attr('data-kartotekid');
      var kartotekArticle = jQuery.grep(results, function(e) {
        return e._id == id;
      });

      var operationID = $('#opName').attr("data-operationId");
      socket.emit('articleAdd', kartotekArticle, operationID);
    });
  });
};

var toggleEdit = function() {
  if ($(this).text() == 'Redigera plocklista') {
    $(this).text('Klar');
    $('#editChecklist').show();
    $('.centered-remove').show();
    $('.amountColumn').show();
    $('.uneditableAmountColumn').hide();
    $('.checkbox-js').hide();
  } else {
    $(this).text('Redigera plocklista');
    $('#editChecklist').hide();
    $('.centered-remove').hide();
    $('.amountColumn').hide();
    $('.uneditableAmountColumn').show();
    $('.checkbox-js').show();
  }
};
