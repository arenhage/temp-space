// Index Routes =================================================
var logger = require('log4js').getLogger();

exports.index = function(req, res){
	res.render('index', { 
		title: 'temp-space',
		err: null
	});
};