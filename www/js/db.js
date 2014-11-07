var tipzy = {};
tipzy.webdb = {};
tipzy.webdb.db = null;


var config = [
	{
		"property": "currency",
		"value": "$"
	},
	{
		"property": "rating_1_tip",
		"value": "0.0"
	},
	{
		"property": "rating_2_tip",
		"value": "0.10"
	},
	{
		"property": "rating_3_tip",
		"value": "0.12"
	},
	{
		"property": "rating_4_tip",
		"value": "0.15"
	}
	];

tipzy.webdb.open = function () {
	var dbSize = 1 * 1024 * 1024; // 1MB
	if (!tipzy.webdb.db) {
		tipzy.webdb.db = openDatabase("tipzydata", "", "Tipzy Data Cache", dbSize);
		tipzy.webdb.prepare(tipzy.webdb.db);
	}
}

tipzy.webdb.prepare = function (db) {
	db.transaction(function (tx) {
		tx.executeSql(
			"CREATE TABLE IF NOT EXISTS config(id INTEGER PRIMARY KEY ASC, property TEXT, value TEXT)", [],
			function (tx, r) {
				if (r.insertId == 1) {
					tipzy.webdb.loadDefaultConfig(db);
				}
			});
	});
}

tipzy.webdb.loadDefaultConfig = function (db) {
	db.transaction(function (tx) {
		for (var i = 0; i < config.length; i++) {
			tx.executeSql("INSERT INTO config(property, value) VALUES (?, ?)", [
				config[i].property, config[i].value],
				tipzy.webdb.onSuccess_loadDefaultConfig,
				tipzy.webdb.onError);
		}
		//tipzy.webdb.getConfig();
	});
};

tipzy.webdb.changeVersion = function (cversion, nversion) {
	tipzy.webdb.db.changeVersion(cversion, nversion, function (t) {
		console.log('Tipzy DB version changed from ' + cversion + ' to ' +
			nversion + '.')
	});
};

tipzy.webdb.onError = function (tx, e) {
	console.log("There has been an error: " + e.message);
};

tipzy.webdb.onSuccess_loadDefaultConfig = function (tx, r) {
	if (r.insertId >= config.length) {
		console.log('Tipzy DB created and loaded.');
	}
};

tipzy.webdb.onSuccess_updateConfig = function () {
	console.log('Tipzy DB updated.');
};
