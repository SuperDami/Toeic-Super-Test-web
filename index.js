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
	var perPage = 12
  	  , page = req.param('page') > 0 ? Math.floor(req.param('page')) : 0;
	var model = data.Test;

	model.find(null, null, {skip:perPage*page, limit:perPage}, function(filterErr, tests){
		model.count().exec(function(countErr, count){
			if (filterErr || countErr) {
				res.send(filterErr || countErr);
			}
			else {
				var query = url.parse(req.url, true).query;
				if (query['fetchedTestId']) {
					var testIdArray = query['fetchedTestId'].split(',');
					for (var i = 0; i < testIdArray.length; i++) {
						testId = testIdArray[i];
						for (var j = 0; j < tests.length; j++) {
							var test = tests[j];
							if(testId === test["testId"]) {
								test['downloaded'] = true;
							}
						};
					};
				}
				var pageCount = Math.ceil(count/perPage);
				res.render('index.html', {testList: tests,
					pageIndex: page,
					pageCount: pageCount,
			 		prePage: (page > 0 && perPage*page < count),
			 		nextPage: (perPage*page + perPage < count)});
			}
		});
	});
});

app.get('/testList', function(req, res) {
	var perPage = 20
	  , page = req.param('page') > 0 ? Math.floor(req.param('page')) : 0;
	var model = data.Test;

	model.find(null, null, {skip:perPage*page, limit:perPage}, function(filterErr, tests){
		model.count().exec(function(countErr, count){
			if (filterErr || countErr) {
				res.end(JSON.stringify({err:filterErr || countErr, url:"/testList"}));
			}
			
			var pageCount = Math.ceil(count/perPage);

			res.render('testList.html', {testList: tests,
			 columnName:["title", "testId", "price", "created_at"],
			 pageIndex: page,
			 pageCount: pageCount,
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
	var testId = req.body.testId;
	var title = req.body.title;
	var coverImageUrl = req.body.coverImageUrl;
	var zipUrl = req.body.zipUrl;
	var price = req.body.price;

	if (testId.length) {
		Test.findOne({testId: testId}, function(err, test){
			if (!test) {
				var test = new Test();
				test.testId = testId;
				test.title = title;
				test.coverImageUrl = coverImageUrl;
				test.zipUrl = zipUrl;
				test.price = price;
				test.save(function(err) {
					res.end(JSON.stringify({err:err, url:"/testList"}));
				});
			}
			else {
				res.end(JSON.stringify({testId:"testId existed"}));
			}
		})
	}
	else {
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

	if (testId.length) {
		Test.findOne({testId: lastTestId}, function(err, test){
	
			test.testId = testId;
			test.title = title;
			test.coverImageUrl = coverImageUrl;
			test.zipUrl = zipUrl;
			test.price = price;
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

app.listen(process.env.PORT || 3000);