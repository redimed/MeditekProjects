var app = angular.module('app.authentication.WAAppointment.list.detail.controller',[
]);

app.controller('WAAppointmentListDetailCtrl', function($scope, $modalInstance,data){
	$modalInstance.rendered.then(function() {
        App.initComponents(); // init core components
        App.initAjax();
        ComponentsDateTimePickers.init(); // init todo page
        ComponentsSelect2.init(); // init todo page
        ComponentsBootstrapSelect.init(); // init todo page
        Portfolio.init();
        //ComponentsDropdowns.init(); // init todo page
    });
	$scope.wainformation = data;
	$scope.close = function(){
		$modalInstance.close();
	};
});