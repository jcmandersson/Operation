var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var boxes = [];

//app.get('/', function(req, res){
//  res.sendFile('index.html');
//});
app.use(express.static(__dirname + '/public'));

http.listen(3000);

io.on('connection', function(socket){
  socket.emit('start', boxes);
  
  socket.on('add', function(name){
  	boxes.push([name, false]);
    io.emit('add', [name, boxes.length - 1]);
  });

  socket.on('change', function(id){
  	boxes[id][1] = !boxes[id][1];
  	io.emit('change', [id, boxes[id][1]]);
  });

  socket.on('delete', function(id){
  	boxes.splice(id, 1);
  	//console.log(boxes);
  	io.emit('delete', id);
  });

});