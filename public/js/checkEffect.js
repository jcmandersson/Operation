var changeTableGraphics = function(tablerow, isChecked){//Changes the color of tablerows when they are checked.
  if (isChecked) {
    tablerow.css('background-color', 'rgba(76, 169, 34, 0.2)');
  }
  else {
    tablerow.css('background-color', 'rgba(0,0,0,0)');
  }
};

var changeCommentButton = function (comment, commentButton) {
  if(comment.val() == "-") comment.val("");
  if(comment.val() != ""){
    commentButton.css('background-color','red');
  }
  else{
    commentButton.css('background-color', 'blue');
  }
};
