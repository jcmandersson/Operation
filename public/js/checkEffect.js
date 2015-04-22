// Changes the color of tablerows when they are checked.
var changeTableGraphics = function(tablerow, isChecked, preparation) {
  if (isChecked) {
    tablerow.css('background-color', 'rgba(76, 169, 34, 0.2)');
  } else {
    if (preparation) {
      tablerow.css('background-color', '');
    } else {
      tablerow.css('background-color', '');
    }
  }
};

var changeCommentButton = function(comment, commentButton) {
  if (comment.val() == "-") {
    comment.val("");
  }
  if (comment.val() != "") {
    commentButton.css('background-color','#D9534F');
    commentButton.css('border-color','#D9534F');
    commentButton.hover(function() {
      commentButton.css('background-color', '#C9302C');
    }, function() {
      commentButton.css('background-color', '#D9534F');
    });
    
  } else {
    commentButton.hover(function() {
      commentButton.css('background-color', '');
    }, function() {
      commentButton.css('background-color', '')
    });
    commentButton.css('border-color','');
    commentButton.css('background-color', '');
  }
};
