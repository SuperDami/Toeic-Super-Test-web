var data = require('./models/data.js');
var dm = require('./models/dataManager.js');
var dbModule = data.User;

var basePath = "/user";

exports.userList = function(req, res){
	res.render('testList.ejs', {basePath: basePath});
}

exports.listData = function(req, res) {
	var page = req.param('page') > 0 ? Math.floor(req.param('page')) : 0;
	dm.list(dbModule, page, function(result, err){
		if (!err) {
			result["columnName"] = ["username"];
			res.send(result);
		}
	});
}

exports.deleteUser = function(req, res){
	var _id = req.body._id;
	dbModule.findOne({_id: _id}).remove(function(err){
		console.log("delete " + _id);
		if (err) {
			console.log("delete err ",err);
		}
		res.end();
	});
};