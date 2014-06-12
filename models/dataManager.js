var module;

exports.setDBModule = function(_module) {
	module = _module;
};

exports.list = function(page, callback) {
	var perPage = 20;
	module.find(null, null, {skip:perPage*page, limit:perPage}, function(filterErr, list){
		module.count().exec(function(countErr, count){
			if (filterErr || countErr) {
				var err = filterErr || countErr;
				callback(null, err);
			}
			
			var pageCount = Math.ceil(count/perPage);

			callback({testList: list,
			 pageIndex: page,
			 pageCount: pageCount ? pageCount : 1,
			 prePage: (page > 0 && perPage*page < count),
			 nextPage: (perPage*page + perPage < count)},			 
			 null);
		});
	});
}

exports.post = function(elements, conditions, callback) {
	module.findOne(conditions, function(err, result){
		if (!result) {
			result = new module();
			console.log("create new test");
		}

		for (var key in elements) {
			result[key] = elements[key];
		};

		result.save(function(err){
			if (err) {
				console.log("post to DB error ", err);
			}
			callback(err);
		});
	});
};