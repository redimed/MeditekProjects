angular.module('app.authentication.urgentCare.services',[])
.factory("urgentCareService", function(Restangular, $state,$q){
	var services = {};
	var api = Restangular.all("api");

	services.loadlist = function(data){
		var loadlist = api.all("urgent-care/loadlist-urgentrequests");
		return loadlist.post({data:data});
	};
	services.detailUrgentRequest = function(data) {
		var detailUrgentRequest = api.all("urgent-care/detail-urgentrequests");
		return detailUrgentRequest.post({data:data});
	};

	return services;
})
