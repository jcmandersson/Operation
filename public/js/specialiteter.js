/**
 * Created by abbe on 2015-03-06.
 */
toggleClassHidden = function(elem) {
  $(elem).parent().find('.operations').toggleClass("hidden");   
};

$(document).ready(function() {
  $('.speciality').click(function() {
    toggleClassHidden(this);  
  });  
});
