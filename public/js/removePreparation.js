$('.confirmRemovePreparation').click(function() {
  var slug = $(this).attr('data-slug');
  $.ajax({
    type: 'DELETE',
    url: '/api/operations/' + slug
  })
    .done(function( msg ) {
    })
    .fail(function(err, status){
      console.log('Error');
      console.log(err);
      console.log(status);
    });
  window.location.href = '/';
});
