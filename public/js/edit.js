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

var changeProcessContent = function(parentIndex, index){
  var $parent;
  if($(this).hasClass('rubrik')){
    $parent = $(this).parent().parent();
  } else if($(this).hasClass('checkAble')) {
    $parent = $(this).parent().parent().parent();
  } else {
    $parent = $('.process-content-item[data-parent="'+parentIndex+'"][data-id="'+index+'"]');
  }
  var rubrik = $parent.find('.rubrik').val();
  var content = $parent.find('textarea').val();
  var checkAble = $parent.find('.checkAble').is(":checked");
  if(!rubrik || !rubrik.length) return;

  var processIndex = $parent.attr('data-parent');
  var thisIndex = $parent.attr('data-id');

  var $data = $('.data [data-process-index="'+processIndex+'"] [data-content-index="'+thisIndex+'"]');
  var data = {
    title: rubrik,
    text: content,
    checkAble: checkAble
  };

  if($data.length){
    console.log('UPDATE');
    updateProcessContent(processIndex, thisIndex, data, function(err, msg){

    });
  }else{
    console.log('ADD');
    addProcessContent(processIndex, data, function(err, msg){
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
    data: data
  })
    .done(function (msg) {
      console.log(msg);
      var $newData = $('<div></div>').attr('data-process-index', nextIndex).attr('data-process-id', msg._id);

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

var newProcess = function (e) {
  var value = $('.newProcess input').val();
  if (!value) return;

  addProcess({title: value}, function (err, msg) {
    var $last = $('.process-item').last();
    var $clone = $last.clone().removeClass('hidden');
    var $input = $clone.find('.process');
    var newIndex = parseInt($input.attr('data-id')) + 1;
    $input.attr('data-id', newIndex).attr('name', 'process' + newIndex).val(value);
    $clone.insertAfter($last);

    var $contentClones = $('.process-content.mall').clone().removeClass('mall hidden').insertAfter($('.process-content').last());
    $contentClones.attr('data-id', newIndex).attr('id', 'content'+newIndex)
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

var delProcessContent = function(e){
  var $parent = $(this).parent();
  var processIndex = $parent.attr('data-parent');
  var index = $parent.attr('data-id');

  removeProcessContent(processIndex, index, function(err, msg){
    if(!err){
      $('.process-content-item[data-parent="'+processIndex+'"][data-id="'+index+'"]').remove();
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

var initWysiwyg = function () {
  $('.process-content:not(.hidden) .process-content-item').each(function(i, e){

    var wysiwygBlur = function(){
      var parentIndex = $(e).attr('data-parent');
      var index = $(e).attr('data-id');
      changeProcessContent(parentIndex, index);
    };
    
    var timeout = undefined;
    $(e).find(':not(.jqte) textarea:not(.wysiwyg)').addClass('wysiwyg').jqte({
      change: function(){
        if(typeof timeout !== 'undefined'){
          clearTimeout(timeout);
        }
        var $this = $(this);
        timeout = setTimeout(function(){
          wysiwygBlur();
        }, 500);
      },
      blur: wysiwygBlur
    });
  });
};

var initChange = function(){
  $('.specialitet-select').change(changeSpecialitet);
  
  $('body')
    .on('change', 'input[name="name"]', changeName)
    .on('change', 'input.process', changedProcess)
    .on('change', 'input.rubrik', changeProcessContent)
    .on('change', '.checkAble', changeProcessContent);
  
  
  var timeout = undefined;
  $('body').on('keypress', 'input', function(){
    if(typeof timeout !== 'undefined'){
      clearTimeout(timeout);
    } 
    var $this = $(this);
    timeout = setTimeout(function(){
      $this.trigger('change');
    }, 500);
  });

  
  $('.tags').tagsInput({
    width: 'auto',
    defaultText: 'Lägg till synonym',
    removeWithBackspace: false,
    height: '40px',
    'onChange': function ($input, tag) {
      if(typeof tag === 'undefined') return;
      var value = $($input).val();
      if (value.length) {
        updateOperation({tags: value}, function (err, msg) {
        });
      }
    }
  });
};

var initClick = function(){
  $('.newProcess input').keyup(onEnter);

  $('body')
    .on('click', '.newProcess i.glyphicon-plus', newProcess)
    .on('click', '.nav-pills .glyphicon-remove', delProcess)
    .on('click', '.process-content-item .glyphicon-remove', delProcessContent)
    .on('click', '.nav-pills .navbar-btn', navClick);
};

var initLiveEvents = function(){
  initClick();
  initChange();

  $('body')
    .on('keyup', '.process-content-item:last-child .rubrik', createNewItem)
    .on('keypress', 'input.process' ,changeWidth);
};

var initOnce = function(){
  initializeSpecialitetSelect();
  initLiveEvents();

  $('input.process').each(function (i, e) {
    $(e).width(($(e).val().length + 1) * 8);
  });
  
  $('ul.nav-pills [data-id="0"]').click();
};

var initAll = function () {
  initWysiwyg();

  $(".process-content").sortable({
    cancel: 'input,.jqte'
  });
  
  $('.process-content').each(initProcessContent);
};

$(document).ready(function () {
  initOnce();
  initAll();  
});
