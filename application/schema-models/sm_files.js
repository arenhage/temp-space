var mongoose = require('mongoose');

//schema =================================================
var fsfilesSchema = new mongoose.Schema({
	filename : { type: String },
	contentType : { type: String },
	length : { type: Number },
	chunkSize : { type: Number },
	uploadDate : { type: Date },
	aliases : { type: mongoose.Schema.Types.Mixed },
	metadata : { type: mongoose.Schema.Types.Mixed },
	md5 : { type: String }
});

//static methods =================================================
fsfilesSchema.statics.findByMetadataSpaceId = function(spaceId, callback) {
	return this.find({ 'metadata.spaceId':spaceId }, callback);
};

exports.FSFile = mongoose.model('fs.files', fsfilesSchema);