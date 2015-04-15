var setLastSaved = function (date) {
  $('.lastSave .time').text(new Date(date).format());
};

var onProgress = function (e) {
  if (e.lengthComputable) {
    console.log(e.loaded / e.total * 100 + '%');
  } else {
    console.log('hehe');
  }
};

var abstractUpdate = function (url, data, preKey, callback) {
  var slug = $('.data ' + preKey + 'slug"]').val();
  if (typeof slug === 'undefined') {
    callback('Error: Cant find slug', 'No slug');
    return false;
  }

  $.ajax({
    type: 'GET',
    url: url + slug,
    data: data,
    xhrFields: {
      onprogress: onProgress
    }
  })
    .done(function (msg) {

      for (var key in msg) {
        var $e = $('.data [data-operation="' + key + '"]');
        var $e = $('.data ' + preKey + key + '"]');
        if ($e.length) {
          $e.val(msg[key])
        }
      }

      setLastSaved(new Date());

      callback(null, msg);
    })
    .fail(function (err, status) {
      if (err) alert(err);
      callback(err, status);
    });

  return true;
};

var abstractRest = function (type, url, preKey, callback) {
  var slug = $('.data ' + preKey + 'slug"]').val();

  $.ajax({
    type: type,
    url: url + slug,
    xhrFields: {
      onprogress: onProgress
    }
  })
    .done(function (msg) {
      setLastSaved(new Date());
      callback(null, msg);
    })
    .fail(function (err, status) {
      if (err) alert(err);
      callback(err, status);
    });
};

var updateOperation = function (data, callback) {
  return abstractUpdate(
    '/api/update/operations/',
    data,
    '[data-operation="',
    callback
  );
};

var updateProcess = function (index, data, callback) {
  return abstractUpdate(
    '/api/update/Processteg/',
    data,
    '[data-process-index="' + index + '"] [data-process="',
    callback
  );
};
var removeProcess = function (index, callback) {
  return abstractRest('DELETE',
    '/api/Processtegs/',
    '[data-process-index="' + index + '"] [data-process="',
    function (err, msg) {
      if (!err) {
        removeAllProcessContent(index, function (err, msg) {
          if (!err) $('.data [data-process-index="' + index + '"]').remove();
        });
      }
      callback(err, msg);
    });
};

var removeProcessContent = function (processIndex, index, callback) {
  return abstractRest('DELETE',
    '/api/Processinnehalls/',
    '[data-process-index="' + processIndex + '"] [data-content-index="' + index + '"] [data-process-content="',
    function (err, msg) {
      if (!err) {
        $('.data [data-process-index="' + processIndex + '"] [data-content-index="' + index + '"]').remove();
      }
      callback(err, msg);
    });
};

var updateProcessContent = function (processIndex, index, data, callback) {
  return abstractUpdate(
    '/api/update/Processinnehall/',
    data,
    '[data-process-index="' + processIndex + '"] [data-content-index="' + index + '"] [data-process-content="',
    callback
  );
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

var changeProcessContent = function (parentIndex, index) {
  var $parent;
  if ($(this).hasClass('rubrik')) {
    $parent = $(this).parent().parent();
  } else if ($(this).hasClass('checkAble')) {
    $parent = $(this).parent().parent().parent();
  } else {
    $parent = $('.process-content-item[data-parent="' + parentIndex + '"][data-id="' + index + '"]').last();
  }
  var rubrik = $parent.find('.rubrik').val();
  var content = $parent.find('textarea').val();
  var checkAble = $parent.find('.checkAble').is(":checked");
  if (!rubrik || !rubrik.length) return;

  var processIndex = $parent.attr('data-parent');
  var thisIndex = $parent.attr('data-id');

  var $data = $('.data [data-process-index="' + processIndex + '"] [data-content-index="' + thisIndex + '"]');
  var data = {
    title: rubrik,
    text: content,
    checkAble: checkAble
  };
  if ($data.length) {
    updateProcessContent(processIndex, thisIndex, data, function (err, msg) {

    });
  } else {
    addProcessContent(processIndex, data, function (err, msg) {
      initAll();
    });
  }
};

var addProcess = function (data, callback) {
  var nextIndex = 0;
  var $lastElement = $('.data [data-process-index]');
  if ($lastElement.length) {
    nextIndex = parseInt($lastElement.last().attr('data-process-index')) + 1;
  }

  data.operation = $('.data [data-operation="id"]').val();

  $.ajax({
    type: 'POST',
    url: '/api/Processtegs',
    data: data,
    xhrFields: {
      onprogress: onProgress
    }
  })
    .done(function (msg) {
      var $newData = $('<div></div>').attr('data-process-index', nextIndex).attr('data-process-id', msg._id);

      for (var key in msg) {
        if (typeof msg[key] == 'string' || msg[key] instanceof String) {
          var $e = $('<input type="text">').attr('data-process', key).val(msg[key]);
          $e.appendTo($newData);
        }
      }
      $newData.append('<div class="data-processContents"></div>');
      $newData.appendTo($('.data-processes'));
      setLastSaved(new Date());
      callback(null, msg);
    })
    .fail(function (err, status) {
      if (err) alert(err);
      callback(err, status);
    });
};

var addProcessContent = function (processIndex, data, callback) {
  var nextIndex = 0;
  var $lastElement = $('.data [data-process-index="' + processIndex + '"] [data-content-index]');
  if ($lastElement.length) {
    nextIndex = parseInt($lastElement.last().attr('data-content-index')) + 1;
  }
  data.process = $('.data [data-process-index="' + processIndex + '"]').attr('data-process-id');

  $.ajax({
    type: 'POST',
    url: '/api/Processinnehalls',
    data: data,
    xhrFields: {
      onprogress: onProgress
    }
  })
    .done(function (msg) {
      var $newData = $('<div></div>').attr('data-content-index', nextIndex).attr('data-content-id', msg._id);

      for (var key in msg) {
        if (typeof msg[key] == 'string' || msg[key] instanceof String) {
          var $e = $('<input type="text">').attr('data-process-content', key).val(msg[key]);
          $e.appendTo($newData);
        }
      }
      $newData.appendTo($('.data [data-process-index="' + processIndex + '"] .data-processContents'));
      callback(null, msg);
    })
    .fail(function (err, status) {
      if (err) alert(err);
      callback(err, status);
    });
};

var removeAllProcessContent = function (processIndex, callback) {
  var $processData = $('.data [data-process-index="' + processIndex + '"] .data-processContents');
  $processData.find('[data-content-index]').each(function (i, e) {
    $.ajax({
      type: 'DELETE',
      url: '/api/Processinnehalls/' + $(e).find('[data-process-content="slug"]').val(),
      xhrFields: {
        onprogress: onProgress
      }
    })
      .done(function (msg) {
        setLastSaved(new Date());
        callback(null, msg);
      })
      .fail(function (err, status) {
        if (err) alert(err);
        callback(err, status);
      });
  });
};

var newProcess = function (e) {
  var value = $('.newProcess input').val();
  if (!value) return;

  addProcess({title: value}, function (err, msg) {
    var $last = $('.process-item').last();
    $('.process-item input').each(function(i, e){
      var nr = parseInt($(e).attr('data-id'));
      if(nr > parseInt($last.find('input').attr('data-id'))){
        $last = $(e).parent();
      }
    });
    var $clone = $last.clone().removeClass('hidden');
    var $input = $clone.find('.process');
    var newIndex = parseInt($input.attr('data-id')) + 1;
    $input.attr('data-id', newIndex).attr('name', 'process' + newIndex).val(value);
    $clone.insertAfter($('.process-item').last());

    var $contentClones = $('.process-content.mall').clone().removeClass('mall hidden').insertAfter($('.process-content').last());
    $contentClones.attr('data-id', newIndex).attr('id', 'content' + newIndex)
    $contentClones.find('.process-content-item').addClass('init');

    $('.newProcess input').val('');
    $('.nav-pills li.process-item .btn').last().click();
    initAll();
  });
};
var onEnter = function (event) {
  var key = event.keyCode || event.which;
  if (key === 13) {
    newProcess(event);
  }
};

var delProcess = function (e) {
  if (!window.confirm('Vill du verkligen ta bort hela processen?')) return;

  var index = $(this).parent().find('.process').attr('data-id');
  removeProcess(index, function (err, msg) {
    $('input.process[data-id="' + index + '"]').parent().remove();
    $('.process-content[data-id="' + index + '"]').remove();
    $('[name="processId' + index + '"]').remove();
  });
};

var sendToPreview = function (e) {
  e.preventDefault();

  updateOperation({state: 'Granskning'}, function (err, msg) {
    window.location = '/info/' + msg.slug;
  });
};

var navClick = function () {
  $('.nav-pills li.process-item .active').removeClass('active');
  var $this = $(this).addClass('active');
  $(".process-content").hide();
  $("#content" + $this.attr('data-id')).show();
};

var changeName = function (e) {
  var value = $(this).val();
  if (value.length) {
    updateOperation({title: value}, function (err, msg) {
      if (typeof window.history.pushState !== 'undefined') {
        window.history.pushState(msg.title, document.title, '/edit/' + msg.slug);
      }
    });
  }
};

var changeSpecialitet = function (e) {
  var value = $(this).val();
  if (value.length) {
    updateOperation({specialty: value}, function (err, msg) {
    });
  }
};


var changedProcess = function (e) {
  var value = $(this).val();
  var index = $(this).attr('data-id');

  if (value.length && typeof index !== 'undefined') {
    updateProcess(index, {title: value}, function (err, msg) {
    });
  }
};

var createNewItem = function () {
  var $parent = $(this).parents().eq(2);
  var $clone = $('.hidden .process-content-item').first().clone().removeClass('hidden').addClass('init').appendTo($parent);

  initAll();
};

var delProcessContent = function (e) {
  if (!confirm('Vill du verkligen ta bort underrubriken?')) return;
  var $parent = $(this).parent();
  var processIndex = $parent.attr('data-parent');
  var index = $parent.attr('data-id');

  removeProcessContent(processIndex, index, function (err, msg) {
    if (!err) {
      $('.process-content-item[data-parent="' + processIndex + '"][data-id="' + index + '"]').remove();
    }
  });
};

var changeWidth = function () {
  $(this).width(($(this).val().length + 1) * 8);
};

var initProcessContent = function (i, e) {
  var $last = $(e).find('.process-content-item:not(.init,.hidden)').last();
  var parent = parseInt($(e).attr('data-id'));
  var id = $last.length == 0 ? 0 : parseInt($last.attr('data-id')) + 1;
  var $init = $(e).find('.init').removeClass('init');
  $init.attr('data-parent', parent).attr('data-id', id);
  $init.find('input.rubrik').attr('name', 'content' + parent + 'title' + id);
  $init.find('textarea').attr('name', 'content' + parent + 'text' + id);
};

var wysiwygIndex = 0;
var initWysiwyg = function () {
  $('.process-content:not(.hidden) .process-content-item').each(function (i, e) {
    if ($(e).find('.mce-tinymce').length) return;

    var thisIndex = wysiwygIndex++;
    $(e).attr('data-wysiwyg', thisIndex);

    var wysiwygBlur = function (e) {
      var $eUpdated = $('[data-wysiwyg="' + thisIndex + '"]');
      var parentIndex = $eUpdated.attr('data-parent');
      var index = $eUpdated.attr('data-id');
      changeProcessContent(parentIndex, index);
    };

    var timeout = undefined;
    $(e).find(':not(.mce-tinymce) textarea:not(.wysiwyg)').addClass('wysiwyg').tinymce({
      plugins: 'advlist autoresize charmap contextmenu image ' +
      'media print anchor link paste tabfocus textcolor ' +
      'autolink insertdatetime lists searchreplace table ' +
      'wordcount imageupload',

      toolbar1: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify |  | bullist numlist outdent indent | link image imageupload',
      imageupload_url: '/api/upload',
      setup: function (editor) {
        var onChange = function (e) {
          if (typeof timeout !== 'undefined') {
            clearTimeout(timeout);
          }
          timeout = setTimeout(function () {
            wysiwygBlur();
          }, 500);
        };
        editor.on('keyup', onChange);
        editor.on('change', onChange);
      }
    });
  });
};

var initChange = function () {
  $('.specialitet-select').change(changeSpecialitet);

  var timeout = undefined;
  $('body')
    .on('change', 'input[name="name"]', changeName)
    .on('change', 'input.process', changedProcess)
    .on('change', 'input.rubrik', changeProcessContent)
    .on('change', '.checkAble', changeProcessContent)
    .on('keyup', 'input', function () {
      if (typeof timeout !== 'undefined') {
        clearTimeout(timeout);
      }
      var $this = $(this);
      timeout = setTimeout(function () {
        $this.trigger('change');
      }, 500);
    });

  $('.tags').tagsInput({
    width: 'auto',
    defaultText: 'Lägg till synonym',
    removeWithBackspace: false,
    height: '40px',
    'onChange': function ($input, tag) {
      if (typeof tag === 'undefined') return;
      var value = $($input).val();
      if (value.length) {
        updateOperation({tags: value}, function (err, msg) {
        });
      }
    }
  });
};

var initClick = function () {
  $('.newProcess input').keyup(onEnter);

  $('body')
    .on('click', '.newProcess i.glyphicon-plus', newProcess)
    .on('click', '.nav-pills .glyphicon-remove', delProcess)
    .on('click', '.process-content-item .glyphicon-remove', delProcessContent)
    .on('click', '.nav-pills .navbar-btn', navClick)
    .on('click', '.toReview', sendToPreview);
};

var initLiveEvents = function () {
  initClick();
  initChange();

  $('body')
    .on('keyup', '.process-content-item:last-child .rubrik', createNewItem)
    .on('keyup', 'input.process', changeWidth);
};

var initOnce = function () {
  initializeSpecialitetSelect();
  initLiveEvents();

  $('input.process').each(function (i, e) {
    $(e).width(($(e).val().length + 1) * 8);
  });

  setLastSaved($('.lastSave .time').text());

  $('ul.nav-pills [data-id="0"]').click();
};

var initAll = function () {
  console.log('InitAll');

  $(".process-content").sortable({
    cancel: 'input,.mce-tinymce',
    stop: function (e, ui) {
      var $this = $(this);
      $this.find('[data-parent][data-id]').each(function (i, e) {
        var $e = $(e);
        updateProcessContent($e.attr('data-parent'), $e.attr('data-id'), {order: $('.process-content [data-parent][data-id]').index(e)}, function (err, msg) {
        });
      });
    }
  });

  $('.nav-pills').sortable({
    cancel: '.newProcess',
    stop: function (e, ui) {
      var $this = $(this);
      $this.find('.process-item').each(function (i, e) {
        var $e = $(e);
        var index = $e.find('input').attr('data-id');
        updateProcess(index, {order: $('.nav-pills .process-item').index(e)}, function (err, msg) {});
      });
    }
  });

  initWysiwyg();
  $('.process-content').each(initProcessContent);
};

$(document).ready(function () {
  initOnce();
  initAll();

  var compiledResults = $('#kartotekResults-template').html();
  var kartotekResultsTemplate = Handlebars.compile(compiledResults);

  $('#article-search').keyup(function () {
    if (this.value.length == 0) {
      $('#kartotekResults').empty();
      return;
    }
    else if (this.value.length < 3) {
      return;
    }
    findArticles(kartotekResultsTemplate);
  });

  $('.articleTable tbody').on("click", '.article-remove', removeArticle);
  $('.articleTable tbody').on("click", '.amount', addAmountClick);

});

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
      var operationID = $('#operation').val();
      var found = false;

      $('.articleTable > tbody > tr').each(function (index) {
        if ($(this).attr("data-kartotekID") == id) {
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

function isPosInt(value) {
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
