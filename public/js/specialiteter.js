/**
 * Created by abbe on 2015-03-06.
 */
$(document).ready( function() {
  $('.speciality').click( function() {
    $(this).parent().find('.operations').toggleClass("hidden");   
  });  
});
