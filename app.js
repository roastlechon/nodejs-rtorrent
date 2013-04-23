var consolidate = require('consolidate');
var express = require('express');
var http = require("http");
var io = require("socket.io");

var app = express();
var server = http.createServer(app);
var io = io.listen(server);

app.engine('html', consolidate.handlebars);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');	
app.use(app.router);
app.use(express.static(__dirname + '/public'));

require('./controllers/index')(app, io);
require('./controllers/test')(app);

server.listen(3000);
console.log('Listening on port 3000');