var express = require('express');
var url = require('url');
var app = express();
var data = require('./models/data.js');
var Test = data.Test;
var Question = data.AnsweredQuestion;
var MongoStore = require('connect-mongo')(express);


var testManage = require('./test.js');
var newsManage = require('./news.js');
var userManage = require('./user.js');
var routes = require('./routes.js');

app.use(express.static('public'));
app.use(express.bodyParser());
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(express.cookieParser()); //追加
app.use(express.session({
    secret: 'secret',
    store: new MongoStore({
        db: 'session',
        host: process.env.MONGO_URL || 'localhost',
        clear_interval: 60 * 60
    }),
    cookie: {
        httpOnly: false,
        maxAge: new Date(Date.now() + 60 * 60 * 1000)
    }
}));

var loginCheck = function(req, res, next) {
    if(req.session.user){
      next();
    }else{
      res.redirect('/login');
    }
};

app.all('/test', loginCheck);
app.all('/news', loginCheck);
app.all('/user', loginCheck);
app.all('/test/*', loginCheck);
app.all('/news/*', loginCheck);
app.all('/user/*', loginCheck);

app.get('/', loginCheck, testManage.testList);
app.get('/signin', routes.signin);
app.post('/signup', routes.signup);

app.get('/login', function(req, res){
  res.render('login.ejs');
});
app.get('/logout', function(req, res){
  req.session.destroy();
  console.log('deleted sesstion');
  res.redirect('/');
});

app.get('/test', testManage.testList);
app.post('/test/post', testManage.post);
app.post('/test/delete', testManage.delete);
app.get('/test/editPage', testManage.edit);
app.get('/test/api/listData', testManage.listData);

app.get('/news', newsManage.newsList);
app.post('/news/post', newsManage.post);
app.post('/news/delete', newsManage.delete);
app.get('/news/editPage', newsManage.edit);
app.get('/news/api/listData', newsManage.listData);

app.get('/user', userManage.userList);
app.post('/user/delete', userManage.delete);
app.get('/user/api/listData', userManage.listData);

app.get('/lastNewsContent', newsManage.lastContent);
app.get('/testContentPage', testManage.contentPage);
app.post('/downloadTest', testManage.download);
app.get('/main', function(req, res) {
	res.render('main.ejs');
});

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