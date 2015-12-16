var app = angular.module('app.authentication.urgentCare.detail.directive',[
]);

app.directive('urgentcareDetail', function($timeout){
	return {
		scope:{
			info:'=onData',
			close:'=onCancel'
		},
		restrict: 'E',
		templateUrl: 'modules/urgentCare/directives/templates/urgentCareDetail.html',
		link: function(scope, elem, attrs){
			console.log(scope.info);
			scope.info.RequestDate = moment(scope.info.RequestDate).format('DD/MM/YYYY HH:mm:ss');
			if(scope.info.DOB!=null){
				if(scope.info.DOB.length > 10) {
					scope.info.DOB = scope.info.DOB.slice(0,10);
				}
			}
			scope.status = [
				{id:'confirmed',name:'Confirmed'},
				{id:'spending',name:'Not Responded'},
				{id:'pending',name:'Pending'}
			];
			$timeout(function(){
				App.initAjax();
				ComponentsDateTimePickers.init(); // init todo page
				$("#tabtablecontent :input").prop('disabled', true);
			});
		},
	};
});
