$('.articles').on('click', '.remove', function(){
  $(this).parent().remove();
});

$( "#article" ).change(function() {

  $.ajax({
    type: 'GET',
    url: '/api/Kartotekartikels/'+ $('#article').val()
})
    .done(function( msg ) {
      
      console.log(msg);
      $( ".articles" ).append( "<div class='item' id="+msg._id+"> <span class='glyphicon glyphicon-remove-circle remove' aria-hidden='true'></span> <span class='item-text'>"+msg.name+"</span> </div>" );

    })
    .fail(function(err, status){
      console.log('Någonting gick fel!');
      console.log(err);
      console.log(status);
    });
  
  
  
});


