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
			t.payable = parseFloat(t.billedAmount) + t.tip;

			t.tipPerPerson = t.tip / t.people;
			t.payablePerPerson = parseFloat((t.payable / t.people).toFixed(2));
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

	$scope.calcSplit = function (getsome) {
		if (getsome)
			getsome.split.edited = true;

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
		if ($scope.tipzy.people < 25) {
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

});
