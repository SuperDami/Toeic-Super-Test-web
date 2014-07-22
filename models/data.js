var mongoose = require('mongoose');
var db = mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/test');

var Test = mongoose.Schema({
    testId: String,
    title: String,
    coverImageUrl: String,
    zipUrl: String,
    price: Number,    
    created_at: Date,
    productId: String,
    published: Boolean,
    downloadCount: Number
});

var AnsweredQuestion = mongoose.Schema({
    ZID: Number,
    ZTEST_ID: String,
    ZPART_ID: Number,
    ZTOPIC_ID: Number,
    ZQUESTION_ID: Number,
    USETIME: Number,
    IS_RIGHT: Boolean,
    DATE: String,
    ANSWER: String,
    ZIS_MAGIC: Boolean,
    DEVICE_ID: String,
    USER_ID: String,
});

var News = mongoose.Schema({
    title: String,
    content: String,
    created_at: String,
    author: String,
    published: Boolean
});

var UserSchema = mongoose.Schema({
    username: String,
    password: String
});

var Ad = mongoose.Schema({
    imageUrl: String,
    linkUrl: String,
    published: Boolean,
    last_update: String,
});

Test.pre('save', function(next){
	if (this.isNew) {
		this.created_at = new Date();
	};
    this.price = this.price || 0;
    this.downloadCount = this.downloadCount || 0;
    next();
});

News.pre('save', function(next) {
    if (this.isNew) {
        this.created_at = new Date();
    };
    next();
})

Ad.pre('save', function(next){
    this.last_update = new Date();
    next();    
})

module.exports.Test = db.model('Test', Test);
module.exports.News = db.model('News', News);
module.exports.AnsweredQuestion = db.model('AnsweredQuestion', AnsweredQuestion);
module.exports.User = db.model('User', UserSchema);
module.exports.Ad = db.model('Ad', Ad);