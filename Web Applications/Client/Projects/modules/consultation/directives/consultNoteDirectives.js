var app = angular.module('app.authentication.consultation.directives.consultNoteDirectives', []);
app.directive('consultNote', function(consultationServices, $modal, $cookies, $state, $stateParams, toastr, $timeout, FileUploader, $rootScope) {
    return {
        restrict: 'E',
        scope: {
            consultationuid: '='
        },
        templateUrl: "modules/consultation/directives/templates/consultNoteDirectives.html",
        controller: function($scope) {
            $scope.checkRoleUpdate = true;
            var Window;
            if ($cookies.getObject('userInfo').roles[0].RoleCode == 'INTERNAL_PRACTITIONER') {
                $scope.checkRoleUpdate = false;
            };
            $scope.requestInfo = {
                UID: $stateParams.UID,
                Consultations: [{
                    FileUploads: [],
                    ConsultationData: []
                }],

            }
            $scope.FileUploads = [];
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
                } else {
                    $scope.updateConsultation();
                }
            };

            $scope.ConsultationData;
            $scope.$watch('consultationuid', function(newValue, oldValue) {
                if (newValue !== undefined) {
                    consultationServices.detailConsultation(newValue).then(function(response) {
                        $scope.requestInfo = null;
                        $scope.requestOther = {};
                        if (response.data !== null) {
                            $scope.loadData(response.data);
                        } else {
                            toastr.error("Detail Empty");
                            $scope.Reset();
                        };
                    }, function(err) {
                        o.loadingPage(false);
                        toastr.error('Detail Consultation Fail');
                    });
                };
            });

            $scope.Reset = function() {
                $state.go("authentication.consultation.detail.consultNote", {}, {
                    reload: true
                });
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
                        if (valueRes.Name == 'US' || valueRes.Name == 'MRI' || valueRes.Name == 'PetScan' || valueRes.Name == 'CT') {
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
                $scope.ConsultationData = data.ConsultationData;
                $scope.requestInfo.Consultations[0].FileUploads = $scope.FileUploads;
            }

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
                }, function(err) {
                    o.loadingPage(false);
                    toastr.error('Create Consultation Fail');
                });
            }
            $scope.updateConsultation = function() {
                $scope.ConsultationUpdate();
                var UID = angular.copy($scope.requestInfo.Consultations[0].UID);
                o.loadingPage(true);
                consultationServices.updateConsultation($scope.requestInfo).then(function(response) {
                    if (response == 'success') {
                        o.loadingPage(false);
                        consultationServices.detailConsultation(UID).then(function(response) {
                            $scope.uploader.clearQueue();
                            $scope.requestInfo = null;
                            $scope.requestOther = {};
                            if (response.data !== null) {
                                toastr.success('Update Success');
                                $scope.loadData(response.data);
                            } else {
                                toastr.error("data error");
                            };
                        });
                    };
                }, function(err) {
                    o.loadingPage(false);
                    toastr.error('update Consultation Fail');
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
                        if (object.Value !== null) {
                            if (valueTemp.Section == object.Section &&
                                valueTemp.Category == object.Category &&
                                valueTemp.Type == object.Type &&
                                valueTemp.Name == object.Name) {
                                isExist = true;
                            }
                        } else {
                            isExist = true;
                        };
                    });
                    if (!isExist) {
                        if (object.Value !== null) {
                            ConsultationDataTemp.push(object);
                        };
                    };
                };
                $scope.requestInfo.Consultations[0].ConsultationData = ConsultationDataTemp;
                $scope.requestInfo.Consultations[0].FileUploads = $scope.requestInfo.Consultations[0].FileUploads.concat($scope.FileUploads);
            }
            $scope.ConsultationUpdate = function() {
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
                    $scope.ConsultationData.forEach(function(valueTemp, keyTemp) {
                        if (valueTemp.Section == object.Section &&
                            valueTemp.Category == object.Category &&
                            valueTemp.Type == object.Type &&
                            valueTemp.Name == object.Name) {
                            if (object.Value !== null){
                                valueTemp.Value = object.Value;
                                valueTemp.FileUploads = object.FileUploads;
                                object = valueTemp;
                                ConsultationDataTemp.push(object); 
                            };

                        };
                    });
                     ConsultationDataTemp.forEach(function(valueTemp, keyTemp) {
                         if (object.Value !== null) {
                             if (valueTemp.Section == object.Section &&
                                 valueTemp.Category == object.Category &&
                                 valueTemp.Type == object.Type &&
                                 valueTemp.Name == object.Name) {
                                 valueTemp.Value = object.Value;
                                 isExist = true;
                             };
                         }else{
                              isExist = true;
                         }
                     });
                    if (!isExist) {
                         if (object.Value !== null) {
                             ConsultationDataTemp.push(object); 
                         };
                     };
                };
                $scope.requestInfo.Consultations[0].ConsultationData = ConsultationDataTemp;
            }
            $scope.cancel = function() {
                $state.go("authentication.consultation.detail", {
                    UID: $stateParams.UID,
                    UIDPatient: $stateParams.UIDPatient
                });
            }
            $scope.CheckBox = function(data, type) {
                if (!$scope.requestInfo[type]) {
                    if ($scope.requestInfo.Consultations[0].ConsultationData[data] !== undefined) {
                        $scope.requestInfo.Consultations[0].ConsultationData[data].Value = null;
                    } else {
                        $scope.requestInfo.Consultations[0].ConsultationData[data] = {}
                        if ($scope.requestInfo.Consultations[0].ConsultationData[data].Value == undefined) {
                            $scope.requestInfo.Consultations[0].ConsultationData[data].Value = null;
                        };
                    };

                };
            }
            $scope.showImage = function(UID) {
                var LinkUID = UID;
                var modalInstance = $modal.open({
                    templateUrl: 'showImageTemplate',
                    controller: 'showImageController',
                    windowClass: 'app-modal-window-full',
                    resolve: {
                        LinkUID: function() {
                            return LinkUID;
                        }
                    }
                });
                modalInstance.result.then(function(data) {
                    $modalInstance.close('err');
                });
            };
            $scope.closeWindow = function(fileInfo) {
                Window.close();
            }
            $scope.RemoveDrawing = function(index){
                $scope.FileUploads.splice(index,1);
            }
            $scope.AddDrawing = function(data) {
                if (typeof(Window) == 'undefined' || Window.closed) {
                    window.refreshCode = $rootScope.refreshCode;
                    Window = window.open($state.href("blank.drawing.home"), "", "fullscreen=0");
                } else {
                    Window.focus();
                }
            }
        }
    };
});

app.controller('showDrawingController', function($scope, $modalInstance, toastr, data, CommonService, $cookies) {
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.drawingData = {
        userUID: $cookies.getObject('userInfo').UID,
        fileType: 'MedicalDrawing'
    };
    $scope.drawingAction = function(fileInfo) {
        $modalInstance.close(fileInfo);
    }
});
