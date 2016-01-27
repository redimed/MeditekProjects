angular.module('app.authentication.eForms.services',[])
.factory("eFormService", function(Restangular, $state,$q){
	var paperlessService = {};
	var api = Restangular.all("api");

	paperlessService.postData = function(data){
		var postData = api.all("paperless/post-data");
		return postData.post({data:data});
	};

	paperlessService.insertTemplate = function(data){
		var insertTemplate = api.all("paperless/insert-template");
		return insertTemplate.post({data:data});
	};

	paperlessService.getTemplate = function(data){
		var getTemplate = api.all("paperless/get-template");
		return getTemplate.post({data:data});
	};

	paperlessService.insertData = function(data){
		var insertData = api.all("paperless/insert-data");
		return insertData.post({data:data});
	};

	paperlessService.getData = function(data){
		var getData = api.all("paperless/get-data");
		return getData.post({data:data});
	};

	paperlessService.loadlistEFormAppointment = function(data) {
		var loadlistEFormAppointment = api.all("paperless/loadlist-eformappt");
		return loadlistEFormAppointment.post({data:data});
	};

	paperlessService.getUIDTemplate = function(data) {
		var getUIDTemplate = api.all("paperless/get-uid-template");
		return getUIDTemplate.post({data:data});
	};

	paperlessService.loadlistTemplate = function(data) {
		var loadlistTemplate = api.all("paperless/loadlist-template");
		return loadlistTemplate.post({data:data});
	};

	paperlessService.updateData = function(data) {
		var updateData = api.all("paperless/update-data");
		return updateData.post({data:data});
	}

	return paperlessService;
})
