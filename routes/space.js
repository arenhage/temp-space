
/*
 * GET home page.
 */
var Space = require('../application/schema-models/sm_space').Space;

exports.list = function(req, res) {
	if(req.params.identifier) {
		Space.findOne({'identifier':req.params.identifier}, function (err, data) {
			res.render('space', { 
				space: data
			});
		});
	}
};

exports.add = function(req, res) {
	req.params.identifier = req.query.identifier;
	
	if(req.params.identifier != null) {
		var obj = new Space({
			identifier: req.params.identifier,
			items: [],
			createdAt: new Date()
		});

		obj.save(function(err, data) {
			if (err) return console.error(err);
		});	
	}
	
	res.redirect('/space/list/'+req.params.identifier);
}