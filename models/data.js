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

Test.pre('save', function(next){
	if (this.isNew) {
		this.created_at = new Date();
	};
    next();
});

mongoose.model('Test', Test);
module.exports.Test = db.model('Test');