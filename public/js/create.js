$('.remove').click(function(){
  $('.item').hide();
});


$( "#article" ).change(function() {
  var bla = $('#article').val();
  console.log(bla);
  $( ".articles" ).append( "<div class='item'> <span class='glyphicon glyphicon-remove-circle remove' aria-hidden='true'></span> <span class='item-text'>"+bla+"</span> </div>" );
  
});

$.ajax({
  type: 'GET',
  url: '/api/Kartotek'+' '+'artikels',
  data: { //Lämna tom för att få ut all data
    tags: 'knife'
  }
})
  .done(function( msg ) {
    console.log(msg);
  })
  .fail(function(err, status){
    console.log('Någonting gick fel!');
    console.log(err);
    console.log(status);
  });

$.ajax({
  type: 'GET',
  url: '/api/operations',
  data: { //Lämna tom för att få ut all data
    title: 'Blind'
  }
})
  .done(function( msg ) {
    console.log("hej");
    console.log(msg);
  })
  .fail(function(err, status){
    console.log('Någonting gick fel!');
    console.log(err);
    console.log(status);
  });


//console.log(Operation.models.KartotekArticle.schema.statics.search("Kniv"));

