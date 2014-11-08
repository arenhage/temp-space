//schedules ===========================================
var Space 		= require('../schema-models/sm_space').Space;
var FSFile 		= require('../schema-models/sm_files').FSFile;
var mongoose	= require('mongoose');
var fs 			= require('fs');
var logger 		= require('log4js').getLogger();

//gridfs ===========================================
var gfs	= global.gridfs;

setInterval(function() {
	var offset = Space.schema.paths.createdAt.options.expires * 1000;
	var now = new Date().getTime();
	var tail = now - offset;
	
	try {
		FSFile.findByUploadDateLessThan(tail, function (err, files) {
			if(err) logger.error(err);
			else {
				for(file_index in files) {
					gfs.remove({'_id':files[file_index]._id}, function (err) {
						if(err) logger.error(err);
					});
				}
			}
		});
	} catch(e) {
		logger.error(e);
	}
}, 60000*10);
