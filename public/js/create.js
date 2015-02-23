$('.remove').click(function(){
  $('.item').hide();
});


$( "#article" ).change(function() {
  var bla = $('#article').val();
  console.log(bla);
  $( ".articles" ).append( "<div class='item'> <span class='glyphicon glyphicon-remove-circle remove' aria-hidden='true'></span> <span class='item-text'>"+bla+"</span> </div>" );
  
});




