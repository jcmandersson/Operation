describe('Travis CI', function() {

  it('can do a lot of tests', function() {
    var date = new Date();
    var startTime = date.getTime();
    var time = startTime;
    var i = 0;
  
    while (time < startTime + 1000) {  
      var str = 'a.b.c.d';
      var res = splitOnce(str, '.');
      expect(res[0]).toBe('a');
      expect(res[1]).toBe('b.c.d');
      
      i++;
      date = new Date(); 
      time = date.getTime();
    };

    console.log(i);
  });
});

