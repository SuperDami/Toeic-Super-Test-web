var data = require('./models/data.js');
var dbModule = data.AnsweredQuestion;
var dm = require('./models/dataManager.js');

var showColumnArray = ["ZMODE", "ZTITLE", "USER_ID", "ZTEST_ID", "ZPART_ID", "ZQUESTION_ID", "USETIME", "IS_RIGHT", "ZIS_MAGIC", "ANSWER", "DATE"];

exports.userDataList = function(req, res){
	res.render('testList.ejs', {category:"userData", admin:req.cookies.user, option:["delete"]});
}

exports.listData = function(req, res) {
	dm.listData(req, res, dbModule, showColumnArray);
}

exports.delete = function(req, res){
	dm.delete(req, res, dbModule);
};

exports.postUserData = function(req, res) {
	var deviceId = req.body.deviceId;
	var userDataArray = req.body.userData;
	console.log("post data by deviceId: ", deviceId);
	for (var i = 0; i < userDataArray.length; i++) {
		var data = userDataArray[i];
		var question = new dbModule();
		for (var key in data) {
			question[key] = data[key];
		};
		question.save(function(err) {
			if (err) {
				console.error("post user data error: ", err);
			}
		});
	};

	res.end();
}