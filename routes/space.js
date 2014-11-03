// Space Routes =================================================
var Space = require('../application/schema-models/sm_space').Space;
var spaceService = require('../application/spaceService.js');

exports.list = function(req, res) {
	if(req.params.spaceId) {
		Space.findBySpaceId(req.params.spaceId, function (err, data) {
			res.render('space', { 
				space: data,
				spaceId: req.params.spaceId,
				title: 'temp-space'
			});
		});
	}
};

exports.add = function(req, res) {
	if(req.body.spaceId != null) {
		var obj = new Space({
			spaceId: req.body.spaceId,
			createdAt: new Date()
		});

		obj.save(function(err, data) {
			if (err) return console.error(err);
		});	
	}
	
	res.redirect('/space/'+req.body.spaceId);
}