exports = module.exports = function (keystone) {
  var checklist = keystone.list('Artikel');
  var prepareList = keystone.list('Processinnehall');
  var processes = keystone.list('Processteg');
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
      if(checkObject.preparation){
        prepareList.model.findOne({_id: checkObject.id}, function (err, checkbox) {
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
          });

        });

      }
      else{
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
      }
    });

    var emitCheckboxes =  function(checkboxes, operation, err){
      if (err) {
        console.log('DB error emit checkboxes');
        console.log(err);
      } else if (operation) {
        var checkboxesAndTemplate = {checkboxes: checkboxes, template: operation.template};
        socket.join(operation._id);
        keystone.io.to(operation._id).emit('getCheckboxes', checkboxesAndTemplate);
      } else {
        console.log('Something went wrong with socket.io. Operation not found.');
      }
    };

    socket.on('operationOpen', function (operationId) {
      checklist.model.find({operation: operationId})
        .exec(function (err, checkboxes) {
          if (err) {
            console.log('DB error checklistopen');
            console.log(err);
          } else {
            operations.model.findOne({_id: operationId})
              .exec(function (err, operation) {
                emitCheckboxes(checkboxes, operation, err);
              })
          }
        });

      processes.model.find({operation: operationId})
        .exec(function (err, processList) {
          if (err) {
            console.log('DB error prepareopen');
            console.log(err);
          }
          else {
            
            for (var i = 0; i < processList.length; i++) {
              prepareList.model.find({process: processList[i]._id})
                .exec(function (err, checkboxes) {
                  if (err) {
                    console.log('DB error prepareopen');
                    console.log(err);
                  }
                  else {
                    operations.model.findOne({_id: operationId})
                      .exec(function (err, operation) {
                        emitCheckboxes(checkboxes, operation, err);
                      })
                  }
                });
            }
          }
        })
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
            keystone.io.to(commentObject.operation).emit('saved', commentObject.id);
          }
        });
    });
  });
};
