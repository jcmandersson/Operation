describe("Info page tabs", function() {
    $('#0').click(function() {
      tabClick(this); 
    });
 
    $('#all').click(function() {
      tabClick(this); 
    });

  it("can show the tabs content on click", function() {
    $('#content0').hide();   
    $('#0').click();
    expect($('#content0')).toBeVisible();
  });

  it("can hide other tabs content on click", function() {
    $('#content1').show();   
    $('#0').click();
    expect($('#content1')).toBeHidden();
  });

  it("can show all contents with All information", function() {
    $('#content0').hide();   
    $('#content1').hide();   
    $('#contentchecklist').show();   
    $('#all').click();
    expect($('#content0')).toBeVisible();
    expect($('#content1')).toBeVisible();
    expect($('#contentchecklist')).toBeHidden();
    $('#nav-test').remove();
  });

});

