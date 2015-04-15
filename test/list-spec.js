describe("The list page", function() {

  it("function splitOnce can split a string with a char correctly", function() {
    var str = "a.b.c.d";
    var res = splitOnce(str, '.');
    expect(res[0]).toBe("a");
    expect(res[1]).toBe("b.c.d");
  });

  it("function splitOnce can split a string with a missing char correctly", function() {
    var str = "a.b.c.d";
    var res = splitOnce(str, ',');
    expect(res[0]).toBe("a.b.c.d");
    expect(res[1]).toBe('');
  });

  it("function addToUrl can add a specialty correctly with an empty query", function() {
    var url = "http://hej.com/list";
    url = addToUrl(url, "specialty", "Allmän kirurgi");
    expect(url).toBe("http://hej.com/list?specialty=Allmän kirurgi");
  });

  it("function addToUrl can add a specialty correctly with a non-empty query", function() {
    var url = "http://hej.com/list?specialty=Urologi&state=Utkast";
    url = addToUrl(url, "specialty", "Allmän kirurgi");
    expect(url).toBe("http://hej.com/list?specialty=Allmän kirurgi&state=Utkast");
  });

  it("function removeFromUrl can remove a specialty correctly with an query with one element", function() {
    var url = "http://hej.com/list?specialty=Urologi";
    url = removeFromUrl(url, "specialty");
    expect(url).toBe("http://hej.com/list?");
  });

  it("function removeFromUrl can remove a specialty correctly with a query with two elements", function() {
    var url = "http://hej.com/list?specialty=Urologi&state=Utkast";
    url = removeFromUrl(url, "specialty");
    expect(url).toBe("http://hej.com/list?state=Utkast");
  });

 it("function addAnd can add a & to a query that does not end with ?", function() {
    var url = "http://hej.com/list?specialty=Urologi";
    url = addAnd(url);
    expect(url).toBe("http://hej.com/list?specialty=Urologi&");
  });

  it("function addAnd can add a & to a query that does end with ?", function() {
    var url = "http://hej.com/list?";
    url = addAnd(url);
    expect(url).toBe("http://hej.com/list?");
  });

});

