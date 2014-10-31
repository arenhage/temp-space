var mongoose = require('mongoose');

//schema =================================================
var spaceSchema = new mongoose.Schema({
	space_id : { type: String },
	items: { type: Array },
	createdAt: { type: Date } //{ type: Date, expires: 60 }
});

//static methods =================================================
spaceSchema.statics.findBySpaceId = function(spaceId, callback) {
	return this.findOne({ 'space_id':spaceId }, callback);
};

exports.Space = mongoose.model('Space', spaceSchema);