/**
 * Created by abbe on 2015-03-06.
 */
$(document).ready( function() {
  $('#speciality').click( function() {
    console.log("lsadlsal");
    $(this).parent().find('#operations').toggleClass("hidden");
    console.log( $(this).parent().find('#operations').html());
  });  
});
