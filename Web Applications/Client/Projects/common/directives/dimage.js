/**
 * Directive dùng để load dynamic image
 * Input: 
 * - dimage-uid
 * - dimage-size
 */
angular.module('app.common.dimage',[])
.directive('dimage',function(CommonService){
	return {
		restrict:'A',
		scope:{
			dimageUid:"=",
			dimageSize:"=",
			// dimageLoad:"&"
		},
		link:function(scope,element,attrs)
		{
			scope.$watch('dimageUid',function(newValue,oldValue){
				if(o.checkData(scope.dimageUid))
				{
					if(scope.dimageUid)
					{
						CommonService.getFileURL(scope.dimageUid,scope.dimageSize)
						.then(function(url){
							element.attr('src',url);
						},function(err){
							throw err;
						})
					}
					else
					{
						var error=new Error ('dimageDirective.paramsNotProvided');
						throw error;
					}
				}
			});
			
			
		}
	}
});