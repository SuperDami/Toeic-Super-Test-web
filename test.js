var data = require('./models/data.js');
var dm = require('./models/dataManager.js');
var dbModule = data.Test;

var basePath = "/test";

exports.testList = function(req, res){
	res.render('testList.ejs', {basePath: basePath});
}

exports.listData = function(req, res) {
	var page = req.param('page') > 0 ? Math.floor(req.param('page')) : 0;
	dm.list(dbModule, page, function(result, err){
		if (!err) {
			result["columnName"] = ["title", "testId", "price", "created_at", "productId", "published", "downloadCount"];
			res.send(result);
		}
	});
}

exports.edit = function(req, res){
	var _id = req.param('_id');
	dbModule.findOne({_id: _id} ,function(err, test){
		console.log("edit ", test);
		if (err) {
			console.log("edit err ",err);
			res.redirect(basePath);
		}
		else {
			res.render('edit.ejs', {test: test, editColumns:["testId", "title", "price", "coverImageUrl", "zipUrl", "productId", "published"], basePath: basePath});
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
	var item = req.body;
	dm.post(dbModule, item, function(err) {
		res.end(JSON.stringify({err:err, url:basePath}));
	});
};

exports.contentPage = function(req, res){
	var category = req.query.category;
	var page = req.query.page;
	var perPage = 12
  	  , page = page > 0 ? Math.floor(page) : 0;
  	var testIdArray = req.query.fetchedTestId.split(',');
	var productIdArray = req.query.purchasedTestId.split(',');

	console.log("productIdArray :",productIdArray);
	console.log("fetchedTestId :",testIdArray);

  	var condition = {"published":true};
  	var option;

	if (category === "myLibrary") {
		var published = {"published":true};
	  	var testWithPurchedAndFetched = { $or:[{"testId":{$in:testIdArray}}, {"productId":{$in:productIdArray}}] };
		condition = {$and:[published, testWithPurchedAndFetched]};
		option = {skip:perPage*page, limit:perPage}
	} else if (category === "popular") {
		option = {skip:perPage*page, limit:perPage, sort:{downloadCount: -1}};
	}

	dbModule.find(condition, null, option, function(filterErr, results){
		dbModule.find(condition).count().exec(function(countErr, count){
			if (filterErr || countErr) {
				res.send(filterErr || countErr);
			}
			else {
				var pageCount = Math.ceil(count/perPage);
				res.send({
					category: category,
					testList: results,
					pageIndex: (pageCount > page) ? page : (pageCount - 1),
					pageCount: pageCount ? pageCount : 1,
			 		prePage: (page > 0 && perPage*page < count),
			 		nextPage: (perPage*page + perPage < count)
				})
			}
		});
	});
};

exports.download = function(req, res){
	var test = JSON.parse(req.body.test);
	dbModule.findOne({testId: test.testId}, function(err, test){
		if (test.downloadCount) {
			test.downloadCount = test.downloadCount + 1;
		}
		else {
			test.downloadCount = 1;
		}
		test.save(function(err) {
			res.end(JSON.stringify({err:err, url:"/downloadTest"}));
		});
	});

	var url = 'com.alc.topic.supertest://' + "testId=" + encodeURIComponent(test.testId)
	 + '&title=' + encodeURIComponent(test.title)
	  + '&zipUrl=' + encodeURIComponent(test.zipUrl)
	   + '&coverImageUrl=' + encodeURIComponent(test.coverImageUrl);
	res.redirect(url);
}