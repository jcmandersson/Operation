
$(function() {
  
  var compiledSynonym = $('#synonym-template').html();
  var synonymTemplate = Handlebars.compile(compiledSynonym);

  var compiledKartotekResults = $('#kartotekResults-template').html();
  var kartotekResultsTemplate = Handlebars.compile(compiledKartotekResults);

  var compiledArticle = $('#article-template').html();
  var articleTemplate = Handlebars.compile(compiledArticle);

  var compiledSpecialitetResults = $('#specialitetResults-template').html();
  var specialitetResultsTemplate = Handlebars.compile(compiledSpecialitetResults);

  $("#newOperationButton").click(function () {
    /*
    //Get tags and build string separated with ', '
    var tags = '';
    $('.synonym').each(function(index) {
      if(index == 0){
        tags = $( this ).text();
      }
      else {
        tags += ', ' + ($(this).text());
      }
    });*/


    //add tags
    var tags = $('#tags_1').val();

    $('.article').each(function(index){
    });
    
    $.ajax({
      type: 'POST',
      url: '/api/operations',
      data: {
        title: $('#operation-name').val(),
        tags: tags
      }
    })
      .done(function (msg) {
        console.log(msg); //Contains the created Operation-model
        
        //adding articles here
        $('.article').each(function(index){

          $.ajax({
            type: 'POST',
            url: '/api/artikels',
            data: {
              name: $(this).text(),
              kartotek : $(this).attr("data-kartotekID"),
              operation: msg._id
            }
          })
            .done(function( msg ) {
              console.log(msg); //Contains the created Article-model
            })
            .fail(function(err, status){
              console.log('Någonting gick fel!');
              console.log(err);
              console.log(status);
            });
        });

      })
      .fail(function (err, status) {
        console.log('Någonting gick fel!');
        console.log(err);
        console.log(status);
      });
  });

  var addArticle = function(results) {
    var name = $(this).data('name');
    var kartotekID = $(this).data('kartotekID'); 
    $('#articles').append(articleTemplate({ name: name, id: kartotekID }));
  };

  $('#specialitet-search').keyup(function () {
    console.log("hej");
    var url = '/api/Specialitets?text=' + $(this).val();
    console.log(url);
    $.get(url).done(function (results) {
      console.log(results);
      $('#specialitetResults').html(specialitetResultsTemplate({ results: results }));
      console.log("blaa");
      if (results.length) { //FIX THIS!
        $('#search').addClass('has-results');
      } else {
        $('#search').removeClass('has-results');
      }
    });
  });

  $(".js-data-example-ajax").select2({
    ajax: {
      url: "https://api.github.com/search/repositories",
      dataType: 'json',
      delay: 250,
      data: function (params) {
        return {
          q: params.term, // search term
          page: params.page
        };
      },
      processResults: function (data, page) {
        // parse the results into the format expected by Select2.
        // since we are using custom formatting functions we do not need to
        // alter the remote JSON data
        return {
          results: data.items
        };
      },
      cache: true
    },
    escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
    minimumInputLength: 1,
    templateResult: formatRepo, // omitted for brevity, see the source of this page
    templateSelection: formatRepoSelection // omitted for brevity, see the source of this page
  });
  
  
  
  
  
  $('#article-search').keydown(function() {
    var self = this;

    var url = '/api/Kartotekartikels?text=' + $(this).val();
    $.get(url).done(function(results) {
      $('#kartotekResults').html(kartotekResultsTemplate({ results: results }));

      if (results.length != 0) {
        $('#search').addClass('has-results');
      }
      else {
        $('#search').removeClass('has-results');
      }

      $('.add-column').click(addArticle);
    });
  });

 /* $('#add-synonym-btn').on("keypress", function(e) {
    if (e.keyCode == 13) {
      var name = $('#synonym-input').val();
      $('#synonyms').append(synonymTemplate({ name: name }));
      return false; // prevent the button click from happening
    }
  });*/
  
  $('#add-synonym-btn').click(function() {
    var name = $('#synonym-input').val();
    $('#synonyms').append(synonymTemplate({ name: name }));
  });
  
  $('#tags_1').tagsInput({
          width:'auto', 
          defaultText:'Lägg till synonym',
          removeWithBackspace : false,
          height : '40px'});
  
});

