angular.module("app.common",[])
.factory("CommonService",function(){
	var commonService={};
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
	
	return commonService;
})
