//modules =================================================
var express 	= require('express');
var http 		= require('http')
var path		= require('path');
var mongoose	= require('mongoose');
var log4js 		= require("log4js");
var Grid 		= require('gridfs-stream');
var config 		= require('./config.json');

var jog4jsConfig = {
	"appenders": [
		{
			"type": "console" 
		},
		{
			"type": "file", 
			"filename":__dirname + "/log/app.log", 
			"pattern":"-yyyy-MM-dd",
			"alwaysIncludePattern": true
		}
	],
	"replaceConsole": true
};

//log4js ===========================================
log4js.configure(jog4jsConfig);
var logger = log4js.getLogger();

//database ===========================================
var uri = config.mongo.uri;
mongoose.connect(uri);
var conn = mongoose.createConnection(uri, function(err) {
	if(err) logger.error(err);
});

conn.on('error', function(err) {
	logger.error(err);
});
conn.once('open', function callback () {
	logger.info("Connection open to MongoDB...");
	
	//globals ===========================================
	global.conn 	= conn;
	global.gridfs 	= Grid(conn.db, mongoose.mongo);
	global.config	= config;
	
	var app 				= express();
	var routes 				= require('./routes/index');
	var routeSpace			= require('./routes/space');
	var periodicClearning 	= require('./application/services/periodicClearing');
	
	//express configuration ===========================================
	logger.info("Configuring express app...");
	
	//development only
	if(app.get('env') == 'development') {
		app.use(express.errorHandler());
		app.use(express.logger('dev'));
	}
	
	if(app.get('env') == 'production') {
		app.use(express.errorHandler());
	}
	
	app.set('port', process.env.PORT || config.express.port);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));

	//routes ===========================================
	logger.info("Creating express routes...");
	
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
		logger.info('Express server listening on port ' + app.get('port') + ' | ' + app.get('env') + ' mode');
	});
});
