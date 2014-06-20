var data = require('./models/data.js');
var dbModule = data.AnsweredQuestion;
var dm = require('./models/dataManager.js');

var showColumnArray = ["DEVICE_ID", "ZTEST_ID", "ZPART_ID", "ZQUESTION_ID", "USETIME", "IS_RIGHT", "ANSWER", "DATE", "ZIS_MAGIC"];

exports.userDataList = function(req, res){
	res.render('testList.ejs', {category:"userData", admin:req.session.user});
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
	for (var i = 0; i < userDataArray.length; i++) {
		var data = userDataArray[i];
		var question = new dbModule();
		for (var key in data) {
			question[key] = data[key];
		};
		question["DEVICE_ID"] = deviceId;
		console.log(question);
		question.save(function(err) {
			res.end(JSON.stringify({err:err}));
		});
	};

	res.end();
}