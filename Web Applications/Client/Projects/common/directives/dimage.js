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
			dimageStatus:"=",
			// dimageLoad:"&"
		},
		link:function(scope,element,attrs)
		{
			scope.$watch('dimageUid',function(newValue,oldValue){
				if(o.checkData(scope.dimageUid))
				{
					if(scope.dimageUid)
					{
						scope.dimageStatus = 'loading';
						CommonService.getFileURL(scope.dimageUid,scope.dimageSize)
						.then(function(url){
							scope.dimageStatus = 'finished';
							element.attr('src',url);
						},function(err){
							scope.dimageStatus = err.status;
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