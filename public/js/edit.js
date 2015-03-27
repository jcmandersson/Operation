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
        console.log(data);

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
  $(".nav-pills > .navbar-btn:not(.hasEvent)").addClass('hasEvent').click(function () {
    $(this).addClass('active').siblings().removeClass('active');
    $(".process-content").hide();
    $("#content" + this.id).show();
  });
}

$(document).ready(function () {

  $(".process-content").hide().sortable({
    cancel: 'input,.jqte'
  });
  $("#content0").show();
  $("#0").addClass('active');

  initNavbar();

  var initWysiwyg = function () {
    $('.process-content:not(.hidden) textarea:not(.wysiwyg)').addClass('wysiwyg').jqte();
  };
  initWysiwyg();

  $('.tags').tagsInput({
    width: 'auto',
    defaultText: 'Lägg till synonym',
    removeWithBackspace: false,
    height: '40px'
  });
  
  var initDynamicWidth = function(){
    var $input = $('input.process');
    $input.each(function(i, e){
      $(e).width(($(e).val().length+1)*8);
    });
    $input.unbind('keypress').on('keypress', function(){
      $(this).width(($(this).val().length+1)*8);
    });
  };
  initDynamicWidth();

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
  };
  bindProcess();

  var newProcess = function (e) {
    var $item = $('.nav-pills input:not(.form-control)').last();
    var $clone = $item.clone().removeClass('hasEvent').removeClass('active');
    var $input = $('.newProcess input');
    var newId = parseInt($clone.attr('id')) + 1;

    if (!$input.val().length) return;

    $clone.attr('id', newId).attr('name', 'process' + newId).val($input.val()).insertAfter($item);
    $input.val('');

    var $process = $('.process-content.mall').clone().removeClass('mall').removeClass('hidden').hide().attr('id', 'content' + newId).attr('data-id', newId).insertAfter($('.process-content:not(#contentchecklist)').last());
    $process.find('.process-content-item').last().addClass('init');

    bindProcess();
    initNavbar();
    initWysiwyg();
    initDynamicWidth();

    $('.nav-pills input:not(.form-control)').last().click();
  };
  $('.newProcess input').keyup(function (event) {
    var key = event.keyCode || event.which;
    if (key === 13) {
      newProcess(event);
    }
  });
  $('.newProcess i').click(newProcess);

  var save = function (e) {
    e.preventDefault();
    $.post('', $(".operationForm").serialize(), function (msg) {
      console.log(msg);
    });
  };
  $('.operationForm').submit(save);

  initializeSpecialitetSelect();
});
