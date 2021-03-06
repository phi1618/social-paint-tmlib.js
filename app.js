
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3001);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/test', function(req, res){
  console.dir(req.app.settings.port);
//  res.send(res);
});

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);
//var socket = require('socket.io').listen(app);
io.sockets.on('connection', function(socket) {
  socket.on('start', function(data) {
    var data = {
      userId: socket.handshake.userId,
      data:data
    };
    socket.emit("start", data);
    socket.broadcast.emit("start", data);
  });
  socket.on('move', function(data) {
    var data = {
      userId: socket.handshake.userId,
      data:data
    };
    socket.emit("move", data);
    socket.broadcast.emit("move", data);
  });
});
