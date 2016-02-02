angular.module('app.authentication.eForms.services',[])
.factory("eFormService", function(Restangular, $state,$q){
	var eFormService = {};
	var api = Restangular.all("api");

	eFormService.postData = function(data){
		var postData = api.all("paperless/post-data");
		return postData.post({data:data});
	};

	eFormService.insertTemplate = function(data){
		var insertTemplate = api.all("paperless/insert-template");
		return insertTemplate.post({data:data});
	};

	eFormService.getTemplate = function(data){
		var getTemplate = api.all("paperless/get-template");
		return getTemplate.post({data:data});
	};

	eFormService.insertData = function(data){
		var insertData = api.all("paperless/insert-data");
		return insertData.post({data:data});
	};

	eFormService.getData = function(data){
		var getData = api.all("paperless/get-data");
		return getData.post({data:data});
	};

	eFormService.loadlistEFormAppointment = function(data) {
		var loadlistEFormAppointment = api.all("paperless/loadlist-eformappt");
		return loadlistEFormAppointment.post({data:data});
	};

	eFormService.getUIDTemplate = function(data) {
		var getUIDTemplate = api.all("paperless/get-uid-template");
		return getUIDTemplate.post({data:data});
	};

	eFormService.loadlistTemplate = function(data) {
		var loadlistTemplate = api.all("paperless/loadlist-template");
		return loadlistTemplate.post({data:data});
	};

	eFormService.updateData = function(data) {
		var updateData = api.all("paperless/update-data");
		return updateData.post({data:data});
	};
	eFormService.printData = function(data) {
		var printData = api.all("paperless/print-pdf");
		return printData.post({data:data});
	};
	eFormService.upadteTemplate = function(data) {
		var upadteTemplate = api.all("paperless/update-template");
		return upadteTemplate.post({data:data});
	};

	return eFormService;
})
