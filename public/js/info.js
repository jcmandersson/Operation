$(document).ready(function() {


  $("#all").addClass('active');

  $(".nav-pills > .navbar-btn").click(function() {
    $(this).addClass('active').siblings().removeClass('active');
    if(this.id == "all") { 
      $(".process-content").show();
      $("#contentchecklist").hide();
    } else {
      $(".process-content").hide();
      $("#content"+this.id).show();
    } 
  });
});

$("#createOperationInstanceButton").click(function(){
  createNewOperation();
});
