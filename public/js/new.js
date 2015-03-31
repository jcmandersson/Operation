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

$(document).ready(function () {
  initializeSpecialitetSelect();
  $('.operationForm').submit(function(e){
    if($('.operationForm .specialitet-select').val() === 'none'){
      e.preventDefault();
      alert('Du måste välja en specialitet.');
    }
  });
});
