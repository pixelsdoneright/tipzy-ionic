angular.module('tipzy.controllers', [])

.controller('tipzyAppCtrl', function ($scope, $ionicModal, $timeout) {
	// Form data for the login modal
	$scope.loginData = {};

	// Create the login modal that we will use later
	$ionicModal.fromTemplateUrl('templates/login.html', {
		scope: $scope
	}).then(function (modal) {
		$scope.modal = modal;
	});

	// Triggered in the login modal to close it
	$scope.closeLogin = function () {
		$scope.modal.hide();
	};

	// Open the login modal
	$scope.login = function () {
		$scope.modal.show();
	};

	// Perform the login action when the user submits the login form
	$scope.doLogin = function () {
		console.log('Doing login', $scope.loginData);

		// Simulate a login delay. Remove this and replace with your login
		// code if using a login system
		$timeout(function () {
			$scope.closeLogin();
		}, 1000);
	};
})

.controller('calculateController', function ($scope, $timeout,
	tipzyConfigService) {

	$scope.tipzy = {
		'currency': '$',
		"tipSlabs": [],
		'billedAmount': "0.00",
		'tipRate': 0.15,
		'payable': 0.0,
		'tip': 0.0,
		'payablePerPerson': 0.0,
		'tipPerPerson': 0.0,
		'people': 1
	};

	$timeout(function () {
		tipzyConfigService.getConfig(function (data) {
			$scope.$apply(function () {

				for (var i = 0; i < data.length; i++) {
					var cfg = data[i];
					if (cfg.property == 'currency') {
						$scope.tipzy.currency = cfg.value;
					} else if (cfg.property == 'selected_tip') {
						$scope.setTip(cfg);
					}

					if (cfg.category == 'slab')
						$scope.tipzy.tipSlabs.push(cfg);
				}

				for (var j = 0; j < $scope.tipzy.tipSlabs.length; j++) {

					if ($scope.tipzy.tipSlabs[j].value == $scope.tipzy.tipRate)
						$scope.tipzy.tipSlabs[j].selected = true;
				}
			});
		});
	}, 300);



	$scope.calculatePayable = function () {
		var t = $scope.tipzy;
		var ba = parseFloat(t.billedAmount.replace(",", ""));

		if (ba > 0 && ba < 1000) {
			t.tip = ba * t.tipRate;
			t.payable = parseFloat(t.billedAmount) + t.tip;

			t.tipPerPerson = t.tip / t.people;
			t.payablePerPerson = parseFloat((t.payable / t.people).toFixed(2));
		} else {
			t.tip = t.payable = t.tipPerPerson = t.payablePerPerson = 0.0;
		}

	};

	$scope.unevenSplit = function () {
		var eachSplit;

		if (!$scope.tipzy.peoplelist || $scope.tipzy.peoplelist.length <= 0) {
			$scope.tipzy.peoplelist = [];
		} else if ($scope.tipzy.peoplelist.length == 1) {
			$scope.tipzy.peoplelist = [];
		} else if ($scope.tipzy.peoplelist.length > $scope.tipzy.people) {
			$scope.tipzy.peoplelist.splice(parseFloat($scope.tipzy.peoplelist.length -
				1), 1);
		}


		for (var i = $scope.tipzy.peoplelist.length; i < $scope.tipzy.people; i++) {
			eachSplit = {};
			eachSplit.amt = 0;
			eachSplit.edited = false;

			$scope.tipzy.peoplelist.push(eachSplit);
		}

		$scope.calcSplit();
	};

	$scope.setTip = function (slab) {
		$scope.tipzy.tipRate = parseFloat(slab.value) / 100;

		for (var i = 0; i < $scope.tipzy.tipSlabs.length; i++) {
			var tipSlab = $scope.tipzy.tipSlabs[i];

			tipSlab.selected = false;

			if (tipSlab.value == slab.value) {
				tipSlab.selected = true;
			}
		}
		$scope.calculatePayable();
	};

	$scope.calcSplit = function (eachsplit) {
		if (eachsplit)
			eachsplit.edited = true;

		var eTotal = uTotal = eTotalCount = uTotalCount = 0;

		for (var i = 0; i < $scope.tipzy.peoplelist.length; i++) {
			if ($scope.tipzy.peoplelist[i].edited) {
				eTotal += parseFloat($scope.tipzy.peoplelist[i].amt);
				eTotalCount++;
			} else {
				uTotal += parseFloat($scope.tipzy.peoplelist[i].amt);
				uTotalCount++;
			}

		}

		for (var i = 0; i < $scope.tipzy.peoplelist.length; i++) {
			if (!$scope.tipzy.peoplelist[i].edited)
				$scope.tipzy.peoplelist[i].amt = parseFloat((parseFloat($scope.tipzy.payable) -
					parseFloat(eTotal)) / uTotalCount).toFixed(2);
		}
	};

	$scope.addPeople = function () {
		if ($scope.tipzy.people < 9) {
			$scope.tipzy.people++;
		}
		$scope.calculatePayable();
		$scope.unevenSplit();
	};

	$scope.removePeople = function () {
		if ($scope.tipzy.people > 1) {
			$scope.tipzy.people--;
		}
		$scope.calculatePayable();
		$scope.unevenSplit();
	};

})

.controller('settingsController', function ($scope, $state, $ionicModal,
	tipzyConfigService) {
	$scope.tipzy = {
		'config': {}
	};

	tipzyConfigService.getConfig(function (data) {
		$scope.$apply(function () {
			$scope.tipzy.config = data;
		});
	});

	$ionicModal.fromTemplateUrl('templates/currencylist.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function (modal) {
		$scope.modal = modal;
	});

	$scope.showCurrencyList = function () {
		$scope.modal.show();

		for (var i = 0; i < $scope.tipzy.config.length; i++) {
			var cfg = $scope.tipzy.config[i];
			if (cfg.property == 'currency') {
				$scope.modal.currency = cfg.value;
				break;
			}
		}

		$scope.modal.currencyList = ["$", "€", "₹", "£", "₡", "¥", "₪", "₩", "₨",
			"﷼", "₱", "฿", "Kč"];
	};

	$scope.hideCurrencyList = function () {
		$scope.modal.hide();

		for (var i = 0; i < $scope.tipzy.config.length; i++) {
			if ($scope.tipzy.config[i].property == 'currency') {
				$scope.tipzy.config[i].value = $scope.modal.currency;
				break;
			}
		}
	};

	//Cleanup the modal when we're done with it!
	$scope.$on('$destroy', function () {
		$scope.modal.remove();
	});

	// Execute action on hide modal
	$scope.$on('modal.hidden', function () {
		// Execute action
	});

	// Execute action on remove modal
	$scope.$on('modal.removed', function () {
		// Execute action
	});

	$scope.saveSettings = function () {
		tipzyConfigService.setConfig($scope.tipzy.config, function () {
			$state.transitionTo('tipzy.calculate');
		});

	};

});
