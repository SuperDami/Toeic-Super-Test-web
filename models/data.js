var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://dami:opener@oceanic.mongohq.com:10080/app24448078');

var Test = mongoose.Schema({
    testId: String,
    title: String,
    coverImageUrl: String,
    zipUrl: String,
    price: Number,    
    created_at: Date,
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