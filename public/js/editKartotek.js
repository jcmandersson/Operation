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
  $('.articleTable tbody').on("click", '.amount', addAmountClick);
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

    $('.add-column').click(function () {


      $('#article-search').val('').removeClass('has-results');
      $('#kartotekResults').empty();
      //add here

      var id = $(this).attr('data-kartotekid');
      var articleObject = jQuery.grep(results, function (e) {
        return e._id == id;
      });
      console.log(articleObject);
      var operationID = $('#operation').val();
      var found = false;

      $('.articleTable > tbody > tr').each(function (index) {
        if ($(this).attr("data-kartotekid") == id) {
          var slug = $(this).attr("data-slug");
          var newAmount = parseInt($('#amount' + articleObject[0]._id).children().text()) + 1;
          $.ajax({
            type: 'GET',
            url: '/api/update/artikels/' + slug,
            data: {
              amount: newAmount
            }
          })
            .done(function (msg) {
              $('#amount' + articleObject[0]._id).children().text(newAmount);
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
            name: articleObject[0].name,
            kartotek: articleObject[0]._id,
            operation: operationID,
            amount: 1
          }
        })
          .done(function (msg) {
            var compiledArticle = $('#article-template').html();
            var articleTemplate = Handlebars.compile(compiledArticle);
            $(articleTemplate({
              kartotek: articleObject[0],
              operation: operationID,
              _id: msg._id,
              amount: 1,
              slug: msg.slug
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

var addAmountClick = function () {
  var val = $(this).text();
  var input = $('<input type="text" class="editAmount form-control" id="editAmount"/>');
  input.val(val);
  $(this).replaceWith(input);
  $(input).focus();

  $(input).keypress(function (e) {
    editAmountDone(e, $(input), val);
  });

  setTimeout(function () {
    $('body').click(function (e) {
      if (e.target.id == "editAmount") {
        return;
      }
      editAmountDone(e, $(input), val);
    });
  }, 0);

};

function isPosInt (value) {
  return !isNaN(value) &&
    parseInt(Number(value)) == value && !isNaN(parseInt(value, 10)) && value > 0;
}

var editAmountDone = function (e, tag, val) {
  var newAmount = $(tag).val();
  var oldAmount = val;
  if (e.which == 13 || e.type === 'click') {

    $('body').unbind();
    if (!isPosInt(newAmount)) {
      var input = $('<b class="amount">' + oldAmount + '</b>');
      $(tag).replaceWith(input);
    }
    else {

      var slug = $(tag).parent().parent().attr('data-slug');

      $.ajax({
        type: 'GET',
        url: '/api/update/artikels/' + slug,
        data: {
          amount: newAmount
        }
      })
        .done(function (msg) {
          var input = $('<b class="amount">' + newAmount + '</b>');
          input.val(newAmount);
          $(tag).replaceWith(input);
        })
        .fail(function (err, status) {
          console.log('Någonting gick fel!');
          console.log(err);
          console.log(status);
        });
    }
    return false;
  }
};
