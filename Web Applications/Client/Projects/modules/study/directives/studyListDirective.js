var app = angular.module('app.authentication.study.list.directive',[
]);

app.directive('studyList', function(studyService, $uibModal){
	return {
		restrict: 'E',
		templateUrl: 'modules/study/directives/templates/list.html',
		link: function(scope, elem, attrs){
			
			// -----------------------------------------
			function Init(){
				scope.patients = {};
				scope.searchObject = {
					limit: 20,
					offset: 0,
					currentPage: 1,
					maxSize: 5,
					Search: null,
					Order: null,
				};
				LoadList(scope.searchObject);
			};
			// -----------------------------------------
			function LoadList(params){
				studyService.getListPatient(params)
					.then(function(res){
						scope.patients = res.data;
						console.log('getListPatient',patients.patients);
					}, function(err){
						console.log(err);
					});
			};
			// -----------------------------------------
			scope.toggle = true;
			scope.Filter = function(){
				return scope.toggle = scope.toggle === true ? false : true;
			};

			scope.SetPage = function(){
				scope.searchObject.offset = (scope.searchObject.currentPage - 1) * scope.searchObject.limit;
				LoadList(scope.searchObject);
			};

			scope.OpenModal = function(UID){
				studyService.getDetailPatient(UID)
					.then(function(res){
						var data = res.data;
						var modalInstance = $uibModal.open({
							animation: true,
							templateUrl: 'modules/study/views/studyDetail.html',
							controller: 'studyDetailCtrl',
							size: 'lg',
							resolve: function(){
								return data;
							},
						});	
					}, function(err){});
			};
			// -----------------------------------------
			Init();
		},
	};
});