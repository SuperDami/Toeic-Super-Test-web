var data = require('./models/data.js');
var dm = require('./models/dataManager.js');
var dbModule = data.Test;

var showColumnArray = ["title", "testId", "price", "created_at", "productId", "published", "downloadCount"];
var editColumnArray = ["testId", "title", "price", "coverImageUrl", "zipUrl", "productId", "published"];

exports.testList = function(req, res){
	res.render('testList.ejs', {category:"test", admin:req.cookies.user, option:["add", "edit", "delete"]});
}

exports.listData = function(req, res) {
	dm.listData(req, res, dbModule, showColumnArray);
}

exports.edit = function(req, res) {
	dm.edit(req, res, dbModule, editColumnArray, "/test");
}

exports.delete = function(req, res){
	dm.delete(req, res, dbModule);
};

exports.post = function(req, res){
	dm.post(req, res, dbModule);
};

exports.contentPage = function(req, res){
	var category = req.query.category;
	var page = req.query.page;
	var perPage = 12
  	  , page = page > 0 ? Math.floor(page) : 0;
  	var testIdArray = req.query.fetchedTestId.split(',');
	var productIdArray = req.query.purchasedTestId.split(',');

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

	console.log("DB load home page content at page: ", page);
	dbModule.find(condition, null, option, function(filterErr, results){
		if (filterErr) {
			console.error("DB load home page content: ", filterErr);
		}
		dbModule.find(condition).count().exec(function(countErr, count){
			if (filterErr || countErr) {
				res.send(filterErr || countErr);
				console.error("DB load home page content count: ", countErr);
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

exports.productList = function(req, res){
	var page = req.query.page;
	var perPage = 12
  	  , page = page > 0 ? Math.floor(page) : 0;

  	var condition = {"published":true};
  	var option = {skip:perPage*page, limit:perPage, sort:{downloadCount: -1}};

	console.log('Load published product id list at page :', page);
	dbModule.find(condition, null, option, function(error, results){
		if (error) {
			console.error("Load problish product id list error: ", error);
			res.send(error);
		}
		else {
			var array = new Array();
			for(var i in results) {
				var productId = results[i]['productId'];
				array.push(productId);
			}
			res.send(array);
			return;
		}
	});
};

exports.download = function(req, res){
	var test = JSON.parse(req.body.test);

	console.log("download product counter: ", test.productId);
	dbModule.findOne({testId: test.testId}, function(error, test){
		if (error) {
			console.error("DB find download product error:", error);
		}
		if (test.downloadCount) {
			test.downloadCount = test.downloadCount + 1;
		}
		else {
			test.downloadCount = 1;
		}
		test.save(function(err) {
			if (err) {
				console.error("DB save download count error:", err);
			}
			res.end(JSON.stringify({err:err, url:"/downloadTest"}));
		});
	});

	var url = 'com.alc.topic.supertest://' + "testId=" + encodeURIComponent(test.testId)
	 + '&title=' + encodeURIComponent(test.title)
	  + '&zipUrl=' + encodeURIComponent(test.zipUrl)
	   + '&coverImageUrl=' + encodeURIComponent(test.coverImageUrl);
	res.redirect(url);
}