$(document).ready(function() {

  $(".process-content").hide();
  $("#content0").show();
  $("#0").addClass('active');

  $(".nav-pills > .navbar-btn").click(function() {
    $(this).addClass('active').siblings().removeClass('active');
    $(".process-content").hide();
    $("#content"+this.id).show();

  });
});

$("#startButtonkak").click(function(){
  createNewOperation();
});
