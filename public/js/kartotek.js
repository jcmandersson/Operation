// This happends when we've replaced the uneditable table-element with
// an input-box. Now we want to listen to changes.
var saveArticle = function(elem) {
  var compiledModified = $('#modified-template').html();
  var modifiedTemplate = Handlebars.compile(compiledModified);

  var newValue = $(elem).val()
  $(elem).parent().html(modifiedTemplate({ name: newValue })).click(function() {
    modifyArticle.call($(this).find('span'));
  });
};

// Here we listen for clicks in an element of the table.
// When someone clicks we replace the html with an input box.
var modifyArticle = function() {
  var compiledModify = $('#modify-template').html();
  var modifyTemplate = Handlebars.compile(compiledModify);

  // This will essentially remove itself
  var currentValue = $(this).text();
  $(this).parent().html(modifyTemplate({ value: currentValue }));
  $('#currently-modifying').select().keydown(function(e) {
    // 13 = the enter key
    if (e.keyCode == 13) {
      saveArticle(this);
    }
  });
};

var addArticle = function() {
  var compiledArticle = $('#article-template').html();
  var articleTemplate = Handlebars.compile(compiledArticle);

  var row = $(this).parent().parent();
  var newArticle = {
    // This id will/should be the one we get from the databse instead
    // when we connect it to the database
    _id: Math.random(),
    name: row.find('[data-type="name"]').val(),
    storage: row.find('[data-type="storage"]').val(),
    section: row.find('[data-type="section"]').val(),
    shelf: row.find('[data-type="shelf"]').val(),
    tray: row.find('[data-type="tray"]').val()
  };

  // The first row (index 0) contains the header, the second row (index 1)
  // contains the "create" row, we want to append the new article after the create row.
  var createRow = $('#articles > tr')[1];
  var newArticleElement = $(articleTemplate(newArticle)).insertAfter(createRow);
  $('.article-remove').click(removeArticle);

  $(newArticleElement).find('.modifyable-article-column > span').click(modifyArticle);
};

var removeArticle = function() {
  var row = $(this).parent().parent();
  row.remove();
};

$(function() {
  // TODO: (Connect to)/(update in) database
  $('#article-add').click(addArticle);
  $('.article-remove').click(removeArticle);
  $('.modifyable-article-column > span').click(modifyArticle);
});
