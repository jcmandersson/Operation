describe("CalculateProgress", function() {
  it("can calculate the progress of 3 of a total of 5", function() {
    var object = {checked: 3, total: 5};
    var res = calculateProgress(object);
    expect(res).toBe(60);
  });

  it("can calculate the progress of 7 of a total of 7", function() {
    var object = {checked: 7, total: 7};
    var res = calculateProgress(object);
    expect(res).toBe(100);
  });

  it("can calculate the progress of 1 of a total of 100", function() {
    var object = {checked: 1, total: 100};
    var res = calculateProgress(object);
    expect(res).toBe(1);
  });

  it("can handle 0 total", function() {
    var object = {checked: 1, total: 0};
    var res = calculateProgress(object);
    expect(res).toBe(1);
  });

  it("can handle 0 checked", function() {
    var object = {checked: 0, total: 1};
    var res = calculateProgress(object);
    expect(res).toBe(1);
  });
});

