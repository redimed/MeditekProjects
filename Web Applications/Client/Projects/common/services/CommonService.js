angular.module("app.common",[])

.config(function($provide){// provider-injector
	// This is an example of config block.
	// You can have as many of these as you want.
	// You can only inject Providers (not instances)
	// into config blocks.
	$provide.factory('CommonService',function(){
		var commonService={};
		return commonService;
	});
})
.run(function($rootScope, $window, $state){// instance-injector
	// This is an example of a run block.
	// You can have as many of these as you want.
	// You can only inject instances (not Providers)
	// into run blocks
})