var app = require('./app');
var http = require('http');
var mongoose = require('mongoose');
// mongoose.Promise = require('q');

var port = normalizePort(process.env.PORT || '3001');
app.set('port', port);


var server = http.createServer(app);


server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
	var port = parseInt(val, 10);
	
	if (isNaN(port)) {
		return val;
	}
	
	if (port >= 0) {
		return port;
	}
	
	return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}
	
	var bind = typeof port === 'string'
		? 'Pipe ' + port
		: 'Port ' + port;
	
	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr.port;
	// mongoose.connect('mongodb+srv://ibook:ibook@cluster0-snq4g.gcp.mongodb.net/ibook?retryWrites=true', { useNewUrlParser: true } , function (err) {
	mongoose.connect('mongodb://127.0.0.1:27017/eyelife', { useNewUrlParser: true } , function (err) {
		if (err) {
			console.error('connect to mongo server error: ' + err.message);
		}
		console.log('connect to mongodb server success!');
	});
	mongoose.set('useCreateIndex', true);
	console.log('Listening on ' + bind);
}
