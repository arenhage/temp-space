var mongoose = require('mongoose');

//schema =================================================
var statisticsSchema = new mongoose.Schema({
	spacesSinceBeginning: {type: Number, default: 0},
	filesUploadedSinceBeginning: {type: Number, default: 0},
	filesTotalSizeSinceBeginning: {type: Number, default: 0},
});

exports.Statistics = mongoose.model('Statistics', statisticsSchema);

//if no statistics object, create one.
exports.Statistics.findOne({}, function(err, data) {
	if(data == null) {
		new exports.Statistics().save();
	}
});
