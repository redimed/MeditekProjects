angular.module("app.blank.services",[])
	.factory("blankServices",function(Restangular){
		var services = {};
		var api = Restangular.all("api");
		services.registerPatient = function(data){
			return api.all('patient/create-patient').post(data);
		}
		services.checkpatient = function(data){
			return api.all('patient/check-patient').post({data:data});
		}
		services.searchPatient = function(data){
			return api.all('patient/search-patient').post({data:data});
		}
		return services;
	});