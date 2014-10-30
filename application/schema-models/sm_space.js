var mongoose = require('mongoose');

var spaceSchema = new mongoose.Schema({
	identifier : { type: String },
	items: { type: Array },
	createdAt: { type: Date }
});

exports.Space = mongoose.model('Space', spaceSchema);