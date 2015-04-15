var initializeSpecialitetSelect = function () {
  $.ajax({
    type: 'GET',
    url: '/api/search/Specialitet/',
    data: {
      all: 1
    }
  }).done(function( msg ) {
      var formated = $.map(msg, function (item) {
        return {
          text: item.name, id: item.name
        }
      });
      var data = [{id: 'Alla specialiteter', text: 'Alla specialiteter'}];
      data = data.concat(formated);

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

var splitOnce = function (str, split) {
  var index = str.indexOf(split);
  if(index === -1) {
    return [str, ''];
  }
  return [str.slice(0,index), str.slice(index + 1)];
};

var addAnd = function (str) {
  if(str[str.length - 1] !== '?') {
    str = str + '&'; 
  }
  
  return str;
};

var addToUrl = function (url, type, value) {

  if(url.indexOf('?') === -1) {
    url = url + '?';    
  }

  if(url.indexOf(type + '=') !== -1) {
    var before = url.split(type + '=')[0];
    var after = url.split(type + '=')[1];
    url =  before + type + '=' + value;
    if(after.indexOf('&') !== -1) {
      url = url + '&' + splitOnce(after, '&')[1]; 
    }
  } else {
    url = addAnd(url);
    url = url + type + '=' + value; 
  }

  return url;
};

var removeFromUrl = function (url, type) {

  if(url.indexOf(type + '=') !== -1) {
    var before = url.split(type + '=')[0];
    var after = url.split(type + '=')[1];

    if(before[before.length - 1] === '?') {
      url = before;
    } else {
      url =  before.slice(0, before.length - 1);
    }

    if(after.indexOf('&') !== -1) {
      url = addAnd(url);
      url = url + splitOnce(after, '&')[1]; 
    }
  }

  return url;
};

var changeSpecialty = function (newSpecialty) {
  if(newSpecialty !== "Alla specialiteter") {
    window.location.href = addToUrl(window.location.href, "specialty", newSpecialty);
  } else {
    window.location.href = removeFromUrl(window.location.href, "specialty");
  }
}

var changeState = function (newState) {
  if(newState !== "Alla tillstånd") {
    window.location.href = addToUrl(window.location.href, "state", newState);
  } else {
    window.location.href = removeFromUrl(window.location.href, "state");
  }
}

$(document).ready(function () {
  initializeSpecialitetSelect();
  $('.state-select').select2();

  $('.specialitet-select').change(function() {
    changeSpecialty($(this).val());
  });

  $('.state-select').change(function() {
    changeState($(this).val());
  });
 
  $('.per-page').click(function() {
    var newLimit = $(this).val();
    if(newLimit !== "25") {
      window.location.href = addToUrl(window.location.href, "limit", newLimit);
    } else {
      window.location.href = removeFromUrl(window.location.href, "limit");
    }
  });

});
