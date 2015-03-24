exports = module.exports = function (keystone) {
  var checklist = keystone.list('Artikel');
  var operations = keystone.list('Operation');
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
        checkbox.checked = checkObject.check;
        checkbox.save(function (err) {
          keystone.io.to(checkObject.operation).emit('checkboxClick', {
            id: checkObject.id,
            isChecked: checkObject.check
          });
          operations.model.findOne({_id: checkObject.operation}, function (err, doc) {
            if (err) console.log(err);
            if (doc && typeof doc !== 'undefined') {
              doc.calculateProgress(function (data) {
                data.operation = checkObject.operation;
                keystone.io.emit('updateProgress', data);
              });
            }
          });
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
            operations.model.findOne({_id: operationId})
              .exec(function (err, operation) {
                if (err) {
                  console.log('DB error');
                  console.log(err);
                } else if (operation) {
                  var checkboxesAndTemplate = {checkboxes: checkboxes, template: operation.template};
                  socket.join(operationId);
                  keystone.io.to(operationId).emit('getCheckboxes', checkboxesAndTemplate);
                } else {
                  console.log('Something went wrong with socket.io. Operation not found.');
                }
              })

          }
        });
    });
    
    socket.on('saveComment', function(commentObject){
      checklist.model.findOne({_id: commentObject.id})
        .exec(function (err, checkArticle) {
          if(err) {
            console.log('Could not find comment');
            console.log(err);
          }else{
            checkArticle.comment = commentObject.comment;
            checkArticle.save();
          }
        });
    });
  });
};
