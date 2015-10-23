angular.module('app.authentication.doctor.service', [])
.factory("doctorService", function(Restangular) {

	var services = {};
	var api = Restangular.all('api');

	services.getList = function(data) {
		var instanceApi = api.all('getDoctor');
		return instanceApi.post({data: data});
	}

	services.ValiCreate = function(data) {
		var instanceApi = api.all('valCreate');
		return instanceApi.post({data: data});
	}

	services.checksPhone = function(data) {
		var instanceApi = api.all('checkPhone');
		return instanceApi.post({data: data});
	}
	services.checkEmail = function(data) {
		var instanceApi = api.all('checkEmail');
		return instanceApi.post({data: data});
	}
	services.doctorAppointment = function(data) {
		var instanceApi = api.all('doctorappointment');
		return instanceApi.post({data: data});
	}
	services.doctorIdAppointment = function(data) {
		var instanceApi = api.all('doctorIdappointment');
		return instanceApi.post({data: data});
	}
	// services.getDetail = function(data) {
	// 	var instanceApi = api.all('getbyidDoctor');
	// 	return instanceApi.post({data: data});
	// }

	return services;
});