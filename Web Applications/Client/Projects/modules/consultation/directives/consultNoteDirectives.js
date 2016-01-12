var app = angular.module('app.authentication.consultation.directives.consultNoteDirectives', []);
app.directive('consultNote', function(consultationServices, $modal, $cookies, $state, $stateParams, toastr, $timeout, FileUploader, $rootScope) {
    return {
        restrict: 'E',
        scope: {
            consultationuid: '='
        },
        templateUrl: "modules/consultation/directives/templates/consultNoteDirectives.html",
        controller: function($scope) {
            $scope.requestInfo = {
                UID: $stateParams.UID,
                Consultations: [{
                    FileUploads: [],
                    ConsultationData: []
                }],

            }
            $scope.requestOther = {};
            $scope.CheckUpdate = true;
            $timeout(function() {
                App.initAjax();
            })
            var uploader = $scope.uploader = new FileUploader({
                url: o.const.uploadFileUrl,
                withCredentials: true,
                alias: 'uploadFile'
            });
            $scope.SendRequestUploadFile = function() {
                console.log('uploader', uploader);
                uploader.uploadAll();
            }
            uploader.filters.push({
                name: 'customFilter',
                fn: function(item /*{File|FileLikeObject}*/ , options) {
                    return this.queue.length < 10;
                }
            });

            console.log("FileUploader", FileUploader);
            uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
                //console.info('onWhenAddingFileFailed', item, filter, options);
            };
            uploader.onAfterAddingFile = function(fileItem) {
                //console.info('onAfterAddingFile', fileItem);
            };
            uploader.onAfterAddingAll = function(addedFileItems) {
                //console.info('onAfterAddingAll', addedFileItems);
            };
            uploader.onBeforeUploadItem = function(item) {
                item.headers = {
                    Authorization: ('Bearer ' + $cookies.get("token")),
                    systemtype: 'WEB'
                };
                item.formData[0] = {};
                item.formData[0].userUID = $cookies.getObject('userInfo').UID;
                item.formData[0].fileType = 'MedicalImage';
                console.info('onBeforeUploadItem', item);
            };
            uploader.onProgressItem = function(fileItem, progress) {
                //console.info('onProgressItem', fileItem, progress);
            };
            uploader.onProgressAll = function(progress) {
                //console.info('onProgressAll', progress);
            };
            uploader.onSuccessItem = function(fileItem, response, status, headers) {
                console.info('onSuccessItem', fileItem, response, status, headers);
            };
            uploader.onErrorItem = function(fileItem, response, status, headers) {
                // console.info('onErrorItem', fileItem, response, status, headers);
                if (Boolean(headers.requireupdatetoken) === true) {
                    $rootScope.getNewToken();
                }
            };
            uploader.onCancelItem = function(fileItem, response, status, headers) {
                //console.info('onCancelItem', fileItem, response, status, headers);
            };
            uploader.onCompleteItem = function(fileItem, response, status, headers) {
                console.info('onCompleteItem', fileItem, response, status, headers);
                if (Boolean(headers.requireupdatetoken) === true) {
                    $rootScope.getNewToken();
                }
                if (response.status == 'success') {
                    if (!$scope.requestInfo.Consultations[0].FileUploads) {
                        $scope.requestInfo.Consultations[0].FileUploads = [];
                    };
                    $scope.requestInfo.Consultations[0].FileUploads.push({
                        UID: response.fileUID
                    });
                };
            };
            uploader.onCompleteAll = function() {
                if ($scope.CheckUpdate) {
                    $scope.createConsultation();
                }
                else {
                    $scope.updateConsultation();
                }
            };

            $scope.ConsultationData;
            $scope.$watch('consultationuid', function(newValue, oldValue) {
                if (newValue !== undefined) {
                    consultationServices.detailConsultation(newValue).then(function(response) {
                        console.log(response.data)
                        if (response.data !== null) {
                             $scope.requestInfo = null;
                             $scope.requestOther = {};
                             $scope.loadData(response.data);
                        };
                    });
                };
            });

            $scope.Reset = function() {
                $state.go("authentication.consultation.detail.consultNote",{},{reload: true});
            }
            $scope.loadData = function(data) {
                $timeout(function() {
                    $.uniform.update();
                }, 0);
                $scope.CheckUpdate = false;
                $scope.FileUploads = angular.copy(data.FileUploads);
                $scope.requestInfo = {
                    UID: $stateParams.UID,
                    Consultations: [{
                        UID: data.UID,
                        ConsultationData: []
                    }]
                }
                $scope.Temp = angular.copy(data.ConsultationData);
                $scope.Temp.forEach(function(valueRes, indexRes) {
                    if (valueRes != null && valueRes != undefined) {
                        var keyClinicalDetail = valueRes.Section + '.' + valueRes.Category + '.' + valueRes.Type + '.' + valueRes.Name;
                        keyClinicalDetail = keyClinicalDetail.split(" ").join("__");
                        var keyOther = valueRes.Type + valueRes.Name;
                        if (keyOther != 0) {
                            keyOther = keyOther.split(" ").join("");
                        }
                        $scope.requestInfo.Consultations[0].ConsultationData[keyClinicalDetail] = {};
                        if (valueRes.Name == 'US' || valueRes.Name == 'MRI' || valueRes.Name == 'PetScan') {
                            if (valueRes.Value !== 'WD' && valueRes.Value !== 'ENVISION' && valueRes.Value !== 'INSIGHT') {
                                $scope.requestInfo.Consultations[0].ConsultationData[keyClinicalDetail].Value = 'OtherProvider';
                                $scope.requestOther[keyOther + 'Other'] = valueRes.Value;
                            } else {
                                $scope.requestInfo.Consultations[0].ConsultationData[keyClinicalDetail].Value = valueRes.Value;
                            };
                        } else {
                            $scope.requestInfo.Consultations[0].ConsultationData[keyClinicalDetail].Value = valueRes.Value;
                        };

                        $scope.requestInfo.Consultations[0].ConsultationData[keyClinicalDetail].FileUploads = valueRes.FileUploads;
                        $scope.requestOther[keyOther] = true;
                    }
                })
                console.log('other',$scope.requestOther)
                $scope.ConsultationData = data.ConsultationData;
                $scope.requestInfo.Consultations[0].FileUploads = $scope.FileUploads;
            }

            $scope.consultNote = {
                OTHER: false,
                OTHER_TEXTBOX: null,
                DDX: {
                    BCC: false,
                    SCC: true,
                    Melanonia: false,
                    Merkel: false,
                    Other: false,
                    OtherTextbox: null,
                },
                Further_Investigation: {
                    // US
                    US: false,
                    US_WD: false,
                    US_ENVISION: false,
                    US_INSIGHT: false,
                    US_Other: false,
                    US_OtherTextbox: null,
                    // CT
                    CT: false,
                    CT_WD: false,
                    CT_ENVISION: false,
                    CT_INSIGHT: false,
                    CT_Other: false,
                    CT_OtherTextbox: null,
                    // MRI
                    MRI: false,
                    MRI_WD: false,
                    MRI_ENVISION: false,
                    MRI_INSIGHT: false,
                    MRI_Other: false,
                    MRI_OtherTextbox: null,
                    // PET_scan
                    PET_scan: false,
                    PET_scan_WD: false,
                    PET_scan_ENVISION: false,
                    PET_scan_INSIGHT: false,
                    PET_scan_Other: false,
                    PET_scan_OtherTextbox: null,
                },
            };

            $scope.Create = function() {
                (($scope.uploader.queue.length > 0) ? $scope.SendRequestUploadFile() : $scope.createConsultation());
            }
            $scope.Update = function() {
                (($scope.uploader.queue.length > 0) ? $scope.SendRequestUploadFile() : $scope.updateConsultation());
            }
            $scope.createConsultation = function() {
                $scope.ConsultationDataCreate();
                console.log($scope.requestInfo)
                o.loadingPage(true);
                consultationServices.createConsultation($scope.requestInfo).then(function(response) {
                    if (response == 'success') {
                        o.loadingPage(false);
                        $state.go("authentication.consultation.detail", {
                            UID: $stateParams.UID,
                            UIDPatient: $stateParams.UIDPatient
                        });
                        toastr.success("Success");
                    };

                });
            }
            $scope.updateConsultation = function() {
                $scope.ConsultationUpdate();
                console.log($scope.requestInfo)
                o.loadingPage(true);
                consultationServices.updateConsultation($scope.requestInfo).then(function(response) {
                    if (response == 'success') {
                        o.loadingPage(false);
                        toastr.success("Update Success");
                        $state.go("authentication.consultation.detail.consultNote",{},{reload: true});
                    };
                });
            }
            $scope.ConsultationDataCreate = function() {
                var ConsultationDataTemp = [];
                for (var key in $scope.requestInfo.Consultations[0].ConsultationData) {
                    var newkey = key.split("__").join(" ");
                    var res = newkey.split(".");
                    var otherkey = res[2] + res[3] + 'Other';
                    var object = {
                        Section: res[0],
                        Category: res[1],
                        Type: res[2],
                        Name: res[3],
                        Value: ($scope.requestInfo.Consultations[0].ConsultationData[key].Value == 'OtherProvider') ? $scope.requestOther[otherkey] : $scope.requestInfo.Consultations[0].ConsultationData[key].Value,
                        FileUploads: $scope.requestInfo.Consultations[0].ConsultationData[key].FileUploads
                    };
                    var isExist = false;

                    ConsultationDataTemp.forEach(function(valueTemp, keyTemp) {
                        if (valueTemp.Section == object.Section &&
                            valueTemp.Category == object.Category &&
                            valueTemp.Type == object.Type &&
                            valueTemp.Name == object.Name) {
                            isExist = true;
                        };
                    });
                    if (!isExist) {
                        ConsultationDataTemp.push(object);
                    };
                };
                $scope.requestInfo.Consultations[0].ConsultationData = ConsultationDataTemp;
            }
            $scope.ConsultationUpdate = function() {
                var ConsultationDataTemp = angular.copy($scope.ConsultationData);
                for (var key in $scope.requestInfo.Consultations[0].ConsultationData) {
                    var newkey = key.split("__").join(" ");
                    var res = newkey.split(".");
                    var otherkey = res[2] + res[3] + 'Other';
                    var object = {
                        Section: res[0],
                        Category: res[1],
                        Type: res[2],
                        Name: res[3],
                        Value: ($scope.requestInfo.Consultations[0].ConsultationData[key].Value == 'OtherProvider') ? $scope.requestOther[otherkey] : $scope.requestInfo.Consultations[0].ConsultationData[key].Value,
                        FileUploads: $scope.requestInfo.Consultations[0].ConsultationData[key].FileUploads
                    };
                    var isExist = false;
                    $scope.ConsultationData.forEach(function(valueTemp, keyTemp) {
                        if (valueTemp.Section == object.Section &&
                            valueTemp.Category == object.Category &&
                            valueTemp.Type == object.Type &&
                            valueTemp.Name == object.Name) {
                            valueTemp.Value = object.Value;
                            valueTemp.FileUploads = object.FileUploads;
                            object = valueTemp;
                        };
                    });
                    ConsultationDataTemp.forEach(function(valueTemp, keyTemp) {
                        if (valueTemp.Section == object.Section &&
                            valueTemp.Category == object.Category &&
                            valueTemp.Type == object.Type &&
                            valueTemp.Name == object.Name) {
                            valueTemp.Value = object.Value;
                            isExist = true;
                        };
                    });
                    if (!isExist) {
                        ConsultationDataTemp.push(object);
                    };
                };
                var ConsultationDataTempFinal = angular.copy(ConsultationDataTemp)
                 ConsultationDataTemp.forEach(function(valueTemp, keyTemp) {
                    if(valueTemp.Value == null){
                        ConsultationDataTempFinal.splice(keyTemp,1)
                    };
                });
                $scope.requestInfo.Consultations[0].ConsultationData = ConsultationDataTempFinal;
            }
            $scope.CheckBox = function(data){
                if ($scope.requestInfo.Consultations[0].ConsultationData[data] !== undefined) {
                    $scope.requestInfo.Consultations[0].ConsultationData[data].Value = null;
                };
            }
        }
    };
})
