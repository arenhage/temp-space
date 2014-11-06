var Statistics 		= require('../schema-models/sm_statistics').Statistics;

exports.incSpaces = function() {
	try {
		Statistics.findOne({}, function(err, doc) {
			doc.spacesSinceBeginning += 1;
			doc.save();
		})	
	} catch(e) {
		logger.error(e);
	}
};

exports.incFilesAndSize = function(size) {
	try {
		Statistics.findOne({}, function(err, doc) {
			doc.filesUploadedSinceBeginning += 1;
			doc.filesTotalSizeSinceBeginning += size;
			doc.save();
		})	
	} catch(e) {
		logger.error(e);
	}
};