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
        commonService.getModulesForUser = function() {
            var result = api.one("module/GetModulesForUser");
            return result.get();
        }
        commonService.formatDate = function(data){
            var dataFormat = moment(data,"DD/MM/YYYY HH:mm:ss Z").format("YYYY-MM-DD hh:mm:ss Z");
            return dataFormat
        }
        commonService.RegExpMobilePhone = function(MobilePhone) {
            var auMobilePhone = new RegExp(/^(\+61|0061|0)?4[0-9]{8}$/);
            if (!auMobilePhone.test(MobilePhone)) {
               return false
            }
            return true
        }
        commonService.RegExpHomePhone= function(HomPhone) {
            var auHomPhone = new RegExp(/^[0-9]{6,10}$/);
            if (!auHomPhone.test(HomPhone)) {
               return false
            }
            return true
        }
        commonService.RegExpWorkPhone= function(WorkPhone) {
            var auWorkPhone = new RegExp(/^[*#-_0-9]{6,20}$/);
            if (!auWorkPhone.test(WorkPhone)) {
              return false
             }
             return true
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

        commonService.ApiUploadFile = "https://testapp.redimed.com.au:3005/api/uploadFile";
        // commonService.ApiUploadFile = 'http://telehealthvietnam.com.vn:3005/api/uploadFile';
        commonService.API = "https://testapp.redimed.com.au:3005";
        // commonService.API = "http://telehealthvietnam.com.vn:3005";
        commonService.contentVerify = "Your REDiMED account verification code is";

        commonService.DoctorUID = function(){
            var DoctorMeditek = "c2352016-3ca7-4d3a-a8dc-e8faacaca8cd";
            var DoctorTestApp = "c2352016-3ca7-4d3a-a8dc-e8faacaca8cd";
            return DoctorMeditek
        }

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
                    // error.pushError("GetFile.getFileError");
                    // throw error;
                    throw err
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
            Window = window.open("about:blank", "", "_blank");
            // Window = window.open("");
            return getFile(fileUID,size,'image/jpg')
            .then(function(file){
                var objectUrl = URL.createObjectURL(file.blob);
                // window.open(objectUrl);
                setTimeout(function() {
                    Window.location.href = objectUrl;
                   /*var html = $("<div></div>");
                    var buttonClose = $("<button onclick='window.close()'>Close</button>");
                    buttonClose.css({
                        width:"30%",
                        height:"5%",
                        "font-size":"4vh"
                    })
                    var divImg = $("<div></div>");
                   /!* divImg.css({
                        overflow: 'auto'
                    });*!/
                    var img = $("<img/>");
                    img.attr('src', objectUrl);
                    divImg.append(img);
                    html.append(buttonClose,$("<br/>"), divImg);
                    Window.document.write($("<div>").append(html.clone()).html());*/
                    var buttonClose = $("<button onclick='window.close()'>Close</button>");
                    buttonClose.css({
                        width:"30%",
                        height:"5%",
                        "font-size":"4vh"
                    })
                    setTimeout(function(){
                        // $(Window.document.documentElement).prepend(buttonClose,$("<br/>"));// documentElement-> lay html element
                        $(Window.document).find("body").prepend(buttonClose,$("<br/>"));
                    },100);
                }, 100);
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

        commonService.refreshToken=function()
        {
            var result=api.one('refreshToken');
            return result.get();
        };


        return commonService;
    })
