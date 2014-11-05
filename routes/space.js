//Space Routes =================================================
var Space 		= require('../application/schema-models/sm_space').Space;
var FSFile 		= require('../application/schema-models/sm_files').FSFile;
var mongoose	= require('mongoose');
var fs 			= require('fs');
var logger 		= require('log4js').getLogger();

//gridfs ===========================================
var gfs = global.gridfs;

exports.list = function(req, res) {
	if(req.params.spaceId) {
		Space.findBySpaceId(req.params.spaceId, function (err, data) {
			if(data != null) {

				//using mongoose
//				FSFile.findByMetadataSpaceId(req.params.spaceId, function (err, files) {
//					res.render('space', { 
//						space: data,
//						files: JSON.stringify(files),
//						spaceId: req.params.spaceId,
//						title: global.config.basic.appName
//					});	
//				});

				//using gfs
				gfs.files.find({ 'metadata.spaceId': req.params.spaceId}).toArray(function (err, files) {
					if(err) {
						logger.error(err);
						res.send("ERROR");
					}
					else {
						var offset = Space.schema.paths.createdAt.options.expires * 1000;
						var expireAt = new Date(data.createdAt).getTime()+offset;
						res.render('space', { 
							space: data,
							expireAt: expireAt,
							files: JSON.stringify(files),
							spaceId: req.params.spaceId,
							title: global.config.basic.appName
						});
					}
				})
			}
			else {
				res.render('notavailable', {
					spaceId: req.params.spaceId,
					title: global.config.basic.appName
				});
			}
		});
	}
};

exports.add = function(req, res) {
	if(req.body.spaceId != null && req.body.spaceId != "") {
		var obj = new Space({
			spaceId: req.body.spaceId,
			createdAt: new Date()
		});

		obj.save(function(err, data) {
			if (err) {
				logger.error(err);
				res.render('index', {
					spaceId: req.body.spaceId,
					err: JSON.stringify({err:"Unable To Create Space"}),
					title: global.config.basic.appName
				});
			}
			else {
				res.redirect('/space/'+req.body.spaceId);	
			}
		});
	}
	else {
		logger.warn({"req.body.spaceId":req.body.spaceId});
		res.render('index', {
			spaceId: req.body.spaceId,
			err: JSON.stringify({err:"Unable To Create Space"}),
			title: global.config.basic.appName
		});
	}
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
				logger.error(err);
				res.send("Unable to obtain file, file is missing...");
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
			res.send('SUCCESS');
		});
	}
	else {
		res.send("ERROR");
	}
};