var socket = io();

var Article = function(data) {
  if (typeof data !== 'undefined') this.data = data;
  else this.data = {};
};

Article.prototype.createInDatabase = function(callback) {
  var self = this;
  $.ajax({
    type: 'POST',
    url: '/api/kartotekartikels',
    data: this.data
  }).done(function(newArticle) {
    self.data.slug = newArticle.slug;
    callback();
  });
};

Article.prototype.modifyInDatabase = function(callback) {
  var self = this;
  $.ajax({
    type: 'GET',
    url: '/api/update/Kartotekartikel/' + this.data.slug,
    data: this.data
  }).done(function(newArticle) {
    self.data.slug = newArticle.slug;
    if (typeof callback !== 'undefined') callback();

    // Send through socket.io to live update preparations.
    // TODO: Shouldn't be hard-coded like this. What if we add new columns? Just use newArticle.data
    socket.emit('kartotekUpdate', {
      name: newArticle.name,
      tags: newArticle.tags,
      articleNumber: newArticle.articleNumber,
      clinic: newArticle.clinic,
      storage: newArticle.storage,
      section: newArticle.section,
      shelf: newArticle.shelf,
      tray: newArticle.tray,
      price: newArticle.price,
      id: newArticle._id
    })
  });
};

Article.prototype.removeFromDatabase = function(callback) {
  console.log(this.data.slug);
  socket.emit("removeKartotekArticle", this.data.slug);
  $.ajax({
    type: 'DELETE',
    url:  '/api/kartotekartikels/' + this.data.slug
  }).done(callback);
};

// This takes a single `td` element, and fills itself (i.e. this.data) with the columns.
Article.prototype.fillFromElement = function(elem) {
  this.data.name                  = $(elem).find('[data-name="name"]').text();
  this.data.tags                  = $(elem).find('[data-name="tags"]').text();
  this.data.storage               = $(elem).find('[data-name="storage"]').text();
  this.data.section               = $(elem).find('[data-name="section"]').text();
  this.data.shelf                 = $(elem).find('[data-name="shelf"]').text();
  this.data.tray                  = $(elem).find('[data-name="tray"]').text();
  this.data.price                 = $(elem).find('[data-name="price"]').text();
  this.data.articleNumber         = $(elem).find('[data-name="articleNumber"]').text();
  this.data.supplier              = $(elem).find('[data-name="supplier"]').text();
  this.data.supplierArticleNumber = $(elem).find('[data-name="supplierArticleNumber"]').text();
  this.data.orderItem             = $(elem).find('[data-name="orderItem"]').text();
  this.data.clinic                = $(elem).find('[data-name="clinic"]').text();
  this.data.amount                = $(elem).find('[data-name="amount"]').text();
  this.data.unit                  = $(elem).find('[data-name="unit"]').text();
  this.data.peoe                  = $(elem).find('[data-name="peoe"]').text();
  this.data.slug                  = $(elem).find('[data-name="slug"]').text();
};

/**
 * This takes a single `td` element, and fills itself (i.e. this.data) with the columns.
 * The difference between this and .fillFromElement is that this takes
 * data from `input` elements, whereas .fillFromElement takes data from `td` elements.
 */
Article.prototype.fillFromInput = function(elem) {
  this.data.name                  = $(elem).find('[data-name="name"]').val();
  this.data.tags                  = $(elem).find('[data-name="tags"]').val();
  this.data.storage               = $(elem).find('[data-name="storage"]').val();
  this.data.section               = $(elem).find('[data-name="section"]').val();
  this.data.shelf                 = $(elem).find('[data-name="shelf"]').val();
  this.data.tray                  = $(elem).find('[data-name="tray"]').val();
  this.data.price                 = $(elem).find('[data-name="price"]').val();
  this.data.articleNumber         = $(elem).find('[data-name="articleNumber"]').val();
  this.data.supplier              = $(elem).find('[data-name="supplier"]').val();
  this.data.supplierArticleNumber = $(elem).find('[data-name="supplierArticleNumber"]').val();
  this.data.orderItem             = $(elem).find('[data-name="orderItem"]').val();
  this.data.clinic                = $(elem).find('[data-name="clinic"]').val();
  this.data.amount                = $(elem).find('[data-name="amount"]').val();
  this.data.unit                  = $(elem).find('[data-name="unit"]').val();
  this.data.peoe                  = $(elem).find('[data-name="peoe"]').val();
  this.data.slug                  = $(elem).find('[data-name="slug"]').val();
};

/**
 *Extract essentials (e.g. only name, storage, section, shelf, no functions(?), etc).
 * Basically just the stuff that is necessary to render it to a template.
 */
Article.prototype.essentials = function() {
  return this.data;
};


var articles = {
  data: {
    id: '#articles',
    template: '#articles-template',
    add: '#article-add',
    toggleNumVisibleColumns: '#toggle-fields',
    currentlyModifyingArticle: undefined,
    currentlyModifyingColumn: undefined,
    showAllColumns: false,
    articles: []
  },

  /**
   * Fills itself (this.data.articles) with
   * the content in the $(this.data.id) DOM-element.
   * This is supposed to be used directly after the site has
   * loaded, thus it will assume the structure is similar
   * to that of the $('#articles') element in kartotek.hbs.
   */
  fillFromElement: function(elem) {
    var elems = $(this.data.id).find('tr');

    /**
     * The first and second element contains the header and the
     * "add article" column, so ignore those.
     */
    for (var i = 2; i < elems.length; i++) {
      var newArticle = new Article();
      newArticle.fillFromElement(elems[i]);
      this.data.articles.push(newArticle);
    }

    /**
     * Yes, we could to this inside the above loop.
     * Yes, this is three times slower.
     * But the truth is that performance doesn't matter much.
     * This is not a bottleneck. (E.g. the internet is a much larger bottleneck.)
     */
    this.attachModifyEntryListeners();
    this.attachRemoveArticleListeners();
  },
  addFromDB: function(dbRes) {
    for (var i = 0; i < dbRes.length; i++) {
      this.data.articles.push(new Article(dbRes[i]));
    }
    this.render();
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

  /**
   * Give this an element (like the `td` storage-column on the third row),
   * and it'll return the slug-name for that row.
   */
  findSlugNameFromEntryElement: function(el) {
    return $(el).parent().parent().find('[data-name="slug"]').text();
  },

  /**
   * Extract the essentials from this.data.
   * Basically just the stuff that is necessary to render it to a template.
   */
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
    var newHTML          = compiledTemplate({
      showAllColumns: this.data.showAllColumns,
      articles: this.essentials()
    });
    $(this.data.id).html(newHTML);

    this.attachAddArticleListener();
    this.attachModifyEntryListeners();
    this.attachModifyEntryFinishedListener();
    this.attachRemoveArticleListeners();
  },
  getRowWhichContainsCreate: function() {

    /**
     * The first row (index 0) contains the header, the second row (index 1)
     * contains the "create" row, we want to append the new article after the create row.
     */
    return $(this.data.id).find('tr')[1];
  },
  addArticle: function(article) {

    /**
     * Assumes it is added to the top in the database.
     * A clear way would be to query the db, but that
     * feels unnecessary.
     */
    this.data.articles.unshift(article);
    article.createInDatabase(this.render.bind(this));
  },
  modifyEntry: function(el) {
    var slugName     = this.findSlugNameFromEntryElement(el);
    var articleIndex = this.findArticle(slugName);
    var columnType   = $(el).parent().data('name');
    var article      = this.data.articles[articleIndex];
    article.data[columnType] = $(el).val();

    article.modifyInDatabase();
  },
  attachAddArticleListener: function() {
    var self = this;

    $('[data-admin="true"]').find(this.data.add).click(function() {
      var newArticle = new Article();
      var rowWhichContainsCreate = $(self.getRowWhichContainsCreate());
      newArticle.fillFromInput(rowWhichContainsCreate);

      self.addArticle(newArticle);
    });
  },
  resetCurrentlyModifying: function() {
    this.currentlyModifyingArticle = undefined;
    this.currentlyModifyingColumn  = undefined;
    this.render();
  },
  attachModifyEntryListeners: function() {
    var elems = $('[data-admin="true"]').find(this.data.id).find('.modifyable-article-column');
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
    var elems = $('[data-admin="true"]').find(this.data.id).find('tr');
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

      /**
       * Alternatively we could to `rowToDelete.remove()` here
       * (if performance becomes an issue), but this is cleaner.
       */
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
    var self = this;

    var focusOnEndOfText = function(el) {
      el.focus();
      el.val(el.val());
    };

    focusOnEndOfText($('#currently-modifying'));
    $('#currently-modifying').keyup(function(e) {
      var ENTER_KEYCODE = 13;
      if (e.keyCode == ENTER_KEYCODE) {
        self.modifyEntry.call(self, e.target);
        self.resetCurrentlyModifying.call(self);
      }
    });
  },
  attachSearchArticleListener: function() {
    console.log('this: ' + this);
    var self = this;
    var timeout = null;
    var search = function(e, $element) {
      var value = $(this).val();
      $.ajax({
        type: 'GET',
        url:  '/api/search/Kartotekartikel/',
        data: {
          all: true,
          limit: 50,
          sort: 'name',
          text: value
        }
      }).done(function(msg) {
        self.data.articles = [];
        var done = self.addFromDB.bind(self);
        done(msg);
      });
    };

    $('#search-article').keyup(search);
  },
  attachScrollBottomListener: function() {
    var self = this;
    $(window).scroll(function() {
      if ($(window).scrollTop() + $(window).height() < $(document).height() - 100) {
        self.scrollEvent = false;
        return;
      }
      if (typeof self.scrollEvent !== 'undefined' && self.scrollEvent) return;
      self.scrollEvent = true;
      var value = $('#search-article').val();
      $.ajax({
        type: 'GET',
        url:  '/api/search/Kartotekartikel/',
        data: {
          all: true,
          limit: 50,
          skip: $('#articles .check-js').length,
          sort: 'name',
          text: value
        }
      }).done(self.addFromDB.bind(self));
    });
  },
  attachToggleNumColumnsVisibleListener: function() {
    var self = this;
    $(this.data.toggleNumVisibleColumns).click(function(e) {
      self.data.showAllColumns = e.target.checked;
      self.render();
    });
  }
};

$(function() {

  /**
   * This is ugly, and this compilation should really be inside the helper below, but we
   * need to do this for performance reasons.
   */
  var compiledModified = $('#modify-template').html();
  var modifiedTemplate = Handlebars.compile(compiledModified);

  Handlebars.registerHelper('modifyable', function(slugName, type, currentValue) {
    var isModifyable = articles.isEntryThatIsCurrentlyBeingModified(slugName, type);
    return modifiedTemplate({ isModifyable: isModifyable, value: currentValue });
  });

  window.articles.fillFromElement();
  window.articles.attachAddArticleListener();
  window.articles.attachSearchArticleListener();
  window.articles.attachScrollBottomListener();
  window.articles.attachToggleNumColumnsVisibleListener();
  // This line essentially removes all benefits of rending via node, but
  // otherwise there's just so much duplicate code!
  window.articles.render();
});
