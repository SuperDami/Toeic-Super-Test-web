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
        host: 'localhost',
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

app.get('/', loginCheck, routes.index);
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

app.get('/test/api/listData', testManage.listData);
app.get('/test', testManage.testList);
app.post('/test/post', testManage.postTest);
app.post('/test/delete', testManage.deleteTest);
app.get('/test/editPage', testManage.edit);
app.get('/test/contentPage', testManage.contentPage);
app.post('/test/download', testManage.download);

app.get('/news/api/listData', newsManage.listData);
app.get('/news', newsManage.newsList);
app.post('/news/post', newsManage.postNews);
app.post('/news/delete', newsManage.deleteNews);
app.get('/news/editPage', newsManage.edit);
app.get('/news/lastContent', newsManage.lastContent);

app.get('/user/api/listData', userManage.listData);
app.get('/user', userManage.userList);
app.post('/user/delete', userManage.deleteUser);

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