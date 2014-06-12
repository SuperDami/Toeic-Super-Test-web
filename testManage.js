var data = require('./models/data.js');
var dm = require('./models/dataManager.js');
var Test = data.Test;

dm.setDBModule(Test);

exports.showList = function(req, res){
	res.render('testList.html');
}

exports.list = function(req, res) {
	var page = req.param('page') > 0 ? Math.floor(req.param('page')) : 0;
	dm.list(page, function(result, err){
		if (!err) {
			result["columnName"] = ["title", "testId", "price", "created_at", "productId", "published", "downloadCount"];
			result["selectColumn"] = "title";
			res.send(result);
		}
	});
}

exports.add = function(req, res){
	var _id = req.param('_id');
	Test.findOne({_id: _id} ,function(err, test){
		console.log("edit ", test);
		if (err) {
			console.log("edit err ",err);
			res.redirect('/showList');
		}
		else {
			res.render('addTest.html', {test: test, editColumns:["testId", "title", "price", "coverImageUrl", "zipUrl", "productId", "published"]});
		}
	});
};

exports.deletePost = function(req, res){
	var _id = req.body._id;
	Test.findOne({_id: _id}).remove(function(err){
		console.log("delete " + _id);
		if (err) {
			console.log("delete err ",err);
		}
		res.end();
	});
};

exports.post = function(req, res){
	var test = req.body;
	if (test.hasOwnProperty("_id")) {
		dm.post(test, {_id: test._id}, function(err) {
			res.end(JSON.stringify({err:err, url:"/showList"}));
		});
	}
	else {
		dm.post(test, {_id: ""}, function(err) {
			res.end(JSON.stringify({err:err, url:"/showList"}));
		});
	}
};