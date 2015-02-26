var keystone = require('keystone');
var kartotek = keystone.list('Kartotekartikel');

exports = module.exports = function(req, res) {
  var view = new keystone.View(req, res),
    locals = res.locals;
  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'home';
  
  kartotek.model.find()
    .exec(function(err, data) {
    if(err) {
      console.log('DB error');
      console.log(err);
    }
    else {
        locals.checks = data;
        // Render the view
        view.render('index');
    }
  });

  
  var sendCheckboxes = function(){
    keystone.io.emit('getCheckboxes', locals.checks);
  };
    
    
  keystone.io.on('connection', function(socket){
    sendCheckboxes();
    socket.on('checkboxClick', function(id){
      var idNumber = id.match(/\d+/)[0];  //Remove all non-digits in string.
      var isChecked = !locals.checks[idNumber].isChecked;
      locals.checks[idNumber].isChecked = isChecked;
      keystone.io.emit('checkboxClick', {id:id, isChecked: isChecked});
    });
  });
};
