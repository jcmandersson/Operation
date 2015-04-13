exports = module.exports = function (keystone) {
  var checklist = keystone.list('Artikel');
  var prepareList = keystone.list('Processinnehall');
  var processes = keystone.list('Processteg');
  var operations = keystone.list('Operation');
  
//Start socket.io
  keystone.io = require('socket.io').listen(keystone.httpServer);
  

  var saveAndsendCheckboxClick = function(err, checkbox, checkObject){ //Save checbox click and send to clients
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
  };
  
  keystone.io.on('connection', function (socket) {
    socket.on('checkboxClick', function (checkObject) { //Update checked status in database and send to clients.
      if(checkObject.preparation){
        prepareList.model.findOne({_id: checkObject.id}, function (err, checkbox) {
          saveAndsendCheckboxClick(err, checkbox, checkObject);
        });

      }
      else{
        checklist.model.findOne({_id: checkObject.id}, function (err, checkbox) {
          saveAndsendCheckboxClick(err, checkbox, checkObject);
          
          operations.model.findOne({_id: checkObject.operation}, function (err, doc) {
            if (err) console.log(err);
            if (doc && typeof doc !== 'undefined') {
              doc.calculateProgress(function (data) {
                console.log(data);
                data.operation = checkObject.operation;
                keystone.io.to('overview').emit('updateProgress', data);
              });
            }
          });
          
        });
      }
    });

    var emitCheckboxes =  function(checkboxes, operation, err){ //Emit the checkboxes sent to this function to its clients
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
    
    var getAndSendPicklist = function(operationId){
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
    };
    var getAndSendPrepareList = function(operationId) {
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
    };
    socket.on('overviewOpen', function() {
      socket.join('overview');
    });

    socket.on('operationOpen', function (operationId) {
      getAndSendPicklist(operationId);
      getAndSendPrepareList(operationId);
    });
    
    socket.on('saveComment', function(commentObject){
      checklist.model.findOne({_id: commentObject.id})
        .exec(function (err, checkArticle) {
          if(err) {
            console.log('Could not get comment');
            console.log(err);
          }else{
            checkArticle.comment = commentObject.comment;
            checkArticle.save( function(err) {
              //Check if comment exists
              checklist.model.find({
                operation: commentObject.operation
              }).exec( function(err, checkArticles) {
                var exist = false;
                checkArticles.forEach( function(checkbox, j) {
                  if (checkbox.comment !== '' && checkbox.comment !== '-') {
                    exist = true;
                    return false;
                  }
                });
                keystone.io.to('overview').emit('commentExist', {
                  hasComment: exist,
                  id: commentObject.operation
                });
              });
            });            
            socket.emit('saved', commentObject.id);
            socket.broadcast.to(commentObject.operation).emit('saveComment', commentObject);
            
            //keystone.io.to(commentObject.operation).emit('saved', commentObject.id);            
          }
        });
    });
    
    socket.on('articleAdd', function(articleObject, operationID){
      checklist.model.findOne({kartotek: articleObject[0]._id, operation: operationID})
        .exec(function (err, checkArticle) {
          if(err) {
            console.log('Could not get checkArticle');
            console.log(err);
          }else{
            if (checkArticle!=null){ 
              checkArticle.amount++;
              checkArticle.save();
              keystone.io.to(operationID).emit('articleAmountUpdate', checkArticle.amount, checkArticle.kartotek);
            }
            else{
              var newCheckArticle = new checklist.model({
                operation: operationID,
                name: articleObject[0].name,
                kartotek: articleObject[0]._id
              }).save(function (err,data) {
                  if (err) {
                    return;
                  }
                  keystone.io.to(operationID).emit('newArticleUpdate', data, articleObject[0], operationID);

                  operations.model.findOne({_id: operationID}, function (err, doc) {
                    if (err) console.log(err);
                    if (doc && typeof doc !== 'undefined') {
                      doc.calculateProgress(function (data) {
                        console.log(data);
                        data.operation = operationID;
                        keystone.io.to('overview').emit('updateProgress', data);
                      });
                    }
                  });
                  
                });
            }
          }
        });
    });
    
    socket.on('amountChange', function(checkArticleID, operationID, amount){
      checklist.model.findOne({_id: checkArticleID})
        .exec(function (err, checkArticle) {
          if(err) {
            console.log('Could not get checkArticle');
            console.log(err);
          }else{
            checkArticle.amount = amount;
            checkArticle.save();
            keystone.io.to(operationID).emit('articleAmountUpdate', checkArticle.amount, checkArticle.kartotek);
          }
        });
    });

    socket.on('removeCheckArticle', function(checkArticleID, operationID){
      checklist.model.findOne({_id: checkArticleID})
        .exec(function (err, checkArticle) {
          if(err) {
            console.log('Could not get checkArticle');
            console.log(err);
          }else{
            checkArticle.remove();
            keystone.io.to(operationID).emit('removeCheckArticleUpdate', checkArticleID);

            operations.model.findOne({_id: operationID}, function (err, doc) {
              if (err) console.log(err);
              if (doc && typeof doc !== 'undefined') {
                doc.calculateProgress(function (data) {
                  console.log(data);
                  data.operation = operationID;
                  keystone.io.to('overview').emit('updateProgress', data);
                });
              }
            });
            
          }
        });
    });
    
    socket.on('markAsDone', function(doneData) {
      operations.model.findOne({_id: doneData.operation}, function (err, op) {
        op.isDone = doneData.isDone;
        op.save(function (err) {
          if (err) {
            console.log('Failed to save isDone');
            console.log(err);
          } else {
            keystone.io.to(doneData.operation).emit('markAsDone', doneData);
            keystone.io.to('overview').emit('markAsDone', doneData);
          }
        })
      });
    });

  });
  
};
