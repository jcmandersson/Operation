var keystone = require('keystone');
var kartotek = keystone.list('Artikel');

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
  

  //Socket IO stuff
  
  var sendCheckboxes = function(){ //Send checkboxes to clients
    keystone.io.emit('getCheckboxes', locals.checks);
  };
  
  keystone.io.on('connection', function(socket){
    sendCheckboxes();
    socket.on('checkboxClick', function(id){ //Update checked status in database and send to clients.
      kartotek.model.findOne({ _id: id }, function (err, checkbox){
        if(err){
          console.log('Id kunde inte hittas');
          return;
        }
        checkbox.checked = !checkbox.checked;
        checkbox.save();
        keystone.io.emit('checkboxClick', {id:id, isChecked: checkbox.checked});
      });
    });
  });
};
