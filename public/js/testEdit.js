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

var initDynamicWidth = function(){
  var $input = $('input.process');
  $input.each(function(i, e){
    $(e).width(($(e).val().length+1)*8);
  });
  $input.unbind('keypress').on('keypress', function(){
    $(this).width(($(this).val().length+1)*8);
  });
};

var initAll = function(){
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
    height: '40px'/*,
    'onChange': function($input, tag){
      var value = input.val();
      if(value.length){
        updateOperation({tags: value}, function(err, msg){})
      }
    }*/
  });
  
  initDynamicWidth();
};

var updateOperation = function(data, callback){
  var slug = $('.data [data-operation="slug"]').val();
  
  $.ajax({
    type: 'GET',
    url: '/api/update/operations/' + slug,
    data: data
  })
    .done(function( msg ) {
      for (var key in msg) {
        var $e = $('.data [data-operation="'+key+'"]');
        if($e.length){
          $e.val(msg[key])
        }
      }
      callback(null, msg);
    })
    .fail(function(err, status){
      if(err) alert(err);
      callback(err, status);
    });
};

$(document).ready(function () {

  initAll();
  
  $('input[name="name"]').change(function(e){
    var value = $(this).val();
    if(value.length){
      updateOperation({title: value}, function(err, msg){})
    } 
  });
  
  /*$(".specialitet-select").change(function(e){
    var value = $(this).val();
    if(value.length){
      updateOperation({specialty: value}, function(err, msg){})
    }
  });
  
  $('input.process').change(function(e){
    var value = $(this).val();
    console.log(value);
  });*/
  
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
  
  
  var newProcess = function (e) {
    $.get('/api/mongoose/id', function(msg){
      var mongooseId = JSON.parse(msg).newId;

      var $item = $('.nav-pills li.process-item').last();
      var $clone = $item.clone().removeClass('hidden');
      $clone.find('.hasEvent').removeClass('hasEvent');
      $clone.find('.active').removeClass('active');
      var $input = $('.newProcess input');
      var newId = getNextId();

      if (!$input.val().length) return;

      $clone.insertAfter($item).find('input').attr('data-id', newId).attr('name', 'process' + newId).val($input.val());
      $input.val('');

      var $processId = $('<input type="text"/>').addClass('hidden processIdInput').attr('name', 'processId' + newId).val(mongooseId).insertAfter($('.process-content:not(#contentchecklist)').last());
      var $process = $('.process-content.mall').clone().removeClass('mall').removeClass('hidden').hide().attr('id', 'content' + newId).attr('data-id', newId).insertAfter($processId);
      $process.find('.process-content-item').last().addClass('init');
      
      bindProcess();
      initNavbar();
      initWysiwyg();
      initDynamicWidth();

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
