function calculateProgress(d) {
  if(!d.total || !d.checked) return 1;
  console.log(d.checked/ d.total);
  return Math.round(100*d.checked/ d.total);
}

var getComments = function(operation, template) {
  $.ajax({
      type: 'GET',
      url: '/api/artikels/',
      data: {
        operation: operation
      }
  }).done(function(checkArticles) {
    var operationArticles = [];
    for(var i in checkArticles) {
      if(checkArticles[i].operation == operation) {
        operationArticles.push(checkArticles[i]);
      }
    }
    $('#currentModal').html(template({checkArticles: operationArticles}));
    $('#operationComments').modal({show: true});
  })
    .fail(function(err, status) {
      console.log('Någonting gick fel!');
      console.log(err);
      console.log(status);
    });
};

var toggleHidden = function(elem) {
  if (elem.checked) {
    return '?hidden=true'
  } else {
    return '/'
  }
};

$(document).ready(function() {

  if ($('#hideDone').val() == "true") {
    $('#hideDone').attr('checked', true);
  } else {
    $('#hideDone').attr('checked', false);
  }

  $('#hideDone').change(function() {
    window.location.href = toggleHidden(this);
  }); 
  
  $('.progressbar').each(function(i, e) {
    
    var percentage = parseInt($(e).attr('data-percent'));
    
    $(e).progressbar({
      value: percentage
    }).children('.ui-progressbar-value')
      
      //.html('&nbsp;&nbsp;&nbsp;' + $(e).attr('data-checked') + ' / ' + $(e).attr('data-total'))
      .html('&nbsp;&nbsp;&nbsp;' + percentage + '% (' + $(e).attr('data-checked') + '/' + $(e).attr('data-total') + ')')
      .css( {display: 'block',
              height: 'auto'});
    if ($(e).hasClass('isDone')) {
      $(e).children('.ui-progressbar-value').addClass('progressbar-done');
    }
  });
  
  var unCompiledOperationCommentsTemplate = $('#operationComments-template').html();
  var compiledOperationCommentsTemplate = Handlebars.compile(unCompiledOperationCommentsTemplate);
  $('.showOperationCommentsButton').click(function() {
    var operation = $(this).attr('data-operation');
    getComments(operation, compiledOperationCommentsTemplate)
  });

  var socket = io();
  socket.on('connect', function() {
    socket.emit('overviewOpen');
  });
  
  
  socket.on('updateProgress', function(progress) {
    console.log(progress);
    var percent = calculateProgress(progress.all);
    var $progress = $('[data-id="'+progress.operation+'"] .progressbar').progressbar("value", percent);
    console.log($progress);
    if (percent === 1) percent--;
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
  
  socket.on('commentExist', function(commentData) {
    if (commentData.hasComment) {
      $('#comment-icon' + commentData.id).removeClass('hidden');      
    } else {
      $('#comment-icon' + commentData.id).addClass('hidden');
    }
  });
  
  socket.on('updateOverview', function() {
    window.location.reload();
  });
  
});
