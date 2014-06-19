var data = require('./models/data.js');
var dm = require('./models/dataManager.js');
var dbModule = data.News;

var showColumnArray = ["title", "created_at", "published"];
var editColumnArray = ["title", "author", "content", "published"];

exports.newsList = function(req, res){
	res.render('testList.ejs', {category:"news", user:req.session.user});
}

exports.listData = function(req, res) {
	dm.listData(req, res, dbModule, showColumnArray);
}

exports.edit = function(req, res) {
	dm.edit(req, res, dbModule, editColumnArray, "/news")
}

exports.delete = function(req, res){
	dm.delete(req, res, dbModule);
};

exports.post = function(req, res){
	dm.post(req, res, dbModule);
};

exports.lastContent = function(req, res){
	var condition = {published: true};
	var option = {skip:0, limit:8, sort:{created_at: -1}};
	dbModule.find(condition, null, option, function(filterErr, results){
		if (filterErr) {
			res.send(filterErr);
		}
		else {
			res.send(results);
		}
	});
}