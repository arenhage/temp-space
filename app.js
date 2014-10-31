//modules =================================================
var express 	= require('express');
var http 		= require('http')
var path		= require('path');
var mongoose	= require('mongoose');
var routes 		= require('./routes/index');
var routeSpace	= require('./routes/space');

var app = express();

//uploader config
var options = {
		tmpDir:  __dirname + '/public/uploaded/tmp',
		publicDir: __dirname + '/public/uploaded',
		uploadDir: __dirname + '/public/uploaded/files',
		uploadUrl:  '/uploaded/files/',
		maxPostSize: 11000000000, // 11 GB
		minFileSize:  1,
		maxFileSize:  10000000000, // 10 GB
		acceptFileTypes:  /.+/i,
		// Files not matched by this regular expression force a download dialog,
		// to prevent executing any scripts in the context of the service domain:
		inlineFileTypes:  /\.(gif|jpe?g|png)$/i,
		imageTypes:  /\.(gif|jpe?g|png)$/i,
		imageVersions: {
			width:  80,
			height: 80
		},
		accessControl: {
			allowOrigin: '*',
			allowMethods: 'OPTIONS, HEAD, GET, POST, PUT, DELETE',
			allowHeaders: 'Content-Type, Content-Range, Content-Disposition'
		},
		nodeStatic: {
			cache:  3600 // seconds to cache served files
		}
};
var uploader = require('blueimp-file-upload-expressjs')(options);

//database ===========================================
var db = mongoose.connection;
db.on('error', console.error);
mongoose.connect('mongodb://localhost/dasdatabase');

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
app.get('/', routes.index);
app.get('/space/:space_id', routeSpace.list);
app.post('/space', routeSpace.add);
app.get('/upload', function(req, res) {
    uploader.get(req, res, function (obj) {
        res.render('upload', { 
    		obj: obj
    	});
    });
});

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
