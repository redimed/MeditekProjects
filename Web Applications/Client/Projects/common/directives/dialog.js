angular.module("app.common",[])


.directive('msgDialog',function($modal){
	return {
		restrict: "E",
		transclude: true,
		scope: {
			type: "@",
			data: "="
		},
		templateUrl: "common/directives/dialog.html",
		link:function(scope,element, attrs){
			scope.msg=element.find(".msg-content").html();
			console.log(scope.msg);
			if(!scope.data)
			{
				scope.data={};

			}
			scope.data.showDialog=function()
			{
				return $modal.open({
					templateUrl:'msg-dialog',
					controller:function($scope,type,msg,$modalInstance)
					{
						$scope.msg=msg;
						$scope.isYesNo=false;
						$scope.isYesNoCancel=false;
						$scope.isOkCancel=false;
						// $scope.choosen='';
						switch(type)
						{
							case 'yesNo':
								$scope.isYesNo=true;
								break;
							case 'yesNoCancel':
								$scope.isYesNoCancel=true;
								break;
							case 'okCancel':
								$scope.isOkCancel=true;
								break;
						}
						$scope.yes=function(){
							
							$modalInstance.close('yes');
						}
						$scope.no=function(){
							$modalInstance.close('no');
						}
						$scope.cancel=function(){
							$modalInstance.close('cancel');
						}
						$scope.ok=function(){
							$modalInstance.close('ok');
						}
					},
					resolve:{
						type:function()
						{
							return scope.type;
						},
						msg:function()
						{
							return scope.msg;
						}
					},

					size:'sm'
				})
				.result.then(function(response){
					return response;
				},function(reason){
					throw 'dismiss';
				});
			}
		}
	}
})