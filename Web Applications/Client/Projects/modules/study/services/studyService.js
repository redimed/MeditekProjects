var app = angular.module('app.authentication.study.service',[]);
app.factory('studyService', function(Restangular){
	var services = {};
	var api = Restangular.all('api');

	services.getListPatient = function(params){
		var r = api.all("patient/loadlist-patient");
		return r.post({data:params});
	};
	services.getDetailPatient = function(params){
		var r = api.all("patient/detail-patient");
		return r.post({data:params});
	};
	return services;
});