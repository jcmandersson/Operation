var initializeSpecialitetSelect = function() {
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
    escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
    minimumInputLength: 0

  });
};

$(document).ready(function() {

  $(".process-content").hide();
  $("#content0").show();
  $("#0").addClass('active');

  $(".nav-pills > .navbar-btn").click(function() {
    $(this).addClass('active').siblings().removeClass('active');
    $(".process-content").hide();
    $("#content"+this.id).show();

  });
  
  $('textarea:not(.wysiwyg)').addClass('wysiwyg').jqte();
  
  $('.process-content').sortable({
    cancel: 'input,.jqte'
  })

  $('.tags').tagsInput({
    width: 'auto',
    defaultText: 'Lägg till synonym',
    removeWithBackspace: false,
    height: '40px'
  });
  
  var createNewItem = function(){
    $(this).unbind("keyup", createNewItem);
    var $e = $(this).parents().eq(2);
    console.log($e);
    var $clone = $e.find('.process-content-item').first().clone().removeClass('hidden').appendTo($e);
    $clone.find('.rubrik').keyup(createNewItem);
  };
  $('.process-content').each(function(i, e){
    $(e).find('.process-content-item .rubrik').last().keyup(createNewItem);
  });

  initializeSpecialitetSelect();
});
