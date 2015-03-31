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

var initWysiwyg = function () {
  $('.process-content:not(.hidden) textarea:not(.wysiwyg)').addClass('wysiwyg').jqte();
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

var initAll = function () {
  initializeSpecialitetSelect();
  initNavbar();

  $(".process-content").hide().sortable({
    cancel: 'input,.jqte'
  });

  $("#content0").show();
  $("#0").addClass('active');

  initWysiwyg();

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

  initDynamicWidth();
};

var updateOperation = function (data, callback) {
  var slug = $('.data [data-operation="slug"]').val();

  $.ajax({
    type: 'GET',
    url: '/api/update/operations/' + slug,
    data: data
  })
    .done(function (msg) {
      for (var key in msg) {
        var $e = $('.data [data-operation="' + key + '"]');
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

var updateProcess = function (index, data, callback) {
  var slug = $('.data [data-process-index="' + index + '"] [data-process="slug"]').val();

  $.ajax({
    type: 'GET',
    url: '/api/update/Processteg/' + slug,
    data: data
  })
    .done(function (msg) {
      console.log(msg);
      for (var key in msg) {
        var $e = $('.data [data-process-index="' + index + '"] [data-process="' + key + '"]');
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

/*

 <div data-process-id="5511b57a306174b82744def9" data-process-index="0">
   <input type="text" data-process="slug" value="551a7fde370c57a01f88f6fb">
   <input type="text" data-process="title" value="test">
   <input type="text" data-process="id" value="5511b57a306174b82744def9">
   <div class="data-processContents">
     <div data-content-id="5511b57a306174b82744defa" data-content-index="0">
       <input type="text" data-process-content="slug" value="551a7fde370c57a01f88f705">
       <input type="text" data-process-content="text" value="asdasd">
       <input type="text" data-process-content="title" value="avasd">
       <input type="text" data-process-content="id" value="5511b57a306174b82744defa">
     </div>
     <div data-content-id="5511b57a306174b82744defb" data-content-index="1">
       <input type="text" data-process-content="slug" value="551a7fde370c57a01f88f706">
       <input type="text" data-process-content="text" value="asdasdasd">
       <input type="text" data-process-content="title" value="asdasdasdasd">
       <input type="text" data-process-content="id" value="5511b57a306174b82744defb">
     </div>
   </div>
 </div>
 */

var addProcess = function(data, callback){
  var nextIndex = 0;
  var $lastElement = $('.data [data-process-index]');
  if($lastElement.length){
    nextIndex = parseInt($lastElement.last().attr('data-process-index')) + 1;
  }
  console.log(nextIndex); 
  
  data.operation = $('.data [data-operation="id"]').val();
  
  console.log(data);
  
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

var removeAllProcessContent = function(processIndex, callback){
  var $processData = $('.data [data-process-index="'+processIndex+'"] .data-processContents');
  $processData.find('[data-content-index]').each(function(i, e){
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

var removeProcess = function(index, callback){ //TODO: Remove all content!
  var slug = $('.data [data-process-index="' + index + '"] [data-process="slug"]').val();
  
  $.ajax({
    type: 'DELETE',
    url: '/api/Processtegs/' + slug
  })
    .done(function (msg) {
      removeAllProcessContent(index, function(){
        if(!err) $('.data [data-process-index="' + index + '"]').remove();
      });
      
      callback(null, msg);
    })
    .fail(function (err, status) {
      if (err) alert(err);
      callback(err, status);
    });
};

$(document).ready(function () {

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
    
    addProcess({title: $('.newProcess input').val()}, function(err, msg){
      //TODO: Add navbar button, add ProcessContentFields
    });

    $('.nav-pills li.process-item input').last().click();
  };
  $('.newProcess input').keyup(function (event) {
    var key = event.keyCode || event.which;
    if (key === 13) {
      newProcess(event);
    }
  });
  $('.newProcess i.glyphicon-plus').click(newProcess);
  
  var delProcess = function (e) {
    if(!window.confirm('Vill du verkligen ta bort hela processen?')) return;
    
    var index = $(this).parent().find('.process').attr('data-id');
    removeProcess(index, function(err, msg){
      $('input.process[data-id="'+index+'"]').parent().remove();
      $('.process-content[data-id="'+index+'"]').remove();
      $('[name="processId'+index+'"]').remove();
    });
  };

  $('.nav-pills .glyphicon-remove').click(delProcess);

  console.log();
  
  /*

   var removeProcessContent = function(e){

   };

   var removeProcess = function(e){
   var processId = $(this).parent().find('.process').attr('data-id');
   $('[name="processId'+processId+'"]').attr('name', 'removeProcess'+processId);
   $(this).parent().remove();
   $('#content'+processId).remove();
   };

   var createNewItem = function () {
   $(this).unbind("keyup", createNewItem);
   var $e = $(this).parents().eq(2);
   var $clone = $('.hidden .process-content-item').first().clone().removeClass('hidden').addClass('init').appendTo($e);
   $clone.find('.rubrik').keyup(createNewItem);

   bindProcess();
   initWysiwyg();
   };

   var bindProcess = function () {
   $('.process-content').each(function (i, e) {
   $(e).find('.process-content-item .rubrik').last().unbind('keyup', createNewItem).keyup(createNewItem);

   var $last = $(e).find('.process-content-item:not(.init,.hidden)').last();
   var parent = parseInt($(e).attr('data-id'));
   var id = $last.length == 0 ? 0 : parseInt($last.attr('data-id')) + 1;
   var $init = $(e).find('.init').removeClass('init');
   $init.attr('data-parent', parent).attr('data-id', id);

   $init.find('input.rubrik').attr('name', 'content' + parent + 'title' + id);
   $init.find('textarea').attr('name', 'content' + parent + 'text' + id);
   });

   $('.nav-pills .glyphicon-remove:not(.hasEvent)').addClass('hasEvent').click(removeProcess);
   };
   bindProcess();

   var getNextId = function(){
   var high = 0;
   var $ids = $('.processIdInput');

   for(var i = 0; i < $ids.length; ++i){
   if( parseInt($ids.eq(i).attr('name').replace(/\D/g,'')) > high ){
   high = parseInt($ids.eq(i).attr('name').replace(/\D/g,''));
   }
   }

   return high + 1;
   };




   var save = function (e) {
   e.preventDefault();
   $.post('', $(".operationForm").serialize())
   .done( function(msg) { console.log(msg); } )
   .fail( function(xhr, textStatus, errorThrown) {
   alert(xhr.responseText);
   console.log(textStatus);
   console.log(errorThrown);
   });
   };
   $('.operationForm').submit(save);

   initializeSpecialitetSelect();*/
});
