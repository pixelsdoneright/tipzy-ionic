angular.module('tipzy.directives', [])

.directive('format', ['$filter',
  function ($filter) {
		return {
			require: '?ngModel',
			link: function (scope, elem, attrs, ctrl) {
				if (!ctrl) return;


				ctrl.$formatters.unshift(function (a) {
					elem[0].value = ctrl.$modelValue
					elem.priceFormat({
						prefix: '',
						centsSeparator: '.',
						thousandsSeparator: ','
					});
					return elem[0].value;
				});


				ctrl.$parsers.unshift(function (viewValue) {
					elem.priceFormat({
						prefix: '',
						centsSeparator: '.',
						thousandsSeparator: ','
					});
					return elem[0].value;
				});
			}
		};
  }
]);
