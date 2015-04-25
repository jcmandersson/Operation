/**
 * Created by Spinpoo on 2015-02-20.
 */
var socket = io();
var operationId;
var oldText;
var saved = false;

$(document).ready(function() {
  // Load comments
  operationId = $('#opName').attr('data-operationId');
  var rows = $('.check-js');

  // Set the color of the comment button depending on if there is a comment.
  rows.each(function(index, row) {
    var comment = $('#checkComment' + row.id);
    var commentButton = $('#commentButton' + row.id);
    changeCommentButton(comment, commentButton);
  });
  
  // Add click events to table rows in the checklist
  var container = $('.container');
  container.on("click", '.check-js', checkjs);
  
  
  var processContent = $('.process-content');
  processContent.on("click", '.cancelComment', cancelComment);
  processContent.on("click", '.saveComment', saveComment);
  processContent.on("click", '.showComment', showComment);
  
  
  var articleTable = $('.articleTable tbody');
  articleTable.on("click", '.article-remove', removeArticle);
  articleTable.on("click", '.minus-field', minusOne);
  articleTable.on("click", '.plus-field', plusOne);

  
  // Load templates and compile them.
  var unCompiledArticle = $('#article-template').html();
  var articleTemplate = Handlebars.compile(unCompiledArticle);
  var unCompiledComment = $('#comment-template').html();
  var commentTemplate = Handlebars.compile(unCompiledComment);
  

  // Listen to sockets (backend sockets in lib/checklist.js)
  socket.on('saveComment', saveCommentSocket);
  
  socket.on('removeCheckArticleUpdate', removeCheckArticleUpdate);
  
  socket.on('getCheckboxes', getCheckboxes);
  
  socket.on('newArticleUpdate', newArticleUpdate.bind(undefined, articleTemplate, commentTemplate));
  
  socket.on('articleAmountUpdate', function(amount, articleID) {
    var amountHtml = $('#amount'+articleID);
    var uneditableAmountHtml = $('#uneditableAmount'+articleID);
    amountHtml.find('.amount-field').text(amount);
    uneditableAmountHtml.find('.uneditable-amount').text(amount);
  });

  // Show saved text when the database has successfully stored the comment.
  socket.on('saved', function(id) {
    $('#commentSaved' + id).show();
  });

  // Runs after socket has been started. Get all checkbox statuses from db.
  socket.on('connect', function() {
    socket.emit('operationOpen', operationId);
  });

  socket.on('checkboxClick', function(checkObject) {
    var tableRow = $('#' + checkObject.id);
    updateTableRow(tableRow, checkObject.isChecked, false);
    checkIfDone();
  });
  
  socket.on('kartotekUpdate', function(checkObject) {
    var tableRow = $('#' + checkObject.id);
    updateTextInTableRow(tableRow, checkObject);
  });
  
});

// Definition of the minus button that appears when a checklist is edited
var minusOne = function() {

  var row = $(this).parent().parent();
  var checkbox = $(row).find('.checkbox-js');
  if (checkbox.hasClass('glyphicon-ok')) {
    checkAnArticle(row);
  }
  
  var operationID = $(this).parent().parent().attr("data-operationId");
  var checkArticleID = $(this).parent().parent().attr('id');
  var amountField = $(this).parent().find('.amount-field');
  var oldAmount = parseInt(amountField.text());
  var newAmount = oldAmount-1;
  if (newAmount > 0) {
    $(amountField).text(newAmount);
    socket.emit('amountChange', checkArticleID, operationID, newAmount);
  }
};

// Definition of the plus button that appears when a checklist is edited.
var plusOne = function() {
  
  var row = $(this).parent().parent();
  var checkbox = $(row).find('.checkbox-js');
  if (checkbox.hasClass('glyphicon-ok')) {
    checkAnArticle(row);
  }
  
  var operationID = $(this).parent().parent().attr("data-operationId");
  var checkArticleID = $(this).parent().parent().attr('id');
  var amountField = $(this).parent().find('.amount-field');
  var oldAmount = parseInt(amountField.text());
  var newAmount = oldAmount+1;
  if (newAmount > 0) {
    $(amountField).text(newAmount);
    socket.emit('amountChange', checkArticleID, operationID, newAmount);
  }
};

// Throw away texted comment if cancel button is clicked.
var cancelComment = function() {
  if (!saved) {
    var id = $(this).data('id');
    var checkComment = $('#checkComment' + id);
    checkComment.val(oldText);
  } else {
    saved = false;
  }
};

// When a checkable row is clicked, check the row and emit to socket.io
var checkjs = function(e) {
  var targetClassName = e.target.className.split(" ")[0];
  var targetTagName = e.target.tagName;
  if (!(targetTagName == 'BUTTON' || targetTagName == 'IMG' || targetClassName == 'amount' ||
        targetClassName == 'article-remove' || targetClassName == 'cross' || $('#editChecklist').is(":visible"))) {
    console.log(this);
    console.log($(this).prop('disabled'));
    if (!$(this).prop('disabled')) {
      checkAnArticle(this);
      checkIfDone();
    }
  }
};

var checkAnArticle = function(row) {
  var checkbox = $(row).find('.checkbox-js');
  var preparation = $(row).hasClass("process-content-item") ? true : false;

  checkbox.toggleClass('glyphicon-ok');
  
  // Function in checkEffect.js
  changeTableGraphics($(row), checkbox.hasClass('glyphicon-ok'), preparation);
  var checkObject = {
    preparation: $(row).data('preparation'),
    operation: operationId, id: $(row).attr('id'),
    check: checkbox.hasClass('glyphicon-ok')
  };

  socket.emit('checkboxClick', checkObject);
};

// check if done checking and mark as done.
var checkIfDone = function() {
  var done = true;
  $('.checkbox-js').each(function(i, box) {
    if (!$(box).hasClass('glyphicon-ok')) {
      done = false;
      return false;
    }
  });
  if (done) {
    $('#btn-done').addClass('btn-done');
  } else {
    $('#btn-done').removeClass('btn-done');
  }
};

// Save the comment locally and emit to back-end to save in database.
var saveComment = function() { 
  var id = $(this).data('id');
  var checkComment = $('#checkComment' + id);
  var commentButton = $('#commentButton' + id);

  if (checkComment.val() == "") {
    checkComment.val("-");
  }

  var commentObject = {operation: operationId, id: id, comment: checkComment.val()};
  
  socket.emit('saveComment', commentObject);
  changeCommentButton(checkComment, commentButton);

  checkComment.attr('disabled', true);
  $(this).attr('disabled', true);
  saved = true;
};

// Hide the "Saved" text, enable the comment field and save the old text if the user presses cancel.
var showComment = function() { 
  var id = $(this).data('id');
  var checkComment = $("#checkComment" + id);

  $('#commentSaved' + id).hide();
  checkComment.attr('disabled', false);
  oldText = checkComment.val();
  $('#saveComment' + id).attr('disabled', false);
};

var removeArticle = function() {
  var checkArticleID = $(this).parent().parent().attr('id');
  var operationID = $(this).parent().parent().attr("data-operationId");

  var confirmed = confirm("Är du säker på att du vill ta bort artikeln?");
  if (confirmed) {
    socket.emit('removeCheckArticle', checkArticleID, operationID);
  } else {
    return false;
  }
};

// set checked status and update row color.
var updateTableRow = function(tableRow, isChecked, isTemplate) {
  var checkbox = tableRow.find('.checkbox-js');
  isChecked ? checkbox.addClass('glyphicon-ok') : checkbox.removeClass('glyphicon-ok');
  var preparation = tableRow.hasClass("process-content-item") ? true : false;
  if (isTemplate) {
    checkbox.prop('disabled', true);
    tableRow.prop('disabled', true);
  }

  // Function in checkEffect.js
  changeTableGraphics(tableRow, isChecked, preparation);
};

var updateTextInTableRow = function(tableRow, checkObject) {
  var kartotekArticle = checkObject.kartotekArticle;
  
  tableRow.find('.name').eq(0).html('<p>'+checkObject.name+'</p>');
  tableRow.find('.storage').eq(0).html(kartotekArticle.storage);
  tableRow.find('.section').eq(0).html(kartotekArticle.section);
  tableRow.find('.shelf').eq(0).html(kartotekArticle.shelf);
  tableRow.find('.tray').eq(0).html(kartotekArticle.tray);
};

var saveCommentSocket = function (commentObject) {
  var comment = $('#checkComment' + commentObject.id);
  var commentButton = $('#commentButton' + commentObject.id);
  comment.val(commentObject.comment);
  changeCommentButton(comment, commentButton);
};

var removeCheckArticleUpdate = function(checkArticleID) {
  var row = $('#'+checkArticleID);
  row.remove();
  checkIfDone();
};

var getCheckboxes = function(checkboxesAndTemplate) {
  var checkboxes = checkboxesAndTemplate.checkboxes;
  var isTemplate = checkboxesAndTemplate.template;
  for (var index in checkboxes) {
    var checkbox = checkboxes[index];
    var tableRow = $('#' + checkbox._id);
    var isChecked = checkbox.checked;
    
    // var isDisabled = checkbox.attr("disabled");
    updateTableRow(tableRow, isChecked, isTemplate);
  }
  checkIfDone();
};

var newArticleUpdate = function(articleTemplate, commentTemplate, checkArticle, kartotekArticle, operationID) {
  
  var inserted = false;
  var lastindex = $('.articleTable > tbody > tr').length;
  $('.articleTable > tbody > tr').each(function (index) {
    var articleName = $(this).find(".name").text();
    if (compareString(checkArticle.name, articleName)<1) {
      $('.articleTable > tbody > tr').eq( index ).before($(articleTemplate({
        kartotek : kartotekArticle, name : checkArticle.name, operation: operationID,
        _id : checkArticle._id, amount : 1
      })));
      $(commentTemplate({ kartotek: kartotekArticle, _id: checkArticle._id, comment: '' })).appendTo('#contentchecklist');
      inserted = true;
      return false;
    }
  });
  if (!inserted) {
    $('.articleTable > tbody > tr').eq( lastindex-1 ).after($(articleTemplate({
      kartotek : kartotekArticle, name : checkArticle.name, operation: operationID,
      _id : checkArticle._id, amount : 1
    })));
    
    $(commentTemplate({ kartotek: kartotekArticle, _id: checkArticle._id, comment: '' })).appendTo('#contentchecklist');
  }

  checkIfDone();

  // TODO: refactor this later because ugly
  if ($('#editChecklistButton').text()=="Klar") {
    $('.centered-remove').show();
    $('.amountColumn').show();
    $('.uneditableAmountColumn').hide();
    $('.checkbox-js').hide();
  }
};

var compareString = function(a, b){
  var A = a.toLowerCase();
  var B = b.toLowerCase();
  if (A < B){
    return -1;
  }else if (A > B){
    return  1;
  }else{
    return 0;
  }
};
