angular.module('tipzy.services', [])

.factory('tipzyConfigService', function ($rootScope) {
	return {
		getConfig: function (success_callback) {
			$rootScope.config = [];

			var db = tipzy.webdb.db;

			if($rootScope.config.length > 0){
				success_callback($rootScope.config);
			}else{
				if(db){
					db.transaction(function (tx) {
						tx.executeSql("SELECT * FROM config;", [], function (t, r) {
							for (var i = 0; i < r.rows.length; i++) {
								var row = r.rows.item(i);
								var c = {};
									c.property = row.property;
									c.value = row.value;
								$rootScope.config.push(c);
							}
							success_callback($rootScope.config);
						}, tipzy.webdb.onError);
					});
				}
			}
		}
	};
});
