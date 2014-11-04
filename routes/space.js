//Space Routes =================================================
var Space 		= require('../application/schema-models/sm_space').Space;
var FSFile 		= require('../application/schema-models/sm_files').FSFile;
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
			if(data != null) {

				//using mongoose
//				FSFile.findByMetadataSpaceId(req.params.spaceId, function (err, files) {
//				res.render('space', { 
//				space: data,
//				files: JSON.stringify(files),
//				spaceId: req.params.spaceId,
//				title: 'temp-space'
//				});	
//				});

				//using gfs
				gfs.files.find({ 'metadata.spaceId': req.params.spaceId}).toArray(function (err, files) {
					if(err) {
						console.log(err)
						res.send("ERROR");
					}
					else {
						var expireIn = ((new Date(data.createdAt).getTime()+900000) - new Date().getTime())/1000
						console.log(expireIn);
						res.render('space', { 
							space: data,
							expireIn: expireIn,
							files: JSON.stringify(files),
							spaceId: req.params.spaceId,
							title: 'temp-space'
						});
					}
				})
			}
			else {
				res.render('notavailable', {
					spaceId: req.params.spaceId,
					title: 'temp-space'
				});
			}
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
		res.send(file);
	});

	// open a stream to the temporary file created by Express...
	fs.createReadStream(tempfile)
	.on('end', function() {
		//res.send('OK');
	})
	.on('error', function() {
		//res.send('ERR');
	})
	.pipe(writestream);	//pipe it to gfs writestream and store it in the database
};

exports.download = function(req, res) {
	if(req.params.filesId) {
		FSFile.findOne({'_id':req.params.filesId}, function (err, data) {
			if(err) {
				//TODO:
			}
			else {
				res.setHeader('Content-type', data.contentType);
				res.setHeader('Content-disposition', 'attachment; filename=' + data.filename);
				var readstream = gfs.createReadStream({
					_id: req.params.filesId,
				});
				readstream.pipe(res);	
			}
		});
	}
	else {
		res.send("ERROR");
	}
};

exports.remove = function(req, res) {
	if(req.body.filesId) {
		gfs.remove({'_id':req.body.filesId}, function (err) {
			if (err) return handleError(err);
			res.send('success');
		});
	}
	else {
		res.send("ERROR");
	}
};