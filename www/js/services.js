angular.module('tipzy.services', [])

.factory('tipzyConfigService', function ($rootScope) {
	var service = {};
	var db = tipzy.webdb.db;

	service.getConfig = function (success_callback) {
		$rootScope.config = [];

		if (db) {
			db.transaction(function (tx) {
				tx.executeSql("SELECT * FROM config;", [], function (t, r) {
					for (var i = 0; i < r.rows.length; i++) {
						var row = r.rows.item(i);
						var c = {};
						c.id = row.id;
						c.property = row.property;
						c.value = row.value;
						$rootScope.config.push(c);
					}
					if (success_callback)
						success_callback($rootScope.config);
				}, tipzy.webdb.onError);
			});
		}
	};

	service.setConfig = function (cfg, success_callback) {
		if (db) {
			db.transaction(function (tx) {
				for (var i = 0; i < cfg.length; i++) {
					tx.executeSql("UPDATE config SET property=?, value=? WHERE id = ?", [
							cfg[i].property, cfg[i].value, cfg[i].id],
						tipzy.webdb.onSuccess_updateConfig,
						tipzy.webdb.onError);
				}
				service.getConfig();
				if (success_callback)
					success_callback();
			});
		}
	};

	return service;
});
