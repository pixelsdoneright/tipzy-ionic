var tipzy = {};
	tipzy.webdb = {};
	tipzy.webdb.db = null;


var config = [
		{"property": "currency_pattern", "value": "$"},
		{"property": "currency_country", "value": "USA"},
		{"property": "rating_1_label", "value": "Shitty"},
		{"property": "rating_1_tip", "value": "0.0"},
		{"property": "rating_2_label", "value": "Whatevz"},
		{"property": "rating_2_tip", "value": "0.10"},
		{"property": "rating_3_label", "value": "Kewl"},
		{"property": "rating_3_tip", "value": "0.12"},
		{"property": "rating_4_label", "value": "Awezome!"},
		{"property": "rating_4_tip", "value": "0.15"}
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
		tx.executeSql("CREATE TABLE IF NOT EXISTS config(id INTEGER PRIMARY KEY ASC, property TEXT, value TEXT)", [], function(tx, r){
			if(r.insertId == 1){
				tipzy.webdb.loadDefaultConfig(db);
			}
		});
	});
}

tipzy.webdb.loadDefaultConfig = function (db) {
	db.transaction(function (tx) {
		for(var i=0; i < config.length; i++){
			tx.executeSql("INSERT INTO config(property, value) VALUES (?, ?)", [
				config[i].property, config[i].value],
				tipzy.webdb.onSuccess_loadDefaultConfig,
				tipzy.webdb.onError);
		}
		//tipzy.webdb.getConfig();
	});
};

tipzy.webdb.changeVersion = function(cversion, nversion){
	tipzy.webdb.db.changeVersion(cversion, nversion, function(t){
		console.log('Tipzy DB version changed from ' + cversion + ' to ' + nversion + '.')
	});
};

tipzy.webdb.onError = function (tx, e) {
	console.log("There has been an error: " + e.message);
};

tipzy.webdb.onSuccess_loadDefaultConfig = function (tx, r) {
	if(r.insertId >= config.length){
		console.log('Tipzy DB created and loaded.');
	}
	// re-render the data.
	//tipzy.webdb.getAllTodoItems(loadTodoItems);
};

// var uc = function(){
//     abc = currency;
//     abc[0].value = 'Rs';
//     abc[2].value = 'India';
//     tipzy.webdb.updateConfig(abc);
// }

// var updateConfig = function(cfg) {

//     var db = $rootScope.webdb.db;
//         db.transaction(function(tx) {
//             for (var i=0; i < cfg.length; i++) {
//                 tx.executeSql("UPDATE config SET property=?, value=? WHERE id = ?",
//                 [cfg[i].property, cfg[i].value, cfg[i].id],
//                 $rootScope.webdb.onSuccess,
//                 $rootScope.webdb.onError);
//             }
//         });
// };
