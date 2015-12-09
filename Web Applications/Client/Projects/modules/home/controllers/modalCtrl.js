var app = angular.module('app.authentication.home.modal.controller',[]);

app.controller('modalCtrl', function($scope, $modalInstance, dataModal, HomeService){
	$modalInstance.rendered.then(function(){
		App.initAjax();
		ComponentsDateTimePickers.init();
	});
	$scope.cancel = function($even){
		if($even){$even.preventDefault();}
		$modalInstance.dismiss('cancel');
	};
	$scope.save = function($even){
		if($even){$even.preventDefault();}
		console.log($scope.detail);
		$modalInstance.close('OK');
	};

	function init(){
		getListDoctor();
	};
	$scope.detail = dataModal;
	$scope.detail.appointmentDate = moment($scope.detail.FromTime, "YYYY-MM-DD HH:mm:ss Z").utc().format("DD/MM/YYYY");
	$scope.detail.appointmentTime = moment($scope.detail.FromTime).utc().format('h:mm:ss A');
	$scope.detail.CreatedDate = formatDate($scope.detail.CreatedDate);

	function formatDate(data) {
        var date = moment(data, "YYYY-MM-DD HH:mm:ss Z").format("DD/MM/YYYY");
        return date;
    };

    function getListDoctor(){
    	HomeService.getListDoctor()
    		.then(function(res){
    			$scope.doctors = res;
    			console.log('getListDoctor', res);
    		},function(err){
    			console.log('error getListDoctor', res);
    		});
    };

	//====================================================================================
	init();
});