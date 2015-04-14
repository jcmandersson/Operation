var initializeSpecialitetSelect = function () {
  $.ajax({
    type: 'GET',
    url: '/api/search/Specialitet/',
    data: {
      all: 1
    }
  }).done(function( msg ) {
      console.log(msg);
      var formated = $.map(msg, function (item) {
        return {
          text: item.name, id: item.name
        }
      });
      console.log(formated);
      var data = [{id: 'Alla specialiteter', text: 'Alla specialiteter'}];
      data = data.concat(formated);
      console.log(data);

      $(".specialitet-select").select2({
          data: data,
          minimumInputLength: 0
        });

    })
    .fail(function(err, status){
      console.log('Någonting gick fel!');
      console.log(err);
      console.log(status);
    });

};

$(document).ready(function () {
  initializeSpecialitetSelect();
  $('.state-select').select2();

  $('.specialitet-select').change(function() {
    var newSpecialty = $(this).val();
    if(newSpecialty !== "Alla specialiteter") {
      window.location.href = window.location.href.split('?')[0] + "?specialty=" + newSpecialty;  
    } else {
      window.location.href = window.location.href.split('?')[0];
    }
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
