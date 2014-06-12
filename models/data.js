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
    zId: Number,
    partId: Number,
    testId: String,
    questionId: Number,
    topicId: Number,
    answer: String,
    isRight: Boolean,
    date: String,
    deviceId: String
});

var News = mongoose.Schema({
    title: String,
    content: String,
    created_at: String,
    author: String,
    published: Boolean
})

Test.pre('save', function(next){
	if (this.isNew) {
		this.created_at = new Date();
	};
    this.price = this.price || 0;
    this.downloadCount = this.downloadCount || 0;

    console.log("save ",this);
    next();
});

AnsweredQuestion.pre('save', function(next) {
    next();
});

News.pre('save', function(next) {
    if (this.isNew) {
        this.created_at = new Date();
    };
    next();
})

mongoose.model('Test', Test);
mongoose.model('AnsweredQuestion', AnsweredQuestion);
mongoose.model('News', News);

module.exports.Test = db.model('Test');
module.exports.News = db.model('News');
module.exports.AnsweredQuestion = db.model('AnsweredQuestion');
