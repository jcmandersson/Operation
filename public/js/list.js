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

var addToUrl = function (type, value) {
  var url = window.location.href;

  if(url.indexOf('?') === -1) {
    url = url + '?';    
  }

  if(url.indexOf(type) !== -1) {
    var before = url.split(type)[0];
    var after = url.split(type)[1];
    url =  before + type + "=" + value;
    if(after.indexOf('&') !== -1) {
      url = url + '&' + after.split('&')[1]; 
    }
  } else {
    if(url[url.length - 1] !== '?') {
      url = url + "&"; 
    }
    url = url + type + "=" + value; 
  }

  return url;
};

var removeFromUrl = function (type) {
  var url = window.location.href;

  if(url.indexOf(type) !== -1) {
    var before = url.split(type)[0];
    var after = url.split(type)[1];

    if(before[before.length - 1] === '?') {
      url = before;
    } else {
      url =  before.substring(0, before.length - 1);
    }

    if(after.indexOf('&') !== -1) {
      if(url[url.length - 1] !== '?') {
        url = url + "&"; 
      }
      url = url + after.split('&')[1]; 
    }
  }

  return url;
};

$(document).ready(function () {
  initializeSpecialitetSelect();
  $('.state-select').select2();

  $('.specialitet-select').change(function() {
    var newSpecialty = $(this).val();
    if(newSpecialty !== "Alla specialiteter") {
      window.location.href = addToUrl("specialty", newSpecialty);
    } else {
      window.location.href = removeFromUrl("specialty");
    }
  });

  $('.state-select').change(function() {
    var newState = $(this).val();
    if(newState !== "Alla tillstånd") {
      console.log("Hej".indexOf('e'));
      window.location.href = addToUrl("state", newState);
    } else {
      window.location.href = removeFromUrl("state");
    }
  });

});
