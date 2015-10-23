var app = angular.module('app.authentication.user.list.controller',[
	'app.authentication.user.list.detail.controller'
]);

app.controller('userListCtrl', function($scope, $modal){

	$scope.toggle = true;
	$scope.toggleFilter = function(){
		$scope.toggle = $scope.toggle === false ? true : false;
	};

	$scope.userListDetail = function(){
		var modalInstance = $modal.open({
			animation : true,
			templateUrl: 'modules/user/views/userListDetail.html',
			controller:  'userListDetailCtrl',
			size: 'md',
			// windowClass: 'app-modal-window',
			resolve: {
				getid: function(){
					return true;
				}
			}
		});
	};
});