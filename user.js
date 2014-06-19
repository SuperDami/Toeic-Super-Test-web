var data = require('./models/data.js');
var dm = require('./models/dataManager.js');
var dbModule = data.User;

var showColumnArray = ["username"];

exports.userList = function(req, res){
	res.render('testList.ejs', {category:"user", user:req.session.user});
}

exports.listData = function(req, res) {
	dm.listData(req, res, dbModule, showColumnArray);
}

exports.delete = function(req, res){
	dm.delete(req, res, dbModule);
};