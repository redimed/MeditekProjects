var app = angular.module('app.authentication.appointment.list.modal.controller', [
]);

app.controller('appointmentListModalCtrl', function($scope, $modal, $modalInstance, $ocLazyLoad){
	$ocLazyLoad.load([
		'theme/assets/global/plugins/bootstrap-select/bootstrap-select.min.css',
        'theme/assets/global/plugins/select2/select2.css',
        'theme/assets/global/plugins/jquery-multi-select/css/multi-select.css',

        'theme/assets/global/plugins/bootstrap-select/bootstrap-select.min.js',
        'theme/assets/global/plugins/select2/select2.min.js',
        'theme/assets/global/plugins/jquery-multi-select/js/jquery.multi-select.js',

        'theme/assets/admin/pages/scripts/components-dropdowns.js',

        'theme/assets/global/plugins/icheck/skins/all.css',
        'theme/assets/global/plugins/icheck/icheck.min.js',
	]);
	$scope.modal_close = function(){
		$modalInstance.close();
	};
	$scope.close = function(){
		$modalInstance.close();
	};


});
