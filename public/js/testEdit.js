var abstractUpdate = function (url, data, preKey, callback) {
  var slug = $('.data ' + preKey + 'slug"]').val();

  $.ajax({
    type: 'GET',
    url: url + slug,
    data: data
  })
    .done(function (msg) {

      for (var key in msg) {
        var $e = $('.data [data-operation="' + key + '"]');
        var $e = $('.data ' + preKey + key + '"]');
        if ($e.length) {
          $e.val(msg[key])
        }
      }

      callback(null, msg);
    })
    .fail(function (err, status) {
      if (err) alert(err);
      callback(err, status);
    });
};

var abstractRest = function (type, url, preKey, callback) {
  var slug = $('.data ' + preKey + 'slug"]').val();

  $.ajax({
    type: type,
    url: url + slug
  })
    .done(function (msg) {
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

var initNavbar = function () {
  $(".nav-pills .navbar-btn:not(.hasEvent)").addClass('hasEvent').click(function () {
    $('.nav-pills li.process-item .active').removeClass('active');
    var $this = $(this).addClass('active');
    $(".process-content").hide();
    $("#content" + $this.attr('data-id')).show();
  });
};
var changeProcessContent = function(parentIndex, index){
  console.log('edited');
  
  var $parent;
  if($(this).hasClass('rubrik')){
    $parent = $(this).parent().parent();
  }else{
    $parent = $('.process-content-item[data-parent="'+parentIndex+'"][data-id="'+index+'"]');
  }
  var rubrik = $parent.find('.rubrik').val();
  var content = $parent.find('textarea').val();
  if(!rubrik) return;

  var processIndex = $parent.attr('data-parent');
  var thisIndex = $parent.attr('data-id');

  var $data = $('.data [data-process-index="'+processIndex+'"] [data-content-index="'+thisIndex+'"]');
  var data = {
    title: rubrik,
    text: content
  };

  if($data.length){
    console.log('UPDATE');
    updateProcessContent(processIndex, thisIndex, data, function(err, msg){

    });
  }else{
    console.log('ADD');
    addProcessContent(processIndex, data, function(err, msg){

    });
  }
};

var initWysiwyg = function () {
  $('input.rubrik').unbind('change').change(changeProcessContent);
  
  $('.process-content:not(.hidden) .process-content-item').each(function(i, e){
    $(e).find('textarea:not(.wysiwyg)').addClass('wysiwyg').jqte({
      blur: function(){
        var parentIndex = $(e).attr('data-parent');
        var index = $(e).attr('data-id');
        changeProcessContent(parentIndex, index);
      }
    });
  });
};

var initDynamicWidth = function () {
  var $input = $('input.process');
  $input.each(function (i, e) {
    $(e).width(($(e).val().length + 1) * 8);
  });
  $input.unbind('keypress').on('keypress', function () {
    $(this).width(($(this).val().length + 1) * 8);
  });
};

var initOnce = function(){
  initializeSpecialitetSelect();
  
  $('ul.nav-pills [data-id="0"]').click();

  $('.tags').tagsInput({
    width: 'auto',
    defaultText: 'Lägg till synonym',
    removeWithBackspace: false,
    height: '40px',
    'onChange': function ($input, tag) {
      var value = $input.val();
      if (value.length) {
        updateOperation({tags: value}, function (err, msg) {
        });
      }
    }
  });
};

var initAll = function () {
  initNavbar();

  $(".process-content").hide().sortable({
    cancel: 'input,.jqte'
  });

  initDynamicWidth();

  var createNewItem = function () {
    $(this).unbind("keyup", createNewItem);
    var $e = $(this).parents().eq(2);
    var $clone = $('.hidden .process-content-item').first().clone().removeClass('hidden').addClass('init').appendTo($e);
    $clone.find('.rubrik').keyup(createNewItem);
    initAll();
  };

  $('.process-content').each(function (i, e) {
    $(e).find('.process-content-item .rubrik').unbind('keyup', createNewItem).last().keyup(createNewItem);
    
    var $last = $(e).find('.process-content-item:not(.init,.hidden)').last();
    var parent = parseInt($(e).attr('data-id'));
    var id = $last.length == 0 ? 0 : parseInt($last.attr('data-id')) + 1;
    var $init = $(e).find('.init').removeClass('init');
    $init.attr('data-parent', parent).attr('data-id', id);

    $init.find('input.rubrik').attr('name', 'content' + parent + 'title' + id);
    $init.find('textarea').attr('name', 'content' + parent + 'text' + id);
  });

  initWysiwyg();
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
    data: data
  })
    .done(function (msg) {
      console.log(msg);
      var $newData = $('<div></div>').attr('data-process-index', nextIndex).attr('data-proecss-id', msg._id);

      for (var key in msg) {//<input type="text" data-process="slug" value="551a7fde370c57a01f88f6fb">
        if (typeof msg[key] == 'string' || msg[key] instanceof String) {
          var $e = $('<input type="text">').attr('data-process', key).val(msg[key]);
          $e.appendTo($newData);
        }
      }
      $newData.appendTo($('.data-processes'));
      callback(null, msg);
    })
    .fail(function (err, status) {
      if (err) alert(err);
      callback(err, status);
    });
};


var addProcessContent = function(processIndex, data, callback){
  var nextIndex = 0;
  var $lastElement = $('.data [data-process-index="'+processIndex+'"] [data-content-index]');
  if ($lastElement.length) {
    nextIndex = parseInt($lastElement.last().attr('data-content-index')) + 1;
  }
  
  data.process = $('.data [data-process-index="'+processIndex+'"]').attr('data-process-id');
  
  console.log(data);
  
  $.ajax({
    type: 'POST',
    url: '/api/Processinnehalls',
    data: data
  })
    .done(function (msg) {
      console.log(msg);
      var $newData = $('<div></div>').attr('data-content-index', nextIndex).attr('data-content-id', msg._id);

      for (var key in msg) {
        if (typeof msg[key] == 'string' || msg[key] instanceof String) {
          var $e = $('<input type="text">').attr('data-process-content', key).val(msg[key]);
          $e.appendTo($newData);
        }
      }
      $newData.appendTo($('.data [data-process-index="'+processIndex+'"] .data-processContents'));
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
      url: '/api/Processinnehalls/' + $(e).find('[data-process-content="slug"]').val()
    })
      .done(function (msg) {
        callback(null, msg);
      })
      .fail(function (err, status) {
        if (err) alert(err);
        callback(err, status);
      });
  });
};


$(document).ready(function () {
  initOnce();
  initAll();

  $('input[name="name"]:not(.bound)').addClass('bound').change(function (e) {
    var value = $(this).val();
    if (value.length) {
      updateOperation({title: value}, function (err, msg) {
      });
    }
  });

  $('.specialitet-select:not(.bound)').addClass('bound').change(function (e) {
    var value = $(this).val();
    if (value.length) {
      updateOperation({specialty: value}, function (err, msg) {
      });
    }
  });

  $('input.process:not(.bound)').addClass('bound').change(function (e) {
    var value = $(this).val();
    var index = $(this).attr('data-id');
    console.log(index);
    console.log(value);
    if (value.length && typeof index !== 'undefined') {
      updateProcess(index, {title: value}, function (err, msg) {
      });
    }
  });

  var newProcess = function (e) {

    var value = $('.newProcess input').val();
    if (!value) return;

    addProcess({title: value}, function (err, msg) {
      var $last = $('.process-item').last();
      var $clone = $last.clone().removeClass('hidden');
      $clone.find('.bound').removeClass('bound');
      var $input = $clone.find('.process');
      var newIndex = parseInt($input.attr('data-id')) + 1;
      $input.attr('data-id', newIndex).attr('name', 'process' + newIndex).val(value);
      $clone.insertAfter($last);

      //TODO: add ProcessContentFields

      $('.newProcess input').val('');
      $('.nav-pills li.process-item input').last().click();
    });
  };
  $('.newProcess input').keyup(function (event) {
    var key = event.keyCode || event.which;
    if (key === 13) {
      newProcess(event);
    }
  });
  $('.newProcess i.glyphicon-plus').click(newProcess);

  var delProcess = function (e) {
    if (!window.confirm('Vill du verkligen ta bort hela processen?')) return;

    var index = $(this).parent().find('.process').attr('data-id');
    removeProcess(index, function (err, msg) {
      $('input.process[data-id="' + index + '"]').parent().remove();
      $('.process-content[data-id="' + index + '"]').remove();
      $('[name="processId' + index + '"]').remove();
    });
  };

  $('.nav-pills .glyphicon-remove').click(delProcess);

  addProcessContent(1, {title: 'testContent', text: '<b>hejsan</b>'}, function(err, msg){
    console.log(err);
    console.log(msg);
  });
  
});
