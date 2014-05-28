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

Test.pre('save', function(next){
	if (this.isNew) {
		this.created_at = new Date();
	};
    next();
});

AnsweredQuestion.pre('save', function(next) {
    next();
});

mongoose.model('Test', Test);
mongoose.model('AnsweredQuestion', AnsweredQuestion);

module.exports.Test = db.model('Test');
module.exports.AnsweredQuestion = db.model('AnsweredQuestion');