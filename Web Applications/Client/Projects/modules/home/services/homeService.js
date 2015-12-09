var app = angular.module('app.authentication.home.services',[]);

app.factory('HomeService', function(Restangular){
	var services = {};
	var api = Restangular.all('api');

	services.getListAppointment = function(params){
		var result = api.all('appointment-telehealth-list');
		return result.post({data: params});
	};
	services.getDetailAppointment = function(params){
		var result = api.one('appointment-telehealth-detail/'+params);
		return result.get({data:params});
		//return api.one('appointment-telehealth-detail/'+ params).get();
	};
	services.getListDoctor = function(params){
		var result = api.one('doctorappointment');
		return result.get({data:params});
	};

	return services;
});