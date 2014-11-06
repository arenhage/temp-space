// Index Routes =================================================
var logger 		= require('log4js').getLogger();
var Statistics	= require('../application/schema-models/sm_statistics').Statistics;

exports.index = function(req, res){
	Statistics.findOne({}, function(err, doc) {
		res.render('index', { 
			title: global.config.basic.appName,
			err: null,
			nrSpaces:doc.spacesSinceBeginning,
			nrUploads:doc.filesUploadedSinceBeginning,
			totalSize:doc.filesTotalSizeSinceBeginning.toFixed(2)
		});
	});
};