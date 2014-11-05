// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('tipzy', ['ionic', 'tipzy.controllers', 'tipzy.directives'])

.run(function ($ionicPlatform) {
	$ionicPlatform.ready(function () {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}
	});
})

.config(function ($stateProvider, $urlRouterProvider) {
	$stateProvider

		.state('tipzy', {
		url: "/tipzy",
		abstract: true,
		templateUrl: "templates/menu.html",
		controller: 'tipzyAppCtrl'
	})

	.state('tipzy.calculate', {
		url: "/calculate",
		views: {
			'menuContent': {
				templateUrl: "templates/calculate.html",
				controller: 'calculateCtrl'
			}
		}
	})

	.state('tipzy.settings', {
		url: "/settings",
		views: {
			'menuContent': {
				templateUrl: "templates/settings.html"
			}
		}
	})

	.state('tipzy.about', {
		url: "/about",
		views: {
			'menuContent': {
				templateUrl: "templates/about.html"
			}
		}
	});

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/tipzy/calculate');

});
