//modules =================================================
var express 	= require('express');
var http 		= require('http')
var path		= require('path');
var mongoose	= require('mongoose');
var routes 		= require('./routes/index');
var routeSpace	= require('./routes/space');

//database ===========================================
var uri = 'mongodb://localhost/dasdatabase';
var db = mongoose.connection;
mongoose.connect(uri);
var conn = mongoose.createConnection(uri);

conn.on('error', console.error);
conn.once('open', function callback () {
	var app = express();
	
	//configuration ===========================================
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));

	//development only
	if(app.get('env') == 'development') {
		app.use(express.errorHandler());
	}

	//routes ===========================================
	
	//index
	app.get('/', routes.index);
	
	//retreive space
	app.get('/space/:spaceId', routeSpace.list);
	
	//create a new space
	app.post('/space', routeSpace.add);
	
	//download file	
	app.get('/space/file/download/:filesId', routeSpace.download);
	
	//download file	
	app.post('/space/file/remove', routeSpace.remove);
	
	//upload file
	app.post('/space/file/upload', routeSpace.upload);

	//start server
	http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});
});
