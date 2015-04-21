var templates = {
  processItem: function (data) {
    var template = Handlebars.compile($('#process-item-template').html());
    return template(data);
  },
  processContent: function (data) {
    var template = Handlebars.compile($('#process-content-template').html());
    return template(data);
  },
  processContentItem: function (data) {
    var template = Handlebars.compile($('#process-content-item-template').html());
    return template(data);
  }
};

var REST = {
  remove: function ($e, callback) {
    var slug = $e.attr('data-slug');
    var model = $e.attr('data-model');
    var $remove = $($e.attr('data-element'));

    $.ajax({
      type: 'DELETE',
      url: '/api/' + model + 's/' + slug
    }).done(function (msg) {
      setLastSaved(new Date());
      if ($remove.length !== 1) {
        console.log('Found more then 1 element that matches "' + $e.attr('data-element') + '"');
        return callback('Found more then 1 element that matches "' + $e.attr('data-element') + '"');
      }
      $remove.remove();
      callback(null, msg);
    }).fail(function (err, status) {
      if (err) alert(err);
      callback(err, status);
    });
    return true;
  },

  update: function ($e, updated, callback) {
    var slug = $e.attr('data-slug');
    var model = $e.attr('data-model');
    var data = {};
    if (typeof updated === 'Object') {
      data = updated;
    } else {
      data[$e.attr('data-field')] = updated;
    }

    console.log(data);

    $.ajax({
      type: 'GET',
      url: '/api/update/' + model + '/' + slug,
      data: data
    }).done(function (msg) {
      setLastSaved(new Date());

      if (model === 'Operation' && typeof window.history.pushState !== 'undefined') {
        window.history.pushState(msg.title, document.title, '/edit/' + msg.slug);
      }

      $('[data-model="' + model + '"][data-slug="' + slug + '"]').attr('data-slug', msg.slug);
      callback(null, msg);
    }).fail(function (err, status) {
      if (err) alert(err);
      callback(err, status);
    });
    return true;
  },

  create: function (model, data, callback) {
    $.ajax({
      type: 'POST',
      url: '/api/' + model + 's',
      data: data
    }).done(function (msg) {
      setLastSaved(new Date());
      // TODO - create from template and insert in DOM
      callback(null, msg);
    }).fail(function (err, status) {
      if (err) alert(err);
      callback(err, status);
    });
  }
};

var initializeSpecialitetSelect = function () {
  $(".specialitet-select").select2({
    ajax: {
      type: 'GET',
      url: '/api/search/Specialitet/',
      dataType: 'json',
      delay: 250,
      data: function (params) {
        return {
          text: params.term, // search term
          all: 1
        };
      },
      processResults: function (data) {
        return {
          results: $.map(data, function (item) {
            return {
              text: item.name, id: item._id
            }
          })
        };
      },
      cache: true
    },
    escapeMarkup: function (markup) {
      return markup;
    }, // let our custom formatter work
    minimumInputLength: 0
  });
};

var initializeTagInput = function () {
  $('.tags').tagsInput({
    width: 'auto',
    defaultText: 'Lägg till synonym',
    removeWithBackspace: false,
    height: '40px',
    'onChange': function ($input, tag) {
      if (typeof tag === 'undefined') return;
      var value = $($input).val();
      if (value.length) {
        REST.update($($input), value, function (err, msg) {
        });
      }
    }
  });
};

var initializeWysiwygElement = function ($e) {
  if ($e.find('.mce-tinymce').length) return;

  $e.find(':not(.mce-tinymce) textarea:not(.wysiwyg)').addClass('wysiwyg').tinymce({
    plugins: 'advlist autoresize charmap contextmenu image ' +
    'media print anchor link paste tabfocus textcolor ' +
    'autolink insertdatetime lists searchreplace table ' +
    'wordcount imageupload',
    toolbar1: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify |  | bullist numlist outdent indent | link image imageupload',
    imageupload_url: '/api/upload',
    setup: function (editor) {
      var onChange = function (e) {
        REST.update($(e.target.targetElm), $(e.target.targetElm).val(), function (err, msg) {
        });
      };
      editor.on('change', onChange);
      // TODO - Lägg till så det sparas när man slutar skriva och inte bara när man tar bort fokus.
    }
  });
};

var setLastSaved = function (date) {
  $('.lastSave .time').text(new Date(date).format());
};

var changeWidth = function (i, e) {
  var $this = typeof e === 'undefined' ? $(this) : $(e);
  $this.width(($this.val().length + 1) * 8);
};

var attachUpdateListeners = function () {

  var sendToPreview = function (e) {
    e.preventDefault();
    REST.update($(this), $(this).attr('data-val'), function (err, msg) {
      if (err) {
        alert('Kunde inte skicka handboken till granskning.');
        return;
      }
      window.location = '/info/' + msg.slug;
    });
  };
  // TODO - Add on change/keypress listeners
  $('body')
    .on('change', 'input[data-update="true"][data-slug],select[data-update="true"]', function () {
      console.log('UPDATE');
      REST.update($(this), $(this).val(), function (err, data) {
        console.log(err);
        console.log(data);
      });
    })
    .on('click', '.toReview[data-update="true"]', sendToPreview);
};

var attachCreateListeners = function () {
  
  var newProcessContentItem = function () {
    var $this = $(this);
    var $parent = $this.parents().eq(2);
    initializeWysiwygElement($(templates.processContentItem({noData: 1})).appendTo($parent));
    
    REST.create('Processinnehall', {
      title: $(this).val(),
      process: $parent.attr('data-id')
    }, function (err, msg) {
      if (err) {
        console.log(err);
        return;
      }
      $this.parent().parent().attr('data-slug', msg.slug).find('[data-model="Processinnehall"]').attr('data-slug', msg.slug);
    });
  };
  
  var newProcess = function(e) {
    e.preventDefault();
    var value = $('.newProcess input').val();
    REST.create('Processteg', {
      title: value,
      operation: $('form.operationForm').attr('data-id')
    }, function (err, msg) {
      if (err) {
        console.log(err);
        return;
      }
      var $content = $(templates.processContent(msg)).insertAfter($('.process-content').last());
      $(templates.processContentItem({noData: 1})).appendTo($content);
      $content.find('.process-content-item').each(function(i, e) {
        initializeWysiwygElement($(e));
      });
      $(templates.processItem(msg)).insertBefore($('.newProcess input').parent()).find('input').click();
      $('.newProcess input').val('');
      $('input.process').each(changeWidth);
    });
  };

  var onEnter = function (event) {
    if ((event.keyCode || event.which) === 13) newProcess(event);
  };

  $('body')
    .on('keyup', '.process-content-item:last-child .rubrik', newProcessContentItem)
    .on('keyup', '.newProcess input', onEnter)
    .on('click', '.newProcess .glyphicon-plus', newProcess);
};

var attachRemoveListeners = function () {

};

var attachViewListeners = function () {
  var navClick = function () {
    $('.nav-pills li.process-item .active').removeClass('active');
    var $this = $(this).addClass('active');
    $(".process-content").hide();
    if ($(this).attr('data-id') == 'checklist'){
      $('#contentchecklist').show();
    } else {
      $('.process-content[data-slug="' + $(this).attr('data-slug') + '"]').show();
    }
  };
  
  $('input.process').each(changeWidth);
  
  $('body')
    .on('keyup', 'input.process', changeWidth)
    .on('click', '.navbar-btn', navClick);
};

$(document).ready(function () {
  initializeSpecialitetSelect();
  initializeTagInput();

  $('.process-content:not(.hidden) .process-content-item').each(function (i, e) {
    initializeWysiwygElement($(e));
  });

  attachUpdateListeners();
  attachCreateListeners();
  attachRemoveListeners();

  attachViewListeners();
});
