var mongoose = require('mongoose');

//schema =================================================
var spaceSchema = new mongoose.Schema({
	spaceId : { type: String, unique:true },
	createdAt: { type: Date, expires: 60*15 }
});

//static methods =================================================
spaceSchema.statics.findBySpaceId = function(spaceId, callback) {
	return this.findOne({ 'spaceId':spaceId }, callback);
};

exports.Space = mongoose.model('Space', spaceSchema);