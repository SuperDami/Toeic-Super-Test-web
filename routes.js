var data = require('./models/data.js');
    User  = data.User;
var md5 = require('MD5');
var encryptPart = "serge5Y$%YHYJZEARG%HB"

function encryptPassword(password) {
    return md5(md5(password) + encryptPart);
}
/*ユーザー登録機能*/
exports.signup = function(req, res){
    console.log("sign up ", req.body);
    var username = req.body.username;
    req.body.password = encryptPassword(req.body.password);

    User.find({username:username}).count().exec(function(countErr, count){
        var url;
        var message;
        if (count) {
            message = "user existed";
            res.send({message:message});
        }
        else {
            var newUser = new User(req.body);
            newUser.save(function(err){
                console.log("sign up check",err);
                if(err){
                    message = err;
                }else{
                    message = "sign up successful"
                    req.session.user = username;
                    url = "/test";
                }
                console.log(message);
                res.send({url:url, message:message});
            });
        }
    });
};

/*ログイン機能*/
exports.signin = function(req, res) {
    console.log("login", req.query);
    var username = req.query.username;
    var password = encryptPassword(req.query.password);
    var query = { "username": username, "password": password };
    User.find(query, function(err, data){
        if(err){
            console.log(err);
        }

        var message = null;
        var url = null;
        if(data == ""){
            message = "sign in failed"
        }else{
            req.session.user = username;            
            url = "/test";
            message = "sign in successful"
        }

        console.log(message);
        res.send({url:url, message:message});
    });
}