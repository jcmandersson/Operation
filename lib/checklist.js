

exports = module.exports = function(keystone) {
  var checklist = keystone.list('Artikel');
//Start socket.io
  keystone.io = require('socket.io').listen(keystone.httpServer);

  var sendCheckboxes = function () { //Send checkboxes to clients
    checklist.model.find()
      .exec(function (err, checkboxes) {
        if (err) {
          console.log('DB error when trying to send checklist from server to client.');
          console.log(err);
        }
        else {
          keystone.io.emit('getCheckboxes', checkboxes);
        }
      });
  };

  keystone.io.on('connection', function (socket) {
    socket.on('checkboxClick', function (checkObject) { //Update checked status in database and send to clients.
      checklist.model.findOne({_id: checkObject.id}, function (err, checkbox) {
        if (err) {
          console.log('ID: ' + id + ' kunde inte hittas');
          console.log(err);
          return;
        }
        checkbox.checked = !checkbox.checked;
        checkbox.save();
        keystone.io.to(checkObject.operationId).emit('checkboxClick', {
          id: checkObject.id,
          isChecked: checkbox.checked
        });
      });
    });

    socket.on('operationOpen', function (operationId) {
      checklist.model.find({operation: operationId})
        .exec(function (err, checkboxes) {
          if (err) {
            console.log('DB error');
            console.log(err);
          }
          else {
            socket.join(operationId);
            keystone.io.to(operationId).emit('getCheckboxes', checkboxes);
          }
        });
    })
  });
};
