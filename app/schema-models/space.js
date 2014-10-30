var mongoose = require('mongoose');

var spaceSchema = new mongoose.Schema({
	title: { type: String }
});

exports.Space = mongoose.model('Space', spaceSchema);