
/*
 * GET home page.
 */
var spaceFactory = require('../app/schema-models/space');

exports.list = function(req, res){
	var obj = new spaceFactory.Space({
		title: 'Thor'
	});

	obj.save(function(err, data) {
		if (err) return console.error(err);
		console.dir(data);
	});
	
	res.send('response');
};