/*

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
        .fail(function(err, status) {
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
  if (confirmed) {
    $.ajax({
      type: 'DELETE',
      url: '/api/kartotekartikels/' + slug
    })
      .fail(function (err, status) {
        console.log('Kartoteksartikel kunde inte tas bort!');
        console.log(err);
        console.log(status);
      });

    var row = $(this).parent().parent();
    row.remove();
  }
  else {
    return false;
  }
};

$(function() {
  $('#article-add').click(addArticle);
  $('.article-remove').click(function() {
    removeArticle.call(this, $(this).parent().parent().data("slug"));
  });
  $('.modifyable-article-column > span:not(.hasListener)').addClass('.hasListener').click(function(){
    modifyArticle.call(this, $(this).parent().parent());
  });
});

*/

/*
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

      $('.modifyable-article-column > span:not(.hasListener)').addClass('hasListener').click(function() {
        modifyArticle.call(this, $(this).parent().parent());
      });
    })
    .fail(function (err, status) {
      console.log('Kartoteksartikel kunde inte läggas till!');
      console.log(err);
      console.log(status);
    });
};
*/

var Article = function() {
  this.data = {};
};

Article.prototype.createInDatabase = function(callback) {
  var self = this;
  $.ajax({
    type: 'POST',
    url: '/api/kartotekartikels',
    data: {
      name:    this.data.name,
      storage: this.data.storage,
      section: this.data.section,
      shelf:   this.data.shelf,
      tray:    this.data.tray
    }
  }).done(function(newArticle) {
    self.data.slug = newArticle.slug;
    callback();
  });
};

Article.prototype.removeFromDatabase = function(callback) {
  $.ajax({
    type: 'DELETE',
    url:  '/api/kartotekartikels/' + this.data.slug
  }).done(callback);
};

// This takes a single `td` element, and fills itself (i.e. this.data) with the columns.
Article.prototype.fillFromElement = function(elem) {
  this.data.name    = $(elem).find('[data-name="name"]').text();
  this.data.storage = $(elem).find('[data-name="storage"]').text();
  this.data.section = $(elem).find('[data-name="section"]').text();
  this.data.shelf   = $(elem).find('[data-name="shelf"]').text();
  this.data.tray    = $(elem).find('[data-name="shelf"]').text();
  this.data.slug    = $(elem).find('[data-name="slug"]').text();
};

// This takes a single `td` element, and fills itself (i.e. this.data) with the columns.
// The difference between this and .fillFromElement is that this takes
// data from `input` elements, whereas .fillFromElement takes data from `td` elements.
Article.prototype.fillFromInput = function(elem) {
  this.data.name    = $(elem).find('[data-name="name"]').val();
  this.data.storage = $(elem).find('[data-name="storage"]').val();
  this.data.section = $(elem).find('[data-name="section"]').val();
  this.data.shelf   = $(elem).find('[data-name="shelf"]').val();
  this.data.tray    = $(elem).find('[data-name="shelf"]').val();
  this.data.slug    = $(elem).find('[data-name="slug"]').val();
};

// Extract essentials (e.g. only name, storage, section, shelf, no functions(?), etc).
// Basically just the stuff that is necessary to render it to a template.
Article.prototype.essentials = function() {
  return this.data;
};


var articles = {
  data: {
    id: '#articles',
    template: '#articles-template',
    add: '#article-add',
    currentlyModifyingArticle: undefined,
    currentlyModifyingColumn: undefined,
    articles: []
  },
  // Fills itself (this.data.articles) with
  // the content in the $(this.data.id) DOM-element.
  // This is supposed to be used directly after the site has
  // loaded, thus it will assume the structure is similar
  // to that of the $('#articles') element in kartotek.hbs.
  fillFromElement: function(elem) {
    var elems = $(this.data.id).find('tr');
    // The first and second element contains the header and the
    // "add article" column, so ignore those.
    for (var i = 2; i < elems.length; i++) {
      var newArticle = new Article();
      newArticle.fillFromElement(elems[i]);
      this.data.articles.push(newArticle);
    }

    // Yes, we could to this inside the above loop.
    // Yes, this is three times slower.
    // But the truth is that performance doesn't matter much.
    // This is not a bottleneck. (E.g. the internet is a much larger bottleneck.)
    this.attachModifyEntryListeners();
    this.attachRemoveArticleListeners();
  },
  findArticle: function(slugName) {
    for (var i = 0; i < this.data.articles.length; i++) {
      if (slugName === this.data.articles[i].data.slug) {
        return i;
      }
    }
  },
  // This should essentially only be used when attaching event listeners.
  findArticleInDOM: function(slug) {
    return $(this.data.id).find('[data-slug="'+slug+'"]');
  },
  // Extract the essentials from this.data.
  // Basically just the stuff that is necessary to render it to a template.
  essentials: function() {
    var essentials = [];
    for (var i = 0; i < this.data.articles.length; i++) {
      essentials.push(this.data.articles[i].essentials());
    }

    return essentials;
  },
  render: function() {
    var templateHTML     = $(this.data.template).html();
    var compiledTemplate = Handlebars.compile(templateHTML);
    var newHTML          = compiledTemplate({ articles: this.essentials() });
    $(this.data.id).html(newHTML);

    this.attachAddArticleListener();
    this.attachModifyEntryListeners();
    this.attachModifyEntryFinishedListener();
    this.attachRemoveArticleListeners();
  },
  getRowWhichContainsCreate: function() {
    // The first row (index 0) contains the header, the second row (index 1)
    // contains the "create" row, we want to append the new article after the create row.
    return $(this.data.id).find('tr')[1];
  },
  addArticle: function(article) {
    var self = this;
    // Assumes it is added to the top in the database.
    // A clear way would be to query the db, but that
    // feels unnecessary.
    this.data.articles.unshift(article);
    article.createInDatabase(this.render.bind(this));
  },
  attachAddArticleListener: function() {
    var self = this;

    $(this.data.add).click(function() {
      var newArticle = new Article();
      var rowWhichContainsCreate = $(self.getRowWhichContainsCreate());
      newArticle.fillFromInput(rowWhichContainsCreate);

      self.addArticle(newArticle);
    });
  },
  resetCurrentlyModifying: function() {
    this.data.articleCurrentlyModifying.reset();
    this.render();
  },
  attachModifyEntryListeners: function() {
    var elems = $(this.data.id).find('.modifyable-article-column');
    for (var i = 0; i < elems.length; i++) {
      var self = this;
      $(elems[i]).click(function(e) {
        var slug   = $(e.target).parent().parent().find('[data-name="slug"]').text();
        var column = $(e.target).parent().data('name');
        self.modifyEntryListener.call(self, slug, column);
      });
    }
  },
  attachRemoveArticleListeners: function() {
    var elems = $(this.data.id).find('tr');
    for (var i = 0; i < elems.length; i++) {
      $(elems[i]).find('.article-remove').click(this.removeArticleListener);
    }
  },
  removeArticleListener: function() {
    var confirmed = confirm("Är du säker på att du vill ta bort artikeln från kartoteket?");
    if (confirmed) {
      var rowToDelete    = $(this).parent().parent();
      var slugName       = rowToDelete.find('[data-name="slug"]').html();
      var articleIndex   = articles.findArticle(slugName);
      var removedArticle = articles.data.articles.splice(articleIndex, 1)[0];
      removedArticle.removeFromDatabase();
      // Alternatively we could to `rowToDelete.remove()` here
      // (if performance becomes an issue), but this is cleaner.
      articles.render();
    }
  },
  isEntryThatIsCurrentlyBeingModified: function(slugName, type) {
    if (this.currentlyModifyingArticle === undefined ||
        this.currentlyModifyingArticle === undefined) {
      return false;
    }
    return (this.currentlyModifyingArticle.data.slug  === slugName) &&
           (this.currentlyModifyingColumn === type);
  },
  modifyEntryListener: function(slug, type) {
    if (!this.isEntryThatIsCurrentlyBeingModified(slug, type)) {
      var article = this.findArticle(slug);
      this.currentlyModifyingArticle = this.data.articles[article];
      this.currentlyModifyingColumn  = type;
      this.render();
    }
  },
  attachModifyEntryFinishedListener: function() {
    // TODO:
    // 1) Make it work to press enter.
    // 2) Autofocus on currentlyModifying entry. (Do this in modifyEntryListener probably.)
    // 3) Make sure all modification events are re-connected on render.
    // 4) Connect modification to DB.
    // 5) Implement search.
  }
};

$(function() {
  // This is ugly, and they should really be inside the helper below, but we
  // need to do this for performance reasons.
  var compiledModified = $('#modify-template').html();
  var modifiedTemplate = Handlebars.compile(compiledModified);

  Handlebars.registerHelper('modifyable', function(slugName, type, currentValue) {
    var isModifyable = articles.isEntryThatIsCurrentlyBeingModified(slugName, type);
    return modifiedTemplate({ isModifyable: isModifyable, value: currentValue });
  });

  window.articles.fillFromElement();
  window.articles.attachAddArticleListener();
});
