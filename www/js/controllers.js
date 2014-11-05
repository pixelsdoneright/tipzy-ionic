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

.controller('calculateCtrl', function ($scope) {

	$scope.tipzy = {
		'billedAmount': 0.00,
		'tipRate': 0.15,
		'payable': 0.0,
		'tip': 0.0,
		'payablePerPerson': 0.0,
		'tipPerPerson': 0.0,
		'people': 2
	};

	$scope.calculatePayable = function () {
		var t = $scope.tipzy;
		var ba = parseFloat(t.billedAmount);

		if (ba > 0) {
			t.tip = ba * t.tipRate;
			t.payable = parseInt(t.billedAmount) + t.tip;

			t.tipPerPerson = t.tip / t.people;
			t.payablePerPerson = t.payable / t.people;
		}

	};

	$scope.unevenSplit = function () {
		var eachSplit;

		if (!$scope.splitPersons || $scope.splitPersons.length <= 0) {
			$scope.splitPersons = [];
		} else if ($scope.splitPersons.length == 1) {
			$scope.splitPersons = [];
		} else if ($scope.splitPersons.length > $scope.tipzy.people) {
			$scope.splitPersons.splice(parseFloat($scope.splitPersons.length - 1), 1);
		}


		for (var i = $scope.splitPersons.length; i < $scope.tipzy.people; i++) {
			eachSplit = {};
			eachSplit.amt = 0;
			eachSplit.edited = false;

			$scope.splitPersons.push(eachSplit);
		}

		$scope.calcSplit();
	};

	$scope.calcSplit = function (getsome) {
		if (getsome)
			getsome.split.edited = true;

		var eTotal = uTotal = eTotalCount = uTotalCount = 0;

		for (var i = 0; i < $scope.splitPersons.length; i++) {
			if ($scope.splitPersons[i].edited) {
				eTotal += parseFloat($scope.splitPersons[i].amt);
				eTotalCount++;
			} else {
				uTotal += parseFloat($scope.splitPersons[i].amt);
				uTotalCount++;
			}

		}

		for (var i = 0; i < $scope.splitPersons.length; i++) {
			if (!$scope.splitPersons[i].edited)
				$scope.splitPersons[i].amt = parseFloat((parseFloat($scope.tipzy.payable) -
					parseFloat(eTotal)) / uTotalCount).toFixed(2);
		}
	};

});
