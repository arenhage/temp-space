// modules =================================================
var express 	= require('express');
var routes 		= require('./routes');
var routeSpace	= require('./routes/space');
var http 		= require('http')
var path		= require('path');
var mongoose	= require('mongoose');

var app = express();

//database ===========================================
var db = mongoose.connection;
db.on('error', console.error);
mongoose.connect('mongodb://localhost/dasdatabase');

//configuration ===========================================
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
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
app.get('/space/list/:identifier', routeSpace.list);
app.get('/space/create', routeSpace.add);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
