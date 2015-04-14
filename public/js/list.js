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
              text: item.name, id: item.name
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

$(document).ready(function () {
  initializeSpecialitetSelect();
  $('.state-select').select2();

  $('.specialitet-select').change(function() {
    window.location.href = window.location.href.split('?')[0] + "?specialty=" + $(this).val();  
  });

  $('.state-select').change(function() {
    var newState = $(this).val();
    if(newState !== "Alla tillstånd") {
      window.location.href = window.location.href.split('?')[0] + "?state=" + newState;  
    } else {
      window.location.href = window.location.href.split('?')[0];
    }
  });

});
