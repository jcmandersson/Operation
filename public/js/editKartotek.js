$(document).ready(function () {
  
  var compiledResults = $('#kartotekResults-template').html();
  var kartotekResultsTemplate = Handlebars.compile(compiledResults);

  $('#article-search').keyup(function () {
    if (this.value.length == 0) {
      $('#kartotekResults').empty();
      return;
    }
    findArticles(kartotekResultsTemplate);
  });

  $('.articleTable tbody').on("click", '.article-remove', removeArticle);
  $('.articleTable tbody').on("click", '.minus-field', minusOne);
  $('.articleTable tbody').on("click", '.plus-field', plusOne);
});

var minusOne = function () {
  var slug = $(this).parent().parent().attr('data-slug');
  var amountField = $(this).parent().find('.amount-field');
  var oldAmount = parseInt(amountField.text());
  var newAmount = oldAmount-1;
  if (newAmount > 0) {
    $.ajax({
      type: 'GET',
      url: '/api/update/artikels/' + slug,
      data: {
        amount: newAmount
      }
    })
      .done(function (msg) {
        $(amountField).text(newAmount);
      })
      .fail(function (err, status) {
        console.log('Någonting gick fel!');
        console.log(err);
        console.log(status);
      });
  }
};

var plusOne = function () {
  var slug = $(this).parent().parent().attr('data-slug');
  var amountField = $(this).parent().find('.amount-field');
  var oldAmount = parseInt(amountField.text());
  var newAmount = oldAmount+1;
  if (newAmount > 0) {
    $.ajax({
      type: 'GET',
      url: '/api/update/artikels/' + slug,
      data: {
        amount: newAmount
      }
    })
      .done(function (msg) {
        $(amountField).text(newAmount);
      })
      .fail(function (err, status) {
        console.log('Någonting gick fel!');
        console.log(err);
        console.log(status);
      });
  }
};

var findArticles = function (resultsTemplate) {
  var articleName = $('#article-search').val();
  var url = '/api/search/Kartotekartikel?text=' + articleName;
  $.get(url).done(function (results) {
    
    $('#kartotekResults').html(resultsTemplate({results: results}));

    if (results.length != 0) {
      $('#article-search').addClass('has-results');
    }
    else {
      $('#article-search').removeClass('has-results');
    }

    $('.add-article-info').click(function () {
      //add here
      var id = $(this).attr('data-kartotekid');
      console.log(id);

      var kartotekArticle = jQuery.grep(results, function (e) {
        return e._id == id;
      });
      var operationID = $('.operationForm').attr('data-id');
      var found = false;

      $('.articleTable > tbody > tr').each(function (index) {
        if ($(this).attr("data-kartotekid") == id) {
          var slug = $(this).attr("data-slug");
          var newAmount = parseInt($('#amount' + kartotekArticle[0]._id).children().text()) + 1;
          $.ajax({
            type: 'GET',
            url: '/api/update/artikels/' + slug,
            data: {
              amount: newAmount
            }
          })
            .done(function (msg) {
              $('#amount'+kartotekArticle[0]._id).find('.amount-field').text(newAmount);
            })
            .fail(function (err, status) {
              console.log('Någonting gick fel!');
              console.log(err);
              console.log(status);
            });
          found = true;
        }
      });

      if (!found) {
        //add new article
        $.ajax({
          type: 'POST',
          url: '/api/artikels',
          data: {
            name: kartotekArticle[0].name,
            kartotek: kartotekArticle[0]._id,
            operation: operationID,
            amount: 1
          }
        })
          .done(function (checkArticle) {
            var compiledArticle = $('#article-template').html();
            var articleTemplate = Handlebars.compile(compiledArticle);
            $(articleTemplate({
              kartotek: kartotekArticle[0],
              name: checkArticle.name,
              operation: operationID,
              _id: checkArticle._id,
              amount: 1,
              slug: checkArticle.slug
            })).appendTo('.articleTable');

          })
          .fail(function (err, status) {
            console.log('Någonting gick fel!');
            console.log(err);
            console.log(status);
          });
      }
    });
  });

};

var removeArticle = function () {
  var checkArticleID = $(this).parent().parent().attr('id');
  var slug = $(this).parent().parent().attr('data-slug');

  var confirmed = confirm("Är du säker på att du vill ta bort artikeln?");
  if (confirmed) {

    $.ajax({
      type: 'DELETE',
      url: '/api/artikels/' + slug
    })
      .done(function (msg) {
        var row = $('#' + checkArticleID);
        row.remove();
      })
      .fail(function (err, status) {
        console.log('Någonting gick fel!');
        console.log(err);
        console.log(status);
      });

  }
  else {
    return false;
  }
};