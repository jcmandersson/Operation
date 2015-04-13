var initializeSpecialitetSelect = function () {
  $(".specialitet-select").select2({
    placeholder: "Välj Specialitet",
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

$(document).ready(function () {
  initializeSpecialitetSelect();
  $('.state-select').select2({
    placeholder: "Välj Tillstånd"
  });

  $('.specialitet-select').change(function() {
    window.location.href = window.location.href.split('?')[0] + "?specialty=" + $(this).children().last().html();  
  });

});
