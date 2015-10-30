angular.module("app.common.CommonService", [])
    .factory("CommonService", function(Restangular,FileRestangular,$cookies,$http) {
        var commonService = {};
        var api = Restangular.all("api");
        var apiFile=FileRestangular.all('api');
        //FUNCTION MẪU
        commonService.getTitles = function() {
            var list = [{
                id: 1,
                name: 'Mr'
            }, {
                id: 2,
                name: 'Mrs'
            }, {
                id: 3,
                name: 'Ms'
            }, {
                id: 4,
                name: 'Dr'
            }];
            return list;
        }
        commonService.getModulesForUser = function() {
            var result = api.one("module/GetModulesForUser");
            return result.get();
        }
        commonService.GetClinicalDetails = function() {
            var list = [{
                Section: "Clinical Details",
                Category: "Telehealth Appointment",
                Type: "Trauma",
                Name: "Dislocation",
                Value: null,
                ClinicalNote: null,
                Description: null
            }, {
                Section: "Clinical Details",
                Category: "Telehealth Appointment",
                Type: "Trauma",
                Name: "Fracture",
                Value: null,
                ClinicalNote: null,
                Description: null
            }, {
                Section: "Clinical Details",
                Category: "Telehealth Appointment",
                Type: "Trauma",
                Name: "Open",
                Value: null,
                ClinicalNote: null,
                Description: null
            }, {
                Section: "Clinical Details",
                Category: "Telehealth Appointment",
                Type: "Trauma",
                Name: "Closed",
                Value: null,
                ClinicalNote: null,
                Description: null
            }, {
                Section: "Clinical Details",
                Category: "Telehealth Appointment",
                Type: "Trauma",
                Name: "Displaced",
                Value: null,
                ClinicalNote: null,
                Description: null
            }, {
                Section: "Clinical Details",
                Category: "Telehealth Appointment",
                Type: "Lacerations",
                Name: "Hand",
                Value: null,
                ClinicalNote: null,
                Description: null
            }, {
                Section: "Clinical Details",
                Category: "Telehealth Appointment",
                Type: "Lacerations",
                Name: "Nerve",
                Value: null,
                ClinicalNote: null,
                Description: null
            }, {
                Section: "Clinical Details",
                Category: "Telehealth Appointment",
                Type: "Lacerations",
                Name: "Tendon/musde",
                Value: null,
                ClinicalNote: null,
                Description: null
            }, {
                Section: "Clinical Details",
                Category: "Telehealth Appointment",
                Type: "Lacerations",
                Name: "Facial",
                Value: null,
                ClinicalNote: null,
                Description: null
            }, {
                Section: "Clinical Details",
                Category: "Telehealth Appointment",
                Type: "Lacerations",
                Name: "Others",
                Value: null,
                ClinicalNote: null,
                Description: null
            }, {
                Section: "Clinical Details",
                Category: "Telehealth Appointment",
                Type: "Lacerations",
                Name: "Skin loss",
                Value: null,
                ClinicalNote: null,
                Description: null
            }, {
                Section: "Clinical Details",
                Category: "Telehealth Appointment",
                Type: "Lacerations",
                Name: "Skin loss",
                Value: null,
                ClinicalNote: null,
                Description: null
            }, {
                Section: "Clinical Details",
                Category: "Telehealth Appointment",
                Type: "Skin cancer",
                Name: "BCC/SCC",
                Value: null,
                ClinicalNote: null,
                Description: null
            }, {
                Section: "Clinical Details",
                Category: "Telehealth Appointment",
                Type: "Skin cancer",
                Name: "Melanoma",
                Value: null,
                ClinicalNote: null,
                Description: null
            }, {
                Section: "Clinical Details",
                Category: "Telehealth Appointment",
                Type: "Hand Condition",
                Name: "Ganglion",
                Value: null,
                ClinicalNote: null,
                Description: null
            }, {
                Section: "Clinical Details",
                Category: "Telehealth Appointment",
                Type: "Hand Condition",
                Name: "Arthritis",
                Value: null,
                ClinicalNote: null,
                Description: null
            }, {
                Section: "Clinical Details",
                Category: "Telehealth Appointment",
                Type: "Hand Condition",
                Name: "DeQuervains/Trigger",
                Value: null,
                ClinicalNote: null,
                Description: null
            }, {
                Section: "Clinical Details",
                Category: "Telehealth Appointment",
                Type: "Hand Condition",
                Name: "Contracture",
                Value: null,
                ClinicalNote: null,
                Description: null
            }, {
                Section: "Clinical Details",
                Category: "Telehealth Appointment",
                Type: "PNS",
                Name: "Carpal Tunnel",
                Value: null,
                ClinicalNote: null,
                Description: null
            }, {
                Section: "Clinical Details",
                Category: "Telehealth Appointment",
                Type: "PNS",
                Name: "Cubital Tunnel",
                Value: null,
                ClinicalNote: null,
                Description: null
            }, {
                Section: "Clinical Details",
                Category: "Telehealth Appointment",
                Type: "PNS",
                Name: "Tarsal Tunnel",
                Value: null,
                ClinicalNote: null,
                Description: null
            }, {
                Section: "Clinical Details",
                Category: "Telehealth Appointment",
                Type: "PNS",
                Name: "Other",
                Value: null,
                ClinicalNote: null,
                Description: null
            }, {
                Section: "Clinical Details",
                Category: "Telehealth Appointment",
                Type: "PNS",
                Name: "Complex Reconstructive Case",
                Value: null,
                ClinicalNote: null,
                Description: null
            }];
            return list
        }

        commonService.GetNamDoctor = function() {
            var list = [{
                Name: "First Surgeon Available",
                Value: null
            }, {
                Name: "Mr Hanh Nguyen",
                Value: null
            }, {
                Name: "Mr Adrian Brooks",
                Value: null
            }, {
                Name: "Mr Dan Luo",
                Value: null
            }, {
                Name: "Ms Sharon Chu",
                Value: null
            }]
            return list
        }

        commonService.ApiUploadFile = "http://testapp.redimed.com.au:3005/api/uploadFile";
        // commonService.ApiUploadFile = 'http://telehealthvietnam.com.vn:3005/api/uploadFile';
        commonService.API = "http://testapp.redimed.com.au:3005";
        // commonService.API = "http://telehealthvietnam.com.vn:3005";
        commonService.contentVerify = "Your REDiMED account verification code is";


        /**
         * getFile
         * Input:
         * - fileUID
         * - size
         * - type: MIME type (image/jpg,video/x-mpeg...)
         * Output:
         *     file: {blob,filename}
         */
        function getFile(fileUID, size, type)
        {
            var error=new Error('GetFile.Error');
            if(o.checkData(fileUID))
            {
                var result=apiFile.all('downloadFile');
                if(size) result=result.one(size.toString());
                result=result.one(fileUID);
                result.withHttpConfig({
                    responseType:'arraybuffer',
                    // headers: {'Authorization': 'Bearer '+$cookies.get('token')}
                })
                return result.get()
                .then(function(res){
                    // var blob = new Blob([res], {type: 'image/jpg'});
                    var options={};
                    if(o.checkData(type)) options.type=type;
                    var blob = new Blob([res.data],options);
                    return {blob:blob,filename:res.headers().filename||''};
                },function(err){
                    error.pushError("GetFile.getFileError");
                    throw error;
                })
            }
            else
            {
                error.pushError("GetFile.fileuidNotProvided");
                throw error;
            }
            
        }

        commonService.downloadFile=function(fileUID,size)
        {
            return getFile(fileUID,size)
            .then(function(file){
                var objectUrl = URL.createObjectURL(file.blob);
                //open image in new tab
                // window.open($scope.objectUrl);
                //download file:
                var anchor = document.createElement("a");
                // anchor.download='';//se lay ten mat dinh
                anchor.download=file.filename||'';
                anchor.href = objectUrl;
                anchor.click();
                return {status:'success'};
            },function(err){
                throw err;
            })
        };

        commonService.getFileURL=function(fileUID,size)
        {
            return getFile(fileUID,size)
            .then(function(file){
                var objectUrl = URL.createObjectURL(file.blob);
                return objectUrl;
            },function(err){
                throw err;
            })
        };

        commonService.openImageInNewTab=function(fileUID,size)
        {
            return getFile(fileUID,size,'image/jpg')
            .then(function(file){
                var objectUrl = URL.createObjectURL(file.blob);
                window.open(objectUrl);
                return {status:'success'};
            },function(err){
                throw err;
            })
        };

        commonService.test=function()
        {
            var result = api.one("user-account/test");
            return result.get();
        };


        return commonService;
    })
