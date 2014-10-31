// Space Routes =================================================
var Space = require('../application/schema-models/sm_space').Space;
var spaceService = require('../application/spaceService.js');

exports.list = function(req, res) {
	if(req.params.space_id) {
		Space.findBySpaceId(req.params.space_id, function (err, data) {
			res.render('space', { 
				space: data,
				title: 'temp-space'
			});
		});
	}
};

exports.add = function(req, res) {
	if(req.body.space_id != null) {
		var obj = new Space({
			space_id: req.body.space_id,
			items: [],
			createdAt: new Date()
		});

		obj.save(function(err, data) {
			if (err) return console.error(err);
		});	
	}
	
	res.redirect('/space/'+req.body.space_id);
}