describe("Specialty", function() {
  $('#al').click(function() {
    toggleClassHidden(this);
  });

  it("can hide the operations on click", function() {
    $('#opList').removeClass('hidden'); 
    $('#al').click();
    expect($('#opList')).toHaveClass('hidden');
    $('#specialty-test').remove();
  });

  it("can show the operations on click", function() {
    $('#opList').addClass('hidden'); 
    $('#al').click();
    expect($('#opList')).not.toHaveClass('hidden');
    $('#specialty-test').remove();
  });
});

