var data = require('./models/data.js');
var dbModule = data.Ad;
var dm = require('./models/dataManager.js');

var editColumnArray = ["imageUrl", "linkUrl"];
var showColumnArray = ["last_update"];

exports.adList = function(req, res){
	res.render('testList.ejs', {category:"ad", admin:req.cookies.user, option:["add", "edit", "delete"]});
}

exports.listData = function(req, res) {
	dm.listData(req, res, dbModule, showColumnArray);
}

exports.edit = function(req, res) {
	dm.edit(req, res, dbModule, editColumnArray, "/ad")
}

exports.delete = function(req, res){
	dm.delete(req, res, dbModule);
};

exports.post = function(req, res){
	dm.post(req, res, dbModule);
};

exports.lastContent = function(callback){
	var option = {skip:0, limit:1, sort:{last_update: -1}};
	dbModule.find(null, null, option, function(error, results){
		if (error) {
			console.error("DB load header errror:", error);
		}
		callback(error, results);
	});
}