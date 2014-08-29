var express = require('express');
var url = require('url');
var app = express();

var testManage = require('./test.js');
var newsManage = require('./news.js');
var adminManage = require('./admin.js');
var routes = require('./routes.js');
var userDataManage = require('./userData.js');
var ad = require('./ad.js');

app.use(express.static('public'));
app.use(express.bodyParser());
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(express.cookieParser()); //追加
app.use(express.session({
    secret: 'secret',
    cookie: {
        httpOnly: false,
        maxAge: 60 * 60 * 1000 * 24 * 7
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
app.all('/admin', loginCheck);
app.all('/userData', loginCheck);
app.all('/ad', loginCheck);

app.all('/test/*', loginCheck);
app.all('/news/*', loginCheck);
app.all('/admin/*', loginCheck);
app.all('/userData/*', loginCheck);
app.all('/ad/*', loginCheck);

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

app.get('/admin', adminManage.adminList);
app.post('/admin/delete', adminManage.delete);
app.get('/admin/api/listData', adminManage.listData);

app.get('/userData', userDataManage.userDataList);
app.post('/userData/delete', userDataManage.delete);
app.get('/userData/api/listData', userDataManage.listData);

app.post('/postUserData', userDataManage.postUserData);
app.get('/lastNewsContent', newsManage.lastContent);
app.get('/testContentPage', testManage.contentPage);
app.post('/downloadTest', testManage.download);
app.get('/main', function(req, res) {
  ad.lastContent(function(error, ad){
    if (Array.isArray(ad)) {
      res.render('main.ejs', ad[0]);
    }
    else {
      res.render('main.ejs', null);
    }
  });
});
app.get('/productList', testManage.productList);

app.get('/ad', ad.adList);
app.post('/ad/post', ad.post);
app.post('/ad/delete', ad.delete);
app.get('/ad/editPage', ad.edit);
app.get('/ad/api/listData', ad.listData);

app.listen(process.env.PORT || 3000);