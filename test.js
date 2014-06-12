var data = require('./models/data.js');
var dm = require('./models/dataManager.js');
var dbModule = data.Test;

var basePath = "/test";

exports.testList = function(req, res){
	res.render('testList.html', {basePath: basePath});
}

exports.listData = function(req, res) {
	var page = req.param('page') > 0 ? Math.floor(req.param('page')) : 0;
	dm.list(dbModule, page, function(result, err){
		if (!err) {
			result["columnName"] = ["title", "testId", "price", "created_at", "productId", "published", "downloadCount"];
			result["selectColumn"] = "title";
			res.send(result);
		}
	});
}

exports.add = function(req, res){
	var _id = req.param('_id');
	dbModule.findOne({_id: _id} ,function(err, test){
		console.log("edit ", test);
		if (err) {
			console.log("edit err ",err);
			res.redirect(basePath);
		}
		else {
			res.render('edit.html', {test: test, editColumns:["testId", "title", "price", "coverImageUrl", "zipUrl", "productId", "published"], basePath: basePath});
		}
	});
};

exports.deleteTest = function(req, res){
	var _id = req.body._id;
	dbModule.findOne({_id: _id}).remove(function(err){
		console.log("delete " + _id);
		if (err) {
			console.log("delete err ",err);
		}
		res.end();
	});
};

exports.postTest = function(req, res){
	var test = req.body;
	if (test.hasOwnProperty("_id")) {
		dm.post(dbModule, test, {_id: test._id}, function(err) {
			res.end(JSON.stringify({err:err, url:basePath}));
		});
	}
	else {
		dm.post(dbModule, test, {_id: ""}, function(err) {
			res.end(JSON.stringify({err:err, url:basePath}));
		});
	}
};