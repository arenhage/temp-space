//Space Routes =================================================
var Space 		= require('../application/schema-models/sm_space').Space;
var mongoose	= require('mongoose');
var fs 			= require('fs');
var Grid 		= require('gridfs-stream');

//database ===========================================
var uri 	= 'mongodb://localhost/dasdatabase';
var conn 	= mongoose.createConnection(uri);
var gfs 	= Grid(conn.db, mongoose.mongo);

exports.list = function(req, res) {
	if(req.params.spaceId) {
		Space.findBySpaceId(req.params.spaceId, function (err, data) {
			res.render('space', { 
				space: data,
				spaceId: req.params.spaceId,
				title: 'temp-space'
			});
		});
	}
};

exports.add = function(req, res) {
	if(req.body.spaceId != null) {
		var obj = new Space({
			spaceId: req.body.spaceId,
			createdAt: new Date()
		});

		obj.save(function(err, data) {
			if (err) return console.error(err);
		});	
	}

	res.redirect('/space/'+req.body.spaceId);
};

exports.upload = function(req, res) {
	var tempfile    		= req.files.file.path;
	var originalFilename    = req.files.file.name;
	var writestream = gfs.createWriteStream({ 
		filename: originalFilename,
		metadata: {
			spaceId: req.body.spaceId,
			uploadDateMillis: new Date().getTime()
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
};

exports.download = function(req, res) {
	
};