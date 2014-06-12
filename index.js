var express = require('express');
var url = require('url');
var app = express();
var data = require('./models/data.js');
var Test = data.Test;
var Question = data.AnsweredQuestion;

var testManage = require('./test.js');
var newsManage = require('./news.js');

app.use(express.static('public'));
app.use(express.bodyParser());
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.get('/test/api/listData', testManage.listData);
app.get('/test', testManage.testList);
app.post('/test/post', testManage.postTest);
app.post('/test/delete', testManage.deleteTest);
app.get('/test/editPage', testManage.add);

app.get('/news/api/listData', newsManage.listData);
app.get('/news', newsManage.newsList);
app.post('/news/post', newsManage.postNews);
app.post('/news/delete', newsManage.deleteNews);
app.get('/news/editPage', newsManage.add);

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

app.post('/postUserData', function(req, res) {
	var deviceId = req.body.deviceId;
	var userDataArray = req.body.userData;
	for (var i = 0; i < userDataArray.length; i++) {
		var data = userDataArray[i];
		var question = new Question();
		for (var key in data) {
			question[key] = data[key];
		};
		question["deviceId"] = deviceId;
		console.log(question);
		question.save(function(err) {
			res.end(JSON.stringify({err:err}));
		});
	};

	res.end();
})

app.listen(process.env.PORT || 3000);