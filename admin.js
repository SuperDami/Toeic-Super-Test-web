var data = require('./models/data.js');
var dm = require('./models/dataManager.js');
var dbModule = data.User;

var showColumnArray = ["username"];

exports.adminList = function(req, res){
	res.render('testList.ejs', {category:"admin", admin:req.cookies.user, option:["delete"]});
}

exports.listData = function(req, res) {
	dm.listData(req, res, dbModule, showColumnArray);
}

exports.delete = function(req, res){
	dm.delete(req, res, dbModule);
};