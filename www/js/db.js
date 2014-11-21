var tipzy = {};
tipzy.webdb = {};
tipzy.webdb.db = null;


var config = [
	{
		"property": "currency",
		"label": "Currency",
		"category": "i18n",
		"value": "$"
	},
	{
		"property": "rating_1_tip",
		"label": "Tip Rate 1",
		"category": "slab",
		"value": "12"
	},
	{
		"property": "rating_2_tip",
		"label": "Tip Rate 2",
		"category": "slab",
		"value": "15"
	},
	{
		"property": "rating_3_tip",
		"label": "Tip Rate 3",
		"category": "slab",
		"value": "20"
	},
	{
		"property": "rating_4_tip",
		"label": "Tip Rate 4",
		"category": "slab",
		"value": "25"
	},
	{
		"property": "selected_tip",
		"label": "Default Tip",
		"category": "defaults",
		"value": "12"
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
			"CREATE TABLE IF NOT EXISTS config(id INTEGER PRIMARY KEY ASC, category TEXT, property TEXT, value TEXT, label TEXT)", [],
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
			var cfg = config[i];
			tx.executeSql(
				"INSERT INTO config(category, property, value, label) VALUES (?, ?, ?, ?)", [
				cfg.category, cfg.property, cfg.value, cfg.label],
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
