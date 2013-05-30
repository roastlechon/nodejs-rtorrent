var consolidate = require('consolidate');
var express = require('express');
var upload = require('jquery-file-upload-middleware');
var http = require("http");
var io = require("socket.io");

var app = express();
var server = http.createServer(app);
var io = io.listen(server);

io.set('log level', 1);

upload.configure({
	uploadDir: __dirname + '/public/uploads',
	uploadUrl: '/uploads'
});

app.engine('html', consolidate.handlebars);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');	
app.use('/upload', upload.fileHandler());
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(__dirname + '/public'));

require('./controllers/index')(app, io);
require('./controllers/test')(app);
require('./controllers/add')(app);
require('./controllers/upload')(app, upload);
require('./controllers/torrent')(app);

server.listen(3000);
console.log('Listening on port 3000');