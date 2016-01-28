angular.module("app.authentication.roster.services", [])
    .factory("RosterService", function(Restangular) {
        var services = {};
        var api = Restangular.all("api");

        services.GetListService = function(){
        	return api.one("service/list").get();
        }

        services.GetListSite = function(){
        	return api.one("site/list").get();
        }

        services.CreateRoster = function(data){
        	return  api.all("roster/create").post({
        		data: data
        	});
        }

        services.UpdateRoster = function(data){
        	return api.all("roster/update").post({
        		data: data
        	});
        }

        services.DestroyRoster = function(data){
            return api.all("roster/destroy").post({
                    data: data
            });
        }

        services.PostListRoster = function(data){
                return api.all("roster/list").post({
                        data: data
                });
        }

        services.GetDetailRoster = function(data){
        	return api.one("roster/detail/"+data.UID).get();
        }

        return services;
});