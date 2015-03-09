function add(data, index, operation, addedProccesstegs) {

  var addedProccesstegs = addedProccesstegs;
  
  if ( !(data === undefined) ) {
    console.log(data);
    console.log();
    var underrubrikName = $(data).find('#underrubrik-name').val();
    var underrubrikText = $(data).find('#underrubrik-text').val();

    var processteg = $(data).find('.select-processteg').val();

    if (!(processteg in addedProccesstegs)) {

      $.ajax({
        type: 'POST',
        url: '/api/processtegs',
        data: {
          title: processteg,
          operation: operation,
          template : true
        }
      })
        .done(function (msg) {
          console.log(msg);


          console.log(underrubrikName);
          console.log(underrubrikText);
          console.log(msg._id);
          addedProccesstegs[processteg] = [true, msg._id];

          $.ajax({
            type: 'POST',
            url: '/api/processinnehalls',
            data: {
              order: 0,
              title: underrubrikName,
              text: underrubrikText,
              process: msg._id
            }
          })
            .done(function (msg) {
              console.log(msg);
              

              $(function () {
                add($('#underrubriker').children()[index + 1], index + 1, operation, addedProccesstegs);
              });


            })
            .fail(function (err, status) {
              console.log('Någonting gick fel!');
              console.log(err);
              console.log(status);
            });

        })
        .fail(function (err, status) {
          console.log('Någonting gick fel!');
          console.log(err);
          console.log(status);
        });
    }
    else{

      $.ajax({
        type: 'POST',
        url: '/api/processinnehalls',
        data: {
          order: 0,
          title: underrubrikName,
          text: underrubrikText,
          process: addedProccesstegs[processteg][1]
        }
      })
        .done(function (msg) {
          console.log(msg);
          
          
          $(function () {
            add($('#underrubriker').children()[index + 1], index + 1, operation, addedProccesstegs);
          });
          
        })
        .fail(function (err, status) {
          console.log('Någonting gick fel!');
          console.log(err);
          console.log(status);
        });
    }
  }
}


var createNewOperation = function() {
  var tags = $('#tags_1').val();
  var specialty = $(".specialitet-select").val();
  var operationName = $('#operation-name').val();
  
  console.log(specialty);
  if (specialty == 'Specialitet') {
    console.log('Fix Error here');   
  }
  else
  {
    $.ajax({
      type: 'POST',
      url: '/api/operations',
      data: {
        title: operationName,
        tags: tags,
        specialty: specialty,
        template: true
      }
    })
      .done(function (msg) {
        console.log(msg); //Contains the created Operation-model

        //adding articles here
        $('.article').each(function (index) {

          $.ajax({
            type: 'POST',
            url: '/api/artikels',
            data: {
              name: $(this).text(),
              kartotek: $(this).attr("data-kartotekID"),
              operation: msg._id
            }
          })
            .done(function (msg) {
              console.log(msg); //Contains the created Article-model
            })
            .fail(function (err, status) {
              console.log('Någonting gick fel!');
              console.log(err);
              console.log(status);
            });
        });
        
        //adding underrubrik/processteg
        
        $(function() {
          var index = 0;
          add($('#underrubriker').children()[index], index, msg._id, {});
        });
        
        /*
        //adding underrubriker with processteg here
        var addedProccesstegs = {};
        $('.underrubrik-container').each(function (index, addedProcesstegs) {
          console.log($(this).find('#underrubrik-name').val());
          console.log($(this).find('#underrubrik-text').val());
          console.log($(this).find('.select-processteg').val());
          
          var underrubrikName = $(this).find('#underrubrik-name').val();
          var underrubrikText = $(this).find('#underrubrik-text').val();
          
          var processteg = $(this).find('.select-processteg').val();
          
          //add processteg if not added before
          if (!(processteg in addedProccesstegs)) {
            console.log("not in addedProcesstegs");
            addedProccesstegs[processteg] = true;
            $.ajax({
              type: 'POST',
              url: '/api/processtegs',
              data: {
                title: processteg,
                operation: msg._id
              }
            })
              .done(function (msg) {
                console.log(msg);
                
              })
              .fail(function (err, status) {
                console.log('Någonting gick fel!');
                console.log(err);
                console.log(status);
              });
          }
          else {
            //add underrubrik
            $.ajax({
              type: 'POST',
              url: '/api/processinnehalls',
              data: {
                order: 0,
                title: underrubrikName,
                text: underrubrikText,
                process: "processtegid"
              }
            })
              .done(function (msg) {
                console.log(msg);
              })
              .fail(function (err, status) {
                console.log('Någonting gick fel!');
                console.log(err);
                console.log(status);
              });
          }
          
      });*/
        
      })
      .fail(function (err, status) {
        console.log('Någonting gick fel!');
        console.log(err);
        console.log(status);
      });
  };
};




var removeArticle = function(element) {
  var parent = $(element).parent();
  $(parent).remove(); 
};


var addArticle = function(articleTemplate, results) {
  var name = $(this).data('name');
  var kartotekID = $(this).data('kartotekid');
  
  var newArticle = $(articleTemplate({ name: name, id: kartotekID })).appendTo('#articles');
  newArticle.find('.remove-article').click(function() {
    removeArticle(this);
  });
};

var findArticles = function(resultsTemplate, articleTemplate) {
  var articleName = $('#article-search').val();
  var url = '/api/Kartotekartikels?text=' + articleName;
  $.get(url).done(function(results) {
    $('#kartotekResults').html(resultsTemplate({ results: results }));

    if (results.length != 0) {
      $('#article-search').addClass('has-results');
    }
    else {
      $('#article-search')
    }

    $('.add-column').click(function() {
      addArticle.call(this, articleTemplate, results)
      $('#article-search').val('').removeClass('has-results');
      $('.kartotekResults')
    });
  });
};

var addSynonym = function() {
  var name = $('#synonym-input').val();
  $('#synonyms').append(synonymTemplate({ name: name }));
};

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

var addUnderrubrik = function(underrubrikTemplate){
  var name = $('#underrubrik-name').val();
  var text = $('#underrubrik-text').val();
  
  //hardcoded for now (iteration1)
  var processteg = ["All information", 
                    "Anestesi", 
                    "Operation", 
                    "Patientpositionering",
                    "Förberedelselista",
                    "Plocklista"];
    
  $(underrubrikTemplate({ name: name, text: text, processteg: processteg })).appendTo('#underrubriker');

  //Set select2 for new underrubrik
  $(".select-processteg").select2({
  });
  
  //Reset inputfields for underrubrik
  $('#underrubrik-name').val('');
  $('#underrubrik-text').val('');
};

// TODO keyCode == 13
$(function() {
  var compiledSynonym = $('#synonym-template').html();
  var synonymTemplate = Handlebars.compile(compiledSynonym);

  var compiledResults = $('#kartotekResults-template').html();
  var kartotekResultsTemplate = Handlebars.compile(compiledResults);

  var compiledArticle = $('#article-template').html();
  var articleTemplate = Handlebars.compile(compiledArticle);
  
  var compiledUnderrubrik = $('#underrubrik-template').html();
  var underrubrikTemplate = Handlebars.compile(compiledUnderrubrik);
  
  $('#newOperationButton').click(createNewOperation);
  $('#article-search').keydown(findArticles.bind(undefined, kartotekResultsTemplate, articleTemplate));
  $('#add-synonym-btn').click(addSynonym.bind(undefined, synonymTemplate));
  $('#tags_1').tagsInput({
    width: 'auto',
    defaultText: 'Lägg till synonym',
    removeWithBackspace: false,
    height: '40px'
  });
  
  $('#newUnderrubrikButton').click(addUnderrubrik.bind(undefined, underrubrikTemplate));
  
  initializeSpecialitetSelect();

  $(".select-processteg").select2({
  });
  
  //Helper to get selected processteg when creating underrubrik client-side
  Handlebars.registerHelper('if_selected', function(a, opts) {
    if (a == $('.select-processteg').val()) {
      return opts.fn(this);
    }
    else {
      return opts.inverse(this);
    }
  });
});

var addedProccesstegs = {};
addedProccesstegs["hej"] = [true, ''];
addedProccesstegs["hej"][1] = 'hejsan';
console.log(addedProccesstegs['hej']);
console.log(addedProccesstegs['hej'][0]);
console.log(addedProccesstegs['hej'][1]);
if (!('heja' in addedProccesstegs)){
  console.log("nej");
}
