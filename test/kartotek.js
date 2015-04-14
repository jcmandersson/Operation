describe("The kartotek", function() {

  it("Article function can change data", function() {
    var elem = {
      data: 1
    };

    Article.call(elem, 2);
    expect(elem.data).toBe(2);
  });

  it("Article function can add an empty object if data is undefined", function() {
    var elem = {
      data: 1
    };

    Article.call(elem, undefined);
    expect(elem.data).toEqual({});
  });

});

