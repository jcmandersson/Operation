function calculateProgress(d){
  if(!d.total || !d.checked) return 1;
  console.log(d.checked/ d.total);
  return Math.round(100*d.checked/ d.total);
}

$(document).ready(function(){
  
  $('.progressbar').each(function(i, e){
    
    var percentage = parseInt($(e).attr('data-percent'));
    
    $(e).progressbar({
      value: percentage
    }).children('.ui-progressbar-value')
      //.html('&nbsp;&nbsp;&nbsp;' + $(e).attr('data-checked') + ' / ' + $(e).attr('data-total'))
      .html('&nbsp;&nbsp;&nbsp;' + percentage + '% (' + $(e).attr('data-checked') + '/' + $(e).attr('data-total') + ')')
      .css("display", "block");
    if ($(e).hasClass('isDone')) {
      $(e).children('.ui-progressbar-value').addClass('progressbar-done');
    }
  });

  var socket = io();
  socket.on('connect', function() {
    socket.emit('overviewOpen');
  });
  
  
  socket.on('updateProgress', function (progress) {
    console.log(progress);
    var percent = calculateProgress(progress.all);
    var $progress = $('[data-id="'+progress.operation+'"] .progressbar').progressbar("value", percent);
    console.log($progress);
    if(percent === 1) percent--;
    $progress.find('.ui-progressbar-value').html('&nbsp;&nbsp;&nbsp;'+percent+'% ('+progress.all.checked+'/'+progress.all.total+')');
  });
  
  socket.on('markAsDone', function(data) {    
    var $progress = $('[data-id="' + data.operation + '"] .progressbar');    
    if (data.isDone) {
      $progress.find('.ui-progressbar-value').addClass('progressbar-done');
    } else {
      $progress.find('.ui-progressbar-value').removeClass('progressbar-done'); 
    }
  });
  
});
