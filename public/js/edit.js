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

    if(typeof slug === 'undefined' || slug.length <= 0) {
      console.log('Varning: Inget slug!');
      return;
    }
    
    $.ajax({
      type: 'DELETE',
      url: '/api/' + model + 's/' + slug
    }).done(function (msg) {
      setLastSaved(new Date());
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

    if(typeof slug === 'undefined' || slug.length <= 0) {
      console.log('Varning: Inget slug!');
      return;
    }
    
    var data = {};
    if (typeof updated === 'object') {
      data = updated;
    } else {
      data[$e.attr('data-field')] = updated;
    }

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

  $(".process-content").sortable({
    cancel: 'input,.mce-tinymce',
    stop: function (e, ui) {
      var $this = $(this);
      console.log($this);
      $this.find('.process-content-item').each(function (i, e) {
        var $e = $(e);
        REST.update($e, {order: $('.process-content .process-content-item').index(e)}, function (err, msg) {});
      });
    }
  });

  $('.nav-pills').sortable({
    cancel: '.newProcess',
    stop: function (e, ui) {
      var $this = $(this);
      $this.find('.process-item').each(function (i, e) {
        var $e = $(e);
        var $input = $e.find('input');
        REST.update($input, {order: $('.nav-pills .process-item').index(e)}, function(err, msg) {});
      });
    }
  });
  
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
      process: $parent.attr('data-id'),
      order: $('.process-content .process-content-item').length()
    }, function (err, msg) {
      if (err) {
        console.log(err);
        return;
      }
      $this.parent().parent().attr('data-slug', msg.slug).find('[data-model="Processinnehall"]').attr('data-slug', msg.slug);
    });
  };

  var newProcess = function (e) {
    e.preventDefault();
    var value = $('.newProcess input').val();
    REST.create('Processteg', {
      title: value,
      operation: $('form.operationForm').attr('data-id'),
      order: $('.process-item').length()
    }, function (err, msg) {
      if (err) {
        console.log(err);
        return;
      }
      var $content = $(templates.processContent(msg)).insertAfter($('.process-content').last());
      $(templates.processContentItem({noData: 1})).appendTo($content);
      $content.find('.process-content-item').each(function (i, e) {
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
  var removeProcessContentItem = function () {
    if (!confirm('Vill du verkligen ta bort denna rubrik?')) return;
    var $item = $(this).parent();
    var slug = $item.attr('data-slug');
    REST.remove($item, function (err, msg) {
      console.log(err);
      console.log(msg);
      $('[data-slug="' + slug + '"]').remove();
    });
  };

  var removeProcess = function () {
    if (!confirm('Vill du verkligen ta bort denna process?')) return;
    var $item = $(this);
    var slug = $item.attr('data-slug');
    REST.remove($item, function (err, msg) {
      console.log(err);
      console.log(msg);
      $('[data-slug="' + slug + '"]').remove();
    });
  };

  $('body')
    .on('click', '.process-content-item .glyphicon-remove', removeProcessContentItem)
    .on('click', '.process-item .glyphicon-remove', removeProcess);
};

var attachViewListeners = function () {
  var navClick = function () {
    $('.nav-pills li.process-item .active').removeClass('active');
    var $this = $(this).addClass('active');
    $(".process-content").hide();
    if ($(this).attr('data-id') == 'checklist') {
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
