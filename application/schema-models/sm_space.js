var mongoose = require('mongoose');

//schema =================================================
var spaceSchema = new mongoose.Schema({
	spaceId : { type: String },
	createdAt: { type: Date } //{ type: Date, expires: 60 }
});

//static methods =================================================
spaceSchema.statics.findBySpaceId = function(spaceId, callback) {
	return this.findOne({ 'spaceId':spaceId }, callback);
};

exports.Space = mongoose.model('Space', spaceSchema);