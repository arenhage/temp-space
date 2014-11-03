//modules =================================================
var express 	= require('express');
var http 		= require('http')
var path		= require('path');
var mongoose	= require('mongoose');
var routes 		= require('./routes/index');
var routeSpace	= require('./routes/space');
var fs 			= require('fs');
var Grid 		= require('gridfs-stream');

//database ===========================================
var uri = 'mongodb://localhost/dasdatabase';
var db = mongoose.connection;
mongoose.connect(uri);
var conn = mongoose.createConnection(uri);

conn.on('error', console.error);
conn.once('open', function callback () {
	var app = express();
	var gfs = Grid(conn.db, mongoose.mongo);
	
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
	app.get('/space/download', function(req, res) {
		//TODO
	});
	
	//upload file
	app.post('/space/upload', function(req, res) {
		var tempfile    		= req.files.file.path;
		var originalFilename    = req.files.file.name;
		var writestream = gfs.createWriteStream({ 
			filename: originalFilename,
			metadata: {
				spaceId: req.body.spaceId
			}
		}).on('close', function(file) {
			console.log(file.filename);
		});

		// open a stream to the temporary file created by Express...
		fs.createReadStream(tempfile)
		.on('end', function() {
			res.send('OK');
		})
		.on('error', function() {
			res.send('ERR');
		})
		.pipe(writestream);	//pipe it to gfs writestream and store it in the database
	});

	//start server
	http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});
});
