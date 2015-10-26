angular.module('app.common.ngEnter', [])
// Enter
.directive('ngEnter', function() {
	return function(scope, element, attrs) {
		element.bind("keydown keypress", function(event) {
			if(event.which === 13) {
				scope.$apply(function() {
					scope.$eval(attrs.ngEnter);
				});
				event.preventDefault();
			}
		});
	};
})
// History Back
.directive('backButton', function() {
    return function(scope, element, attrs ) {
        element.on('click', function () {
            history.back();
            scope.$apply();
        });
    };
})
// Number
.directive('onlyNumber', function () {
    return {
		require: 'ngModel',
		restrict: 'A',
		link: function (scope, element, attr, ctrl) {
			function inputValue(val) {
				if (val) {
					var digits = val.replace(/[^0-9]/g, '');

					if (digits !== val) {
					  ctrl.$setViewValue(digits);
					  ctrl.$render();
					}
					return parseInt(digits,10);
				}
				return undefined;
			}            
			ctrl.$parsers.push(inputValue);
		}
    };
});
