var data = require('./models/data.js');
var Test = data.Test;

exports.testList = function(req, res){
	var perPage = 20
	  , page = req.param('page') > 0 ? Math.floor(req.param('page')) : 0;

	Test.find(null, null, {skip:perPage*page, limit:perPage}, function(filterErr, tests){
		Test.count().exec(function(countErr, count){
			if (filterErr || countErr) {
				res.end(JSON.stringify({err:filterErr || countErr, url:"/testList"}));
			}
			
			var pageCount = Math.ceil(count/perPage);

			res.render('testList.html', {testList: tests,
			 columnName:["title", "testId", "price", "created_at", "productId", "published", "downloadCount"],
			 pageIndex: page,
			 pageCount: pageCount ? pageCount : 1,
			 prePage: (page > 0 && perPage*page < count),
			 nextPage: (perPage*page + perPage < count)});
		});
	});
};

exports.add = function(req, res){
	var testId = req.param('testId');
	console.log(testId);
	Test.findOne({testId: testId} ,function(err, test){
		console.log("edit : ", test);
		res.render('addTest.html', {test: test});
	})
};

exports.post = function(req, res){
	console.log(req.body);
	var testId = req.body.testId;
	var title = req.body.title;
	var coverImageUrl = req.body.coverImageUrl;
	var zipUrl = req.body.zipUrl;
	var price = req.body.price;
	var published = req.body.published || false;
	var productId = req.body.productId;

	console.log("post new test id", testId);
	if (testId.length) {
		Test.findOne({testId: testId}, function(err, test){
			if (!test) {
				var test = new Test();
				test.testId = testId;
				test.title = title;
				test.coverImageUrl = coverImageUrl;
				test.zipUrl = zipUrl;
				test.price = price;
				test.published = published;
				test.productId = productId;
				test.downloadCount = 0;
				test.save(function(err) {
					if (err) {
						console.log("save new test err:", err);
					}
					res.end(JSON.stringify({err:err, url:"/testList"}));
				});
			}
			else {
				console.log("testId existed");
				res.end(JSON.stringify({testId:"testId existed"}));
			}
		})
	}
	else {
		console.log("testId can not be nil");
		res.end(JSON.stringify({testId:"testId can not be nil"}));
	}
};

exports.update = function(req, res){
	var testId = req.body.testId;
	var lastTestId = req.body.lastTestId;
	var title = req.body.title;
	var coverImageUrl = req.body.coverImageUrl;
	var zipUrl = req.body.zipUrl;
	var price = req.body.price;
	var published = req.body.published || false;
	var productId = req.body.productId;

	if (testId.length) {
		Test.findOne({testId: lastTestId}, function(err, test){
	
			test.testId = testId;
			test.title = title;
			test.coverImageUrl = coverImageUrl;
			test.zipUrl = zipUrl;
			test.price = price;
			test.published = published;
			test.productId = productId;
			test.save(function(err) {
				res.end(JSON.stringify({err:err, url:"/testList"}));
			});
		})
	}
	else {
		res.end(JSON.stringify({testId:"testId can not be nil"}));
	}
};

exports.deletePost = function(req, res){
	var testId = req.body.testId;
	Test.findOne({testId: testId}).remove(function(err){
		if (!err) {
			console.log("delete testId : " + testId);
			res.redirect('/testList');
		}
	});
};
