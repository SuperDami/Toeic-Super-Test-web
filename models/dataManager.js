function loadList(module, page, callback) {
	var perPage = 20;
	module.find(null, null, {skip:perPage*page, limit:perPage}, function(filterErr, list){
		if (filterErr) {
			console.error("DB load list error: ", filterErr);
		}
		module.count().exec(function(countErr, count){
			if (filterErr || countErr) {
				var err = filterErr || countErr;
				console.error("DB load count error: ", countErr);
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

function saveItem(module, elements, callback) {
	var conditions = {_id: ""};
	if (elements.hasOwnProperty("_id")) {
		var conditions = {_id: elements._id};
	}

	module.findOne(conditions, function(err, result){
		if (err) {
			console.error("DB find item error: ", err);
		}

		if (!result) {
			result = new module();
			console.log("create new item");
		}

		for (var key in elements) {
			result[key] = elements[key];
		};

		result.save(function(err){
			if (err) {
				console.error("Save item to DB error: ", err);
			}
			callback(err);
		});
	});
};

exports.listData = function(req, res, dbModule, columnNameArray) {
	var page = req.param('page') > 0 ? Math.floor(req.param('page')) : 0;
	loadList(dbModule, page, function(result, err){
		if (err) {
			res.send(404);
		}
		else {
			result["columnName"] = columnNameArray;
			res.send(result);
		}
	});
}

exports.edit = function(req, res, dbModule, columnNameArray, basePath) {
	var _id = req.param('_id');
	dbModule.findOne({_id: _id} ,function(err, item){
		console.log("edit item :", _id);
		if (err) {
			console.error("find item to edit err: ",err);
			res.redirect(basePath);
		}
		else {
			res.render('edit.ejs', {test: item, editColumns:columnNameArray, basePath: basePath});
		}
	});
}

exports.delete = function(req, res, dbModule){
	var _id = req.body._id;
	dbModule.findOne({_id: _id}).remove(function(err){
		console.log("delete " + _id);
		if (err) {
			console.error("delete item error: ",err);
		}
		res.end();
	});
};

exports.post = function(req, res, dbModule){
	saveItem(dbModule, req.body, function(err) {
		res.end(JSON.stringify({err:err}));
	});
};