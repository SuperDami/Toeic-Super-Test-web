var express = require('express');
var url = require('url');
var app = express();
var data = require('./models/data.js');
var Test = data.Test;

app.use(express.static('public'));
app.use(express.bodyParser());
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.get('/', function(req, res) {
	res.render('index.html');
});

app.get('/contentOnly', function(req, res){
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

	Test.find(condition, null, option, function(filterErr, results){
		Test.find(condition).count().exec(function(countErr, count){
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
})

app.get('/testList', function(req, res) {
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
});

app.get('/addTest', function(req, res) {
	var query = url.parse(req.url, true).query;
	var testId = query['testId'];
	console.log(testId);
	Test.findOne({testId: testId} ,function(err, test){
		console.log("edit : ", test);
		res.render('addTest.html', {test: test});
	})
});

app.post('/postNewTest', function(req, res) {
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
})

app.post('/updateTest', function(req, res) {
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
})

app.post('/deletePost', function(req, res){
	var testId = req.body.testId;
	Test.findOne({testId: testId}).remove(function(err){
		if (!err) {
			console.log("delete testId : " + testId);
			res.redirect('/testList');
		}
	});
})

app.post('/downloadTest', function(req, res){
	var test = JSON.parse(req.body.test);
	Test.findOne({testId: test.testId}, function(err, test){
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
})
app.listen(process.env.PORT || 3000);