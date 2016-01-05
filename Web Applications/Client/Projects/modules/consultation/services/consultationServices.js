angular.module("app.authentication.consultation.services", [])
    .factory("consultationServices", function(Restangular, FileRestangular) {
        var services = {};
        var api = Restangular.all("api");
        var apiFile = FileRestangular.all("api");

        services.listAppointment = function(data) {
            return api.all('appointment/list').post({data:data});
        }
         services.listConsultation = function(data) {
            return api.all('consultation/list').post({data:data});
        }
        services.GetDrawingTemplates = function(data) {
            return api.one('consultation/drawing/list').get();
        }
        services.GetDrawingFileUrl = function(id) {
            var result = apiFile.all('consultation/drawing/getfile');
            result = result.one(id);
            result.withHttpConfig({
                responseType: 'arraybuffer',
                // headers: {'Authorization': 'Bearer '+$cookies.get('token')}
            })
            return result.get()
                .then(function(res) {
                    // var blob = new Blob([res], {type: 'image/jpg'});
                    var options = {
                        type: 'image/jpg'
                    };
                    var blob = new Blob([res.data], options);
                    return {
                        blob: blob,
                        filename: res.headers().filename || ''
                    };
                }, function(err) {
                    // error.pushError("GetFile.getFileError");
                    // throw error;
                    throw err;
                })
            
        }
        services.createConsultation = function(data) {
            return api.all('consultation/create').post({data:data});
        }
        services.detailConsultation = function(UID) {
            return api.one('consultation/detail/424f7e25-1cd1-4d9e-9201-f634d84b1908').get();
        }
        return services;
    });
