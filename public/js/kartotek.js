// This happends when we've replaced the uneditable table-element with
// an input-box. Now we want to listen to changes.
var saveArticle = function(elem) {
  var compiledModified = $('#modified-template').html();
  var modifiedTemplate = Handlebars.compile(compiledModified);

  var newValue = $(elem).val();
  $(elem).parent().html(modifiedTemplate({ name: newValue })).click(function() {
    modifyArticle.call($(this).find('span'));
  });
};

// Here we listen for clicks in an element of the table.
// When someone clicks we replace the html with an input box.
var modifyArticle = function(tablerow) {
  var compiledModify = $('#modify-template').html();
  var modifyTemplate = Handlebars.compile(compiledModify);

  // This will essentially remove itself
  var currentValue = $(this).text();
  //console.log(tablerow.attr("id"));
  $(this).parent().html(modifyTemplate({ value: currentValue }));
  $('#currently-modifying').select().keydown(function(e) {
    // 13 = the enter key
    if (e.keyCode == 13) {
      saveArticle(this);
      console.log(tablerow);

      $.ajax({
        type: 'GET',
        url: '/api/kartotekartikels',
        data: {
          slug: tablerow.attr("data-slug")
        }
      })
        .done(function(artikel) {
          //Tabort
          console.log(artikel);
          console.log(artikel._id);
          removeArticle(tablerow.data("slug"));
          console.log(currentValue);
          console.log(artikel._id);
          $.ajax({
            type: 'POST',
            url: '/api/kartotekartikels',
            data: {
              _id: artikel._id,
              name: currentValue,
              storage: artikel.storage,
              section: artikel.section,
              shelf: artikel.shelf,
              tray: artikel.tray
            }
          })
            .done(function (newArticle) {
            })
            .fail(function (err, status) {
              console.log('Kartoteksartikel kunde inte ändras!');
              console.log(err);
              console.log(status);
            });
        })
        .fail(function(err, status){
          console.log('Kunde inte hämta artikel!');
          console.log(err);
          console.log(status);
        });

    }
  });
};

var addArticle = function() {
  var compiledArticle = $('#article-template').html();
  var articleTemplate = Handlebars.compile(compiledArticle);
  var row = $(this).parent().parent();

  $.ajax({
    type: 'POST',
    url: '/api/kartotekartikels',
    data: {
      name: row.find('[data-type="name"]').val(),
      storage: row.find('[data-type="storage"]').val(),
      section: row.find('[data-type="section"]').val(),
      shelf: row.find('[data-type="shelf"]').val(),
      tray: row.find('[data-type="tray"]').val()
    }
  })
    .done(function (newArticle) {
      console.log(newArticle._id);
      // The first row (index 0) contains the header, the second row (index 1)
      // contains the "create" row, we want to append the new article after the create row.
      var createRow = $('#articles > tr')[1];
      var newArticleElement = $(articleTemplate(newArticle)).insertAfter(createRow);
      
      $('#' + newArticle._id + 'remove').click(function() {
        removeArticle.call(this, newArticle.slug);
      });

      $('.modifyable-article-column > span').click(function(){
        modifyArticle.call(this, $(this).parent().parent());
      });
    })
    .fail(function (err, status) {
      console.log('Kartoteksartikel kunde inte läggas till!');
      console.log(err);
      console.log(status);
    });
};

var removeArticle = function(slug) {
  var confirmed = confirm("Är du säker på att du vill ta bort artikeln från kartoteket?");
  if(confirmed){
    $.ajax({
      type: 'DELETE',
      url: '/api/kartotekartikels/' + slug
    })
      .done(function () {
      })
      .fail(function (err, status) {
        console.log('Kartoteksartikel kunde inte tas bort!');
        console.log(err);
        console.log(status);
      });

    var row = $(this).parent().parent();
    row.remove();
  }
  else{
    return false;
  }
};

$(function() {
  // TODO: (Connect to)/(update in) database
  $('#article-add').click(addArticle);
  $('.article-remove').click(function() {
    removeArticle.call(this, $(this).parent().parent().data("slug"));
  });
  $('.modifyable-article-column > span').click(function(){
    modifyArticle.call(this, $(this).parent().parent());
  });
});
