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
  var slug = tablerow.data("slug");
  
  // This will essentially remove itself
  var currentValue = $(this).text();
  $(this).parent().html(modifyTemplate({ value: currentValue }));
  $('#currently-modifying').select().keydown(function(e) {
    // 13 = the enter key
    if (e.keyCode == 13) {
      saveArticle(this);
      
      console.log(tablerow);
      
      var name = tablerow.find("td[data-name='name']").find("span").html();
      var storage = tablerow.find("td[data-name='storage']").find("span").html();
      var section = tablerow.find("td[data-name='section']").find("span").html();
      var shelf = tablerow.find("td[data-name='shelf']").find("span").html();
      var tray = tablerow.find("td[data-name='tray']").find("span").html();
      console.log(section);

      $.ajax({
        type: 'GET',
        url: '/api/update/Kartotekartikel/' + slug,
        data: {
          name: name,
          storage: storage,
          section: section,
          shelf: shelf,
          tray: tray
        }
      })
        .done(function( msg ) {
        })
        .fail(function(err, status){
          console.log('Kunde inte ändra artikeln.');
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
      var createRow = $('#articles').find('tr')[1];
      var newArticleElement = $(articleTemplate(newArticle)).insertAfter(createRow);
      
      $('#' + newArticle._id + 'remove').click(function() {
        removeArticle.call(this, newArticle.slug);
      });

      $('.modifyable-article-column > span:not(.hasListener)').addClass('hasListener').click(function(){
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
  $('.modifyable-article-column > span:not(.hasListener)').addClass('.hasListener').click(function(){
    modifyArticle.call(this, $(this).parent().parent());
  });
});
