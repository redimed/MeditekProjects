angular.module('app.authentication.patient.services',[])
.factory("PatientService", function(Restangular, $state){
	var PatientService = {};
	var api = Restangular.all("api");

	PatientService.detailPatient = function(data){
		var detailPatient = api.all("patient/detail-patient");
		return detailPatient.post({data:data});
	};

	PatientService.loadlistPatient = function(data){
		var loadlistPatient = api.all("patient/loadlist-patient");
		return loadlistPatient.post({data:data});
	};

	PatientService.updatePatient = function(data){
		var updatePatient = api.all("patient/update-patient");
		return updatePatient.post({data:data});
	};

	PatientService.checkPatient = function(data){
		var checkPatient = api.all("patient/check-patient");
		return checkPatient.post({data:data});
	};

	PatientService.createPatient = function(data){
		var createPatient = api.all("patient/create-patient");
		return createPatient.post({data:data});
	};

	PatientService.searchPatient = function(data){
		var searchPatient = api.all("patient/search-patient");
		return searchPatient.post({data:data});
	}

	return PatientService;
})
