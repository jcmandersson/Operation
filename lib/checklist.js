exports = module.exports = function (keystone) {

  //Load database models.
  var checklist = keystone.list('Artikel');
  var prepareList = keystone.list('Processinnehall');
  var processes = keystone.list('Processteg');
  var operations = keystone.list('Operation');
  var kartotek = keystone.list('Kartotekartikel');

  //Start socket.io
  keystone.io = require('socket.io').listen(keystone.httpServer);


  //Get data from database help functions
  var getFromDatabaseAndRun = function(databaseModel, searchData, callback) {
    databaseModel.model.find(searchData).exec(function(err, databaseData) {
      if (err) {
        console.log('Error when trying to get data from database at lib/checklist.js');
        console.log(err);
      }
      callback(databaseData);
    })
  };

  var getOneFromDatabaseAndRun = function(databaseModel, searchData, callback) {
    databaseModel.model.findOne(searchData).exec(function(err, databaseData) {
      if (err) {
        console.log('Error when trying to get data from database at lib/checklist.js');
        console.log(err);
      }
      callback(databaseData);
    })
  };


  keystone.io.on('connection', function(socket) {

    //Help functions

    //Save checbox click given fromand send to clients
    var saveAndSendCheckboxClick = function(err, checkbox, checkObject) {
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

    //Emit the checkboxes sent to this function to its clients
    var emitCheckboxes =  function(checkboxes, operation) {
      if (operation) {
        var checkboxesAndTemplate = {checkboxes: checkboxes, template: operation.template};
        socket.join(operation._id);
        keystone.io.to(operation._id).emit('getCheckboxes', checkboxesAndTemplate);
      } else {
        console.log('Something went wrong with socket.io. Operation not found.');
      }
    };

    var getAndSendPicklist = function(operationId) {
      getFromDatabaseAndRun(checklist, {operation: operationId}, function(checkboxes) {
        getFromDatabaseAndRun(operations, {_id: operationId}, function(operation) {
          emitCheckboxes(checkboxes, operation);
        })
      });
    };

    var getAndSendPrepareList = function(operationId) {
      getFromDatabaseAndRun(processes, {operation: operationId}, function(processList) {

        for (var i = 0; i < processList.length; i++) {
          getFromDatabaseAndRun(prepareList, {process: processList[i]._id}, function(checkboxes) {
            getFromDatabaseAndRun(operations, {_id: operationId}, function(operation) {
              emitCheckboxes(checkboxes, operation);
            })
          });
        }

      })
    };

    socket.on('updateOverview', function() {
      keystone.io.emit('updateOverview');
    });

    //Update checked status in database and send to clients.
    socket.on('checkboxClick', function(checkObject) {
      var list = checkObject.preparation ? prepareList : checklist;

      getOneFromDatabaseAndRun(list, {_id: checkObject.id}, function(checkbox) {
        saveAndSendCheckboxClick(undefined, checkbox, checkObject);

        getOneFromDatabaseAndRun(operations, {_id: checkObject.operation}, function(doc) {
          if (doc && typeof doc !== 'undefined') {
            doc.calculateProgress(function (data) {
              data.operation = checkObject.operation;
              keystone.io.to('overview').emit('updateProgress', data);
            });
          }
        });
      });
    });

    socket.on('overviewOpen', function() {
      socket.join('overview');
    });

    socket.on('operationOpen', function(operationId) {
      socket.join(operationId);
      getAndSendPicklist(operationId);
      getAndSendPrepareList(operationId);
    });

    socket.on('saveComment', function(commentObject) {
      console.log(commentObject);
      checklist.model.findOne({_id: commentObject.id})
        .exec(function (err, checkArticle) {
          if (err || checkArticle == null) {
            console.log('Could not get comment');
            console.log(err);
            console.log(checkArticle);
          } else {
            console.log(checkArticle);
            checkArticle.comment = commentObject.comment;
            checkArticle.save( function(err) {
              //Check if comment exists
              checklist.model.find({
                operation: commentObject.operation
              }).exec( function(err, checkArticles) {
                var exist = false;
                checkArticles.forEach(function(checkbox, j) {
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

    socket.on('articleAdd', function(kartotekArticle, operationID) {
      checklist.model.findOne({kartotek: kartotekArticle[0]._id, operation: operationID})
        .exec(function(err, checkArticle) {
          if (err) {
            console.log('Could not get checkArticle');
            console.log(err);
          } else {
            if (checkArticle!=null) {
              checkArticle.amount++;
              checkArticle.save();
              keystone.io.to(operationID).emit('articleAmountUpdate', checkArticle.amount, checkArticle.kartotek);
            } else {
              var newCheckArticle = new checklist.model({
                operation: operationID,
                name: kartotekArticle[0].name,
                kartotek: kartotekArticle[0]._id
              }).save(function (err,checkArticle) {
                  if (err) {
                    return;
                  }
                  keystone.io.to(operationID).emit('newArticleUpdate', checkArticle, kartotekArticle[0], operationID);

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

    socket.on('amountChange', function(checkArticleID, operationID, amount) {
      checklist.model.findOne({_id: checkArticleID})
        .exec(function (err, checkArticle) {
          if (err || checkArticle == null) {
            console.log('Could not get checkArticle');
            console.log(err);
          } else {
            checkArticle.amount = amount;
            checkArticle.save();
            keystone.io.to(operationID).emit('articleAmountUpdate', checkArticle.amount, checkArticle.kartotek);
          }
        });
    });

    socket.on('removeCheckArticle', function(checkArticleID, operationID){
      checklist.model.findOne({_id: checkArticleID})
        .exec(function (err, checkArticle) {
          if (err || checkArticle == null) {
            console.log('Could not get checkArticle');
            console.log(err);
          } else {
            checkArticle.remove();
            keystone.io.to(operationID).emit('removeCheckArticleUpdate', checkArticleID);

            operations.model.findOne({_id: operationID}, function (err, doc) {
              if (err) console.log(err);
              if (doc && typeof doc !== 'undefined') {
                doc.calculateProgress(function(data) {
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
      operations.model.findOne({_id: doneData.operation}, function(err, op) {
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

    socket.on ('kartotekUpdate', function(kartotekArticle) {
      checklist.model.find({kartotek: kartotekArticle.id}, function(err, checkArticles) {
        if (err) {
          console.log(err);
        } else {
          for (var index in checkArticles) {
            keystone.io.to(checkArticles[index].operation).emit('kartotekUpdate', {
              id: checkArticles[index]._id,
              name: kartotekArticle.name,
              kartotekArticle: kartotekArticle
            });
            checklist.model.update({_id: checkArticles[index]._id}, {
              $set:{name: kartotekArticle.name}
            }, function(err, saved) {
              if (err) {
                console.log(err);
              }
            });
          }
        }
      })
    });

    socket.on('removeKartotekArticle', function(kartotekSlug) {
      kartotek.model.findOne({slug: kartotekSlug}, function(err, kartotekArticle) {
        if (err) {
          console.log(err);
        } else{
          checklist.model.find({kartotek: kartotekArticle._id}, function (err, checkArticles) {
            if (err) {
              console.log(err);
            } else {
              var empty = {name: "", storage: "<p class='errorText'>Utgått</p>", section: "", shelf: "", tray: ""};
              for (var index in checkArticles) {
                keystone.io.to(checkArticles[index].operation).emit('kartotekUpdate', {
                  id: checkArticles[index]._id,
                  name: checkArticles[index].name,
                  kartotekArticle: empty
                });
              }
            }
          })
        }
      });
    });

  });

};
