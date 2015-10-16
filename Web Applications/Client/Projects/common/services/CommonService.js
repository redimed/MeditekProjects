angular.module("app.common",[])
.factory("CommonService",function(Restangular){
	var commonService={};
	var api = Restangular.all("api");
	//FUNCTION MẪU
	commonService.getTitles=function()
	{
		var list=[
			{id:1, name:'Mr'},
			{id:2, name:'Mrs'},
			{id:3, name:'Ms'},
			{id:4, name:'Dr'}
		];
		return list; 
	}

	commonService.getModulesForUser=function()
	{
		var result = api.one("module/GetModulesForUser");
		return result.get();
	}	
	return commonService;
})
