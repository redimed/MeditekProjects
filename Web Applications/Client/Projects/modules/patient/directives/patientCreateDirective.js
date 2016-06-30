var app = angular.module('app.authentication.patient.create.directive', []);
app.directive('patientCreate', function(toastr, PatientService, $state, $timeout, $rootScope, $cookies, AuthenticationService, UnauthenticatedService, $uibModal) {
    return {
        scope: {
            appointment: '=',
            staff:'=onStaff',
            abc: '=onItem',
            rolecompany:'=roleCompany',
            reset:'=onReset',
            compid:'=onCompid',
            RoleId:'=onRoleid',
            ishaveusername:'=isHaveUsername',
            cancel:'=onCancel',
            createtype:'=onCreateType',// 'nocompany':show create not link company, 'company': show create link company, null :show 2 create,
            iscompanycreate:'=isCompanyCreate'
        },
        restrict: "EA",
        controller: function($scope, FileUploader) {
            $scope.buildImg = function(imageType, canvasimg, ctximg, e, width, height) {
                var reader = new FileReader();
                reader.onload = function(event) {
                    var img = new Image();
                    img.onload = function() {
                        canvasimg.width = width;
                        canvasimg.height = height;
                        ctximg.drawImage(img, 0, 0, width, height);
                    };
                    img.src = event.target.result;
                }
                reader.readAsDataURL(e.target.files[0]);
            }

            // Profile Image
            //create reqeust uploader
            var uploader = $scope.uploader = new FileUploader({
                // url: 'http://192.168.1.2:3005/api/uploadFile',
                url: o.const.uploadFileUrl,

                withCredentials: true,
                alias: 'uploadFile'
            });

            // FILTERS
            uploader.filters.push({
                name: 'imageFilter',
                fn: function(item /*{File|FileLikeObject}*/ , options) {
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                }
            });
            uploader.onAfterAddingFile = function(fileItem) {
                for (var i = 0; i < uploader.queue.length; i++) {
                    if (uploader.queue[i].formData.length != 0) {
                        if (uploader.queue[i].formData[0].fileType == $scope.typeFile) {
                            uploader.queue.splice(i, 1);
                        }
                    }
                }
                fileItem.formData[0] = {};
                fileItem.formData[0].fileType = $scope.typeFile;
                if ($scope.typeFile == "ProfileImage") {
                    $scope.isChoseAvatar = true;
                }
            };
            uploader.onBeforeUploadItem = function(item) {
                item.headers.Authorization = 'Bearer ' + $cookies.get("token");
                item.headers.systemtype = 'WEB';
                console.info('onBeforeUploadItem', item);
            };
            uploader.onCompleteItem = function(fileItem, response, status, headers) {
                console.info('onCompleteItem', fileItem, response, status, headers);
                if (Boolean(headers.requireupdatetoken) === true) {
                    $rootScope.getNewToken();
                }
            };
            uploader.onErrorItem = function(fileItem, response, status, headers) {
                console.info('onErrorItem', fileItem, response, status, headers);
                if (Boolean(headers.requireupdatetoken) === true) {
                    $rootScope.getNewToken();
                }
            };

        },
        link: function(scope, elem, attrs) {
            console.log('createtype ',scope.createtype);
            scope.createtype = scope.createtype?scope.createtype:null;
            scope.iscompanycreate = scope.iscompanycreate?scope.iscompanycreate:false;
            scope.createtype = scope.createtype?scope.createtype:null;
            scope.ishaveusername = scope.ishaveusername?scope.ishaveusername:false;
            scope.rolecompany = scope.rolecompany==null||scope.rolecompany==undefined?false:scope.rolecompany;
            scope.isChoseAvatar = false;
            // State
            scope.state = [
                { 'code': 'VIC', 'name': 'Victoria' },
                { 'code': 'TAS', 'name': 'Tasmania' },
                { 'code': 'QLD', 'name': 'Queensland' },
                { 'code': 'NSW', 'name': 'New South Wales' },
                { 'code': 'WA', 'name': 'Western Australia' },
                { 'code': 'NT', 'name': 'Northern Territory' },
                { 'code': 'ACT', 'name': 'Australian Capital Territory' }
            ];

            // Title
            scope.titles = [
                {'id':'Mr', 'name':'Mr'},
                {'id':'Mrs', 'name':'Mrs'},
                {'id':'Ms', 'name':'Ms'},
                {'id':'Miss', 'name':'Miss'},
                {'id':'Master', 'name':'Master'},
                {'id':'Dr', 'name':'Dr'}
            ];
            //services getListCountry
            //call Api getListCountry from server
            AuthenticationService.getListCountry().then(function(response) {
                scope.countries = response.data;
            }, function(err) {
                console.log("Server Error");
            });
            //define variable
            scope.data = {};
            scope.er = {};
            scope.ermsg = {};
            scope.isShowNext = false;
            scope.isBlockStep1 = false;
            //if appointment add this directive to their template
            //this directive will receive data from appointment
            //when this code run
            if (scope.appointment) {
                var input = PatientService.getDatatoDirective();
                if (input) {
                    scope.data = angular.copy(input.data);
                    //console.log(scope.data);
                }
            }
            // Back
            //input: none
            //output: back to the previous step
            //and show buttons that were disabled when continue to the next step
            scope.Back = function() {
                scope.isShowNext = false;
                scope.isShowCreate = false;
                scope.isBlockStep1 = false;
            };
            //event timeout will call after this template's directive rendered
            $timeout(function() {
                App.setAssetsPath('theme/assets/'); // Set the assets folder path
                FormWizard.init(); // form step
                ComponentsDateTimePickers.init();
            }, 0);
            //checkPhone : validate data to correct and check PhoneNumber can be used to create patient
            //input : data(FirstName,MiddleName,LastName,PhoneNumber)
            //output:
            //****show Continue button and show notification check success if check success
            //****show notification check error if data doesn't match validate or
            //PhoneNumber used to create patient
            scope.checkPhone = function(data) {

                function checkPhone(verifyData) {
                    PatientService.checkPatient(verifyData)
                        .then(function(result) {
                            if (result != undefined && result != null && result != '' && result.length != 0) {
                                if (result.data.isCreated == false) {
                                    scope.er = '';
                                    scope.ermsg = '';
                                    scope.loadingCheck = false;
                                    toastr.success("Information can be choose to create patient", "SUCCESS");
                                    scope.isShowEmail1 = verifyData.Email;
                                    scope.data.Email1 = verifyData.Email;
                                    scope.isShowNext = true;
                                    scope.data.CountryID1 = 14;
                                    scope.data.Title = verifyData.Title;
                                    scope.data.Gender = verifyData.Gender;
                                    scope.data.Address1 = verifyData.Address1;
                                    scope.data.Address2 = verifyData.Address2;
                                    scope.data.Suburb = verifyData.Suburb;
                                    scope.data.Postcode = verifyData.Postcode;
                                    scope.data.State = verifyData.State;
                                    scope.data.HomePhoneNumber = verifyData.HomePhoneNumber == "" || verifyData.HomePhoneNumber == null ? null : verifyData.HomePhoneNumber;
                                    // scope.data.DOB = new Date('1/1/1990');
                                } else {
                                    // toastr.error("Information was used to create patient", "ERROR");
                                    scope.isBlockStep1 = false;
                                    scope.loadingCheck = false;
                                    var existedField = '';
                                    for(var key in result.data.field) {
                                        if(key == 'PhoneNumber') {
                                            existedField+=' Mobile Phone Number and';
                                        }
                                        else {
                                            existedField+=' '+key+' and';
                                        }
                                    }
                                    if(existedField.substr(existedField.length - 3) == 'and') {
                                        existedField = existedField.slice(0, -3);
                                        existedField+=' existed';
                                        toastr.error(existedField);
                                    }


                                }
                            }
                        }, function(err) {
                            //if receive error push error message into array ermsg,
                            //push error css into array er
                            //and show in template
                            scope.loadingCheck = false;
                            scope.er = {};
                            scope.ermsg = {};
                            toastr.error("Please input correct information", "ERROR");
                            for (var i = 0; i < err.data.message.ErrorsList.length; i++) {
                                scope.er[err.data.message.ErrorsList[i].field] = { 'border': '2px solid #DCA7B0' };
                                scope.ermsg[err.data.message.ErrorsList[i].field] = err.data.message.ErrorsList[i].message;
                            }
                        });
                }

                scope.loadingCheck = true;
                //service validate data
                var verifyData = {
                    FirstName: data?data.FirstName:null,
                    MiddleName: data?data.MiddleName:null,
                    Title: data?data.Title:null,
                    State: data?data.State:null,
                    LastName: data?data.LastName:null,
                    PhoneNumber: data?data.PhoneNumber:null,
                    DOB: data?data.DOB:null,
                    Address1: data?data.Address1:null,
                    Address2: data?data.Address2:null,
                    Suburb: data?data.Suburb:null,
                    Postcode: data?data.Postcode:null,
                    Email1: data?data.Email:null,
                    Email : data?data.Email:null,
                    HomePhoneNumber: data?data.HomePhoneNumber:null,
                    Gender: data?data.Gender:null,
                    UserName:data?data.UserName:null
                };
                if((verifyData.FirstName == null || verifyData.FirstName == '') &&
                   (verifyData.LastName == null || verifyData.LastName == '')){
                    if(verifyData.FirstName == null || verifyData.FirstName == ''){
                        scope.er['FirstName'] = { 'border': '2px solid #DCA7B0' };
                        scope.ermsg['FirstName'] = 'required';
                    }
                    if(verifyData.UserName == null || verifyData.UserName == ''){
                        scope.er['UserName'] = { 'border': '2px solid #DCA7B0' };
                        scope.ermsg['UserName'] = 'required';
                    }
                    if(verifyData.LastName == null || verifyData.LastName == ''){
                        scope.er['LastName'] = { 'border': '2px solid #DCA7B0' };
                        scope.ermsg['LastName'] = 'required';
                    }
                    toastr.error("Please check data again.", "ERROR");
                    scope.loadingCheck = false;
                    // scope.er['Email'] = { 'border': '2px solid #DCA7B0' };
                    // scope.ermsg['Email'] = 'required';
                    // scope.er['PhoneNumber'] = { 'border': '2px solid #DCA7B0' };
                    // scope.ermsg['PhoneNumber'] = 'required';
                }
                else{

                    PatientService.validateCheckPhone(data,scope.ishaveusername)
                    .then(function(success) {
                        scope.er = '';
                        scope.ermsg = '';
                        scope.isBlockStep1 = true;
                        //service call API check PhoneNumber can be used to create Patient
                        if( _.isEmpty(scope.data.Email) && _.isEmpty(scope.data.PhoneNumber) ) {
                            scope.er = '';
                            scope.ermsg = '';
                            scope.loadingCheck = false;
                            toastr.success("Information can be choose to create patient", "SUCCESS");
                            scope.isShowEmail1 = verifyData.Email;
                            scope.data.Email1 = verifyData.Email;
                            scope.isShowNext = true;
                            scope.data.CountryID1 = 14;
                            scope.data.Title = verifyData.Title;
                            scope.data.Gender = verifyData.Gender;
                            scope.data.Address1 = verifyData.Address1;
                            scope.data.Address2 = verifyData.Address2;
                            scope.data.Suburb = verifyData.Suburb;
                            scope.data.Postcode = verifyData.Postcode;
                            scope.data.State = verifyData.State;
                            scope.data.HomePhoneNumber = verifyData.HomePhoneNumber == "" || verifyData.HomePhoneNumber == null ? null : verifyData.HomePhoneNumber;
                        }
                        else {
                            checkPhone(verifyData);
                        }
                    }, function(err) {
                        console.log(err);
                        scope.loadingCheck = false;
                        scope.er = {};
                        scope.ermsg = {};
                        toastr.error("Please check data again.", "ERROR");
                        for (var i = 0; i < err.length; i++) {
                            scope.er[err[i].field] = { 'border': '2px solid #DCA7B0' };
                            scope.ermsg[err[i].field] = err[i].message;
                        }
                    });
                }
            };
            //Cancel : cancel create patient
            scope.Cancel = function() {
                if (scope.appointment) {
                    scope.appointment.runIfClose();
                }
                else if(scope.staff){
                    scope.staff.runIfClose();
                }
                else if(scope.cancel) {
                    scope.cancel();
                }
                else {
                    $state.go('authentication.patient.list', null, {
                        'reload': true
                    });
                }
            };

            console.log('rolecompany ',scope.rolecompany,' compid ',scope.compid,' RoleId ',scope.RoleId, ' ishaveusername ',scope.ishaveusername);


            //CreatePatient : create patient
            //input : data information
            //output:
            //****create UserAccount to create Patient if validate data success
            //and show notification success
            //****show notification error if validate data error
            scope.createPatient = function(data, company) {
                scope.loadingCreate = true;
                //service check data
                return PatientService.validate(data)
                    .then(function(result) {
                        data.rolecompany     = scope.rolecompany;
                        data.compid          = scope.compid?scope.compid:null;
                        data.RoleId          = scope.RoleId?scope.RoleId:null;
                        if(data.HomePhoneNumber) data.HomePhoneNumber = data.HomePhoneNumber.replace(/[\(\)\s\-]/g,'');
                        if(data.WorkPhoneNumber) data.WorkPhoneNumber = data.WorkPhoneNumber.replace(/[\(\)\s\-]/g,'');
                        //service call API create patient
                        return PatientService.createPatient(data)
                            .then(function(success) {
                                console.log(success);
                                scope.loadingCreate = false;
                                //check if patient has avatar, upload avatar
                                if (scope.uploader.queue[0] !== undefined && scope.uploader.queue[0] !== null &&
                                    scope.uploader.queue[0] !== '' && scope.uploader.queue[0].length !== 0) {
                                    scope.uploader.queue[0].formData[0].userUID = success.data.UserAccountUID;
                                    scope.uploader.queue[0].headers.userUID = success.data.UserAccountUID;
                                    scope.uploader.queue[0].headers.fileType = scope.uploader.queue[0].formData[0].fileType;
                                    scope.uploader.uploadAll();
                                }
                                //*****check if appointment uses this directive
                                //run function success transmission from appointment
                                //****else show notification success and back state list patient
                                if (scope.appointment) {

                                    if(company == 'company' && scope.iscompanycreate == false){
                                        var modalInstance = $uibModal.open({
                                            templateUrl: 'companyLinkmodal',
                                            controller: function($scope,$modalInstance){
                                                $scope.patientuid = success.data.UID;
                                                $scope.cancel = function(){
                                                    $modalInstance.dismiss('cancel');
                                                    scope.appointment.runIfSuccess(success.data);
                                                };
                                            },
                                            // windowClass: 'app-modal-window'
                                            size: 'lg',

                                        });
                                    }
                                    else {
                                        scope.appointment.runIfSuccess(success.data);
                                    }

                                }else if(scope.staff){

                                    if(company == 'company' && scope.iscompanycreate == false){
                                        var modalInstance = $uibModal.open({
                                            templateUrl: 'companyLinkmodal',
                                            controller: function($scope,$modalInstance){
                                                $scope.patientuid = success.data.UID;
                                                $scope.cancel = function(){
                                                    $modalInstance.dismiss('cancel');
                                                    scope.staff.runIfSuccess(success.data);
                                                };
                                            },
                                            // windowClass: 'app-modal-window'
                                            size: 'lg',

                                        });
                                    }
                                    else {
                                        scope.staff.runIfSuccess(success.data);
                                    }

                                }else if(scope.rolecompany == true) {

                                    scope.reset();

                                }else {
                                    console.log("here ", scope.iscompanycreate);
                                    if(company == 'company' && scope.iscompanycreate == false){
                                        var modalInstance = $uibModal.open({
                                            templateUrl: 'companyLinkmodal',
                                            controller: function($scope,$modalInstance){
                                                $scope.patientuid = success.data.UID;
                                                $scope.cancel = function(){
                                                    $modalInstance.dismiss('cancel');
                                                    toastr.success("Create Successful!!", "SUCCESS");
                                                    $state.go('authentication.patient.list', null, {
                                                        'reload': true
                                                    });
                                                };
                                            },
                                            // windowClass: 'app-modal-window'
                                            size: 'lg',

                                        });
                                    }
                                    else {
                                        toastr.success("Create Successful!!", "SUCCESS");
                                        $state.go('authentication.patient.list', null, {
                                            'reload': true
                                        });
                                    }
                                };
                            }, function(err) {
                                scope.er = {};
                                scope.ermsg = {};
                                scope.loadingCreate = false;
                                // Email.duplicate
                                toastr.error("Please check data again.", "ERROR");
                                if (err.data.message.ErrorsList[0].field != undefined) {
                                    for (var i = 0; i < err.data.message.ErrorsList.length; i++) {
                                        scope.er[err.data.message.ErrorsList[i].field] = { 'border': '2px solid #DCA7B0' };
                                        scope.ermsg[err.data.message.ErrorsList[i].field] = err.data.message.ErrorsList[i].message;
                                    }
                                } else {
                                    for (var i = 0; i < err.data.message.ErrorsList.length; i++) {
                                        scope.er[err.data.message.ErrorsList[i].path] = { 'border': '2px solid #DCA7B0' };
                                        scope.ermsg[err.data.message.ErrorsList[i].path] = "invalid value";
                                    }
                                }
                            });
                    }, function(err) {
                        scope.loadingCreate = false;
                        scope.er = {};
                        scope.ermsg = {};
                        toastr.error("Please check data again.", "ERROR");
                        scope.er = scope.er ? scope.er : {};
                        for (var i = 0; i < err.length; i++) {
                            scope.er[err[i].field] = { 'border': '2px solid #DCA7B0' };
                            scope.ermsg[err[i].field] = err[i].message;
                        }
                    });
            };

            scope.checkDataNull = function(name) {
                if (scope.data[name].length == 0)
                    scope.data[name] = null;
            };

            scope.typeFile;
            scope.setType = function(value) {
                scope.typeFile = value;
                if (value == "ProfileImage") {
                    var imageAvatar = document.getElementById('imageAvatar');
                    imageAvatar.addEventListener('change', function(e) {
                        var canvas = document.getElementById('imageAvatarCanvas');
                        var ctx = canvas.getContext('2d');
                        var blank = document.createElement('canvas');
                        blank.width = canvas.width;
                        blank.height = canvas.height;
                        if(canvas.toDataURL() == blank.toDataURL()) {
                            scope.buildImg(imageAvatar, canvas, ctx, e, 350, 350);
                        }
                        else {
                            ctx.clearRect(0, 0, 350, 350);
                            scope.buildImg(imageAvatar, canvas, ctx, e, 350, 350);
                        }
                        // scope.buildImg(imageAvatar, canvas, ctx, e, 350, 350);
                    }, false);
                }
            };


            scope.Remove = function(value) {
                delete scope.info['changeimg'];
                for (var i = 0; i < scope.uploader.queue.length; i++) {
                    if (scope.uploader.queue[i].formData[0].fileType == value) {
                        scope.uploader.queue.splice(i, 1);
                    }
                }
                if (value == "ProfileImage") {
                    $('#imageAvatar').val('');
                    $('#imageAvatarCanvas').val('');
                    scope.isChoseAvatar = false;
                }
            }

        },
        templateUrl: "modules/patient/directives/template/patientCreate.html"
    }
});
