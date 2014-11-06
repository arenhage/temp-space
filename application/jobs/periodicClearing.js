//schedules ===========================================
var schedule 	= require('node-schedule');
var Space 		= require('../schema-models/sm_space').Space;
var FSFile 		= require('../schema-models/sm_files').FSFile;
var mongoose	= require('mongoose');
var fs 			= require('fs');
var logger 		= require('log4js').getLogger();

//gridfs ===========================================
var gfs	= global.gridfs;

schedule.scheduleJob("*/10 * * * *", function() {
	logger.info("Running periodic cleaning...")
	var offset = Space.schema.paths.createdAt.options.expires * 1000;
	var now = new Date().getTime();
	var tail = now - offset;
	var filesRemoved = 0;
	
	try {
		FSFile.findByUploadDateLessThan(tail, function (err, files) {
			if(err) logger.error(err);
			else {
				for(file_index in files) {
					gfs.remove({'_id':files[file_index]._id}, function (err) {
						if(err) logger.error(err);
						else filesRemoved++;
					});
				}
			}
		});
	} catch(e) {
		logger.error(e);
	}
	
	logger.info("Files removed: " + filesRemoved);
});
