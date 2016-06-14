var app = angular.module('app.authentication.consultation.directives.consultNoteDirectives', []);
app.directive('consultNote', function(consultationServices, $modal, $cookies, $state, $stateParams, toastr, $timeout, FileUploader, $rootScope) {
    return {
        restrict: 'E',
        scope: {
            consultationuid: '='
        },
        templateUrl: "modules/consultation/directives/templates/consultNoteDirectives.html",
        controller: function($scope) {
            $scope.relevantGroup = {
                0: {name: 0},
                // 1: {name: 1}
            };
            $scope.addRelevantGroup = function () {
                var maxKey = 0;
                for(key in $scope.relevantGroup) {
                    if(parseInt(key) > maxKey)
                        maxKey = parseInt(key);
                }
                $scope.relevantGroup[maxKey+1] = {
                    name: maxKey+1
                };
            };
            $scope.parseInt = parseInt;
            $scope.setCurrentRelevantGroup = function(key) {
                //Key cua consultationData FileUpload
                $scope.currentRelevantFileUploadKey = 'Consultation__Details.Appointment.Relevant.FileUploads.'+key;
                //index cua relevant group
                $scope.currentRelevantGroupKey = key;
            }
            $scope.selectImage = function(key) {
                $scope.setCurrentRelevantGroup(key);
            };
            $scope.checkRoleUpdate = true;
            $scope.DataPrintPDF = null;
            var Window;
            for(var i = 0; i < $cookies.getObject('userInfo').roles.length; i++){
                console.log("22222")
                if ($cookies.getObject('userInfo').roles[i].RoleCode == 'INTERNAL_PRACTITIONER') {
                    console.log("111111")
                    $scope.checkRoleUpdate = false;
                };
            }
            $scope.requestInfo = {
                UID: $stateParams.UID,
                Consultations: [{
                    // FileUploads: [],// tan comment
                    ConsultationData: []
                }],

            }
            $scope.FileUploads = [];
            //tan custom
            //Chi dung cho viec hien thi file va drawing dung vi tri
            $scope.relevantFileUploads = {
                //0: [],
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
            uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
                //console.info('onWhenAddingFileFailed', item, filter, options);
            };
            uploader.onAfterAddingFile = function(fileItem) {
                fileItem.relevantGroupKey = $scope.currentRelevantGroupKey;
                fileItem.relevantFileUploadKey = $scope.currentRelevantFileUploadKey;
                console.info('onAfterAddingFile', fileItem);
            };
            uploader.onAfterAddingAll = function(addedFileItems) {
                //console.info('onAfterAddingAll', addedFileItems);
            };
            uploader.onBeforeUploadItem = function(item) {
                item.headers.systemtype = 'WEB';
                item.headers.Authorization = ('Bearer ' + $cookies.get("token"));
                item.headers.userUID = $cookies.getObject('userInfo').UID;
                item.headers.fileType = 'MedicalImage';
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
                    //Tan comment
                    /*if (!$scope.requestInfo.Consultations[0].FileUploads) {
                        $scope.requestInfo.Consultations[0].FileUploads = [];
                    };
                    $scope.requestInfo.Consultations[0].FileUploads.push({
                        UID: response.fileUID
                    });*/
                    
                    //tan custom
                    if(!$scope.requestInfo.Consultations[0].ConsultationData[fileItem.relevantFileUploadKey]) {
                        $scope.requestInfo.Consultations[0].ConsultationData[fileItem.relevantFileUploadKey] = {
                            FileUploads: [],
                            Value: 0
                        };
                    }
                    $scope.requestInfo.Consultations[0].ConsultationData[fileItem.relevantFileUploadKey].FileUploads.push({
                       UID: response.fileUID
                    });
                    $scope.requestInfo.Consultations[0].ConsultationData[fileItem.relevantFileUploadKey].FileUploads.Value = $scope.requestInfo.Consultations[0].ConsultationData[fileItem.relevantFileUploadKey].FileUploads.length;

                    console.log( ' fileupload:onCompleteItem: $scope.requestInfo.Consultations[0].ConsultationData',  $scope.requestInfo.Consultations[0].ConsultationData);
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
                        console.log(response)
                        $scope.requestInfo = null;
                        $scope.requestOther = {};
                        if (response.data !== null) {
                            $scope.DataPrintPDF = angular.copy(response.data)
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
            $scope.dataPrintType = {
                    'Consultation__Details.Appointment.History.immunosuppressionValue': 'radio',
                    'Consultation__Details.Appointment.History.immunosuppression': 'string',
                    'Consultation__Details.Appointment.History.Melanoma': 'radio',
                    'Consultation__Details.Appointment.History.CellAquamous': 'radio',
                    'Consultation__Details.Appointment.History.ConcernedAbout': 'radio',
                    'Consultation__Details.Appointment.History.ConcernedAboutValue': 'string',
                    'Consultation__Details.Appointment.History.HaditChanged': 'radio',
                    'Consultation__Details.Appointment.History.PleaseDescribe': 'string',
                    'Consultation__Details.Appointment.History.SkinCancer': 'radio',
                    'Consultation__Details.Appointment.History.IfYesMelanoma': 'radio',
                    'Consultation__Details.Appointment.Relevant.Biopsiedproven': 'radio',
                    'Consultation__Details.Appointment.Relevant.Site':'string',
                    'Consultation__Details.Appointment.Relevant.Dimension':'string',
                    'Consultation__Details.Appointment.Relevant.Colour':'string',
                    'Consultation__Details.Appointment.Relevant.Border':'string',
                    'Consultation__Details.Appointment.Relevant.ULCERATION':'radio',
                    'Consultation__Details.Appointment.Relevant.Satellite_Lesion':'radio',
                    'Consultation__Details.Appointment.Relevant.Perineural_Symptoms':'radio',
                    'Consultation__Details.Appointment.Relevant.Relevantother':'checkbox',
                    'Consultation__Details.Appointment.Relevant.RelevantotherValue':'string',
                    'Consultation__Details.Appointment.Relevant.DDX_BCC':'checkbox',
                    'Consultation__Details.Appointment.Relevant.DDX_SCC':'checkbox',
                    'Consultation__Details.Appointment.Relevant.DDX_DdxMelanoma':'checkbox',
                    'Consultation__Details.Appointment.Relevant.DDX_Merkel':'checkbox',
                    'Consultation__Details.Appointment.Relevant.DDX_Ddxother':'checkbox',
                    'Consultation__Details.Appointment.Relevant.DDX_DdxotherValue':'string',
                    'Consultation__Details.Appointment.RECOMMENDATIONS.Biopsy':'checkbox',
                    'Consultation__Details.Appointment.RECOMMENDATIONS.Effudex__/__Aldara':'checkbox',
                    'Consultation__Details.Appointment.RECOMMENDATIONS.Cryotherapy':'checkbox',
                    'Consultation__Details.Appointment.RECOMMENDATIONS.Laser__ablation':'checkbox',
                    'Consultation__Details.Appointment.RECOMMENDATIONS.Surgical__excision':'checkbox',
                    'Consultation__Details.Appointment.RECOMMENDATIONS.Risk__complication':'checkbox',
                    'Consultation__Details.Appointment.RECOMMENDATIONS.Flap':'checkbox',
                    'Consultation__Details.Appointment.RECOMMENDATIONS.Graft':'checkbox',
                    'Consultation__Details.Appointment.RECOMMENDATIONS.SSG':'checkbox',
                    'Consultation__Details.Appointment.RECOMMENDATIONS.FTSG':'checkbox',
                    'Consultation__Details.Appointment.Suithble__for.Specialist':'checkbox',
                    'Consultation__Details.Appointment.Suithble__for.SpecialistValue':'string',
                    'Consultation__Details.Appointment.Suithble__for.Telehealth':'checkbox',
                    'Consultation__Details.Appointment.Suithble__for.TelehealthValue':'string',
                    'Consultation__Details.Appointment.Relevant.FileUploads':'normal_image'
            };
            $scope.arrayNames = ["Consultation__Details.Appointment.Relevant"];

            $scope.dataPrintResultStep0 = {};
            $scope.dataPrintResultStep1 = {};
            $scope.dataPrintResultStep2 = [];

            $scope.mapName = function (object) {
                for (var key in $scope.dataPrintType) {
                    if(object.dataKey.indexOf(key) >= 0) {
                        if(!$scope.dataPrintResultStep0[key])
                            $scope.dataPrintResultStep0[key] = {};
                        if(!$scope.dataPrintResultStep0[key][object.Description])
                            $scope.dataPrintResultStep0[key][object.Description] = {
                                Name: key,
                                Type: $scope.dataPrintType[key]
                            };
                        if(key == 'Consultation__Details.Appointment.Relevant.FileUploads') {
                            if(object.FileUploads && object.FileUploads[0])
                                $scope.dataPrintResultStep0[key][object.Description].Value = object.FileUploads[0].UID;
                            else
                                $scope.dataPrintResultStep0[key][object.Description].Value = null;
                        }
                        else {
                            $scope.dataPrintResultStep0[key][object.Description].Value = object.Value;
                        }
                    }
                }
            };

            /**
             * Parse data mapping voi $scope.dataPrintType
             * {
             *      ...,
             *      Consultation__Details.Appointment.Relevant.Biopsiedproven: {
             *          0: {
             *              Name:
             *              Type:
             *              Value
             *          },
             *          1: {
             *
             *          },
             *          ...
             *      },
             *      ...
             * }
             * image: https://drive.google.com/open?id=0Bz29ZPfG4pnHb2V4OE5MSHRlM2M
             *
             */
            $scope.parsePrintDataStep0 = function (ConsultationDataTemp) {
                for(var i = 0; i < ConsultationDataTemp.length; i++) {
                    $scope.mapName(ConsultationDataTemp[i]);
                }
            }

            /**
             * Parse Data ve dang giong array:
             * {
             *      ...
             *      Consultation__Details.Appointment.Relevant: {
             *          0: {
             *              Consultation__Details.Appointment.Relevant.Biopsiedproven: {
             *                  name:
             *                  value:
             *                  type:
             *
             *              },
             *              ...
             *          },
             *          ...
             *      },
             *      ...
             *
             * }
             *
             * image: https://drive.google.com/open?id=0Bz29ZPfG4pnHQW1pZC1jWVdVVmc
             */
            $scope.parsePrintDataStep1 = function () {

                for (var key in $scope.dataPrintResultStep0) {
                    var check = false;

                    for (var i = 0; i < $scope.arrayNames.length; i++) {
                        if(key.indexOf($scope.arrayNames[i]) >= 0) {
                            check = true;
                            var name = key.substring($scope.arrayNames[i].length+1,key.length);
                            if(!$scope.dataPrintResultStep1[$scope.arrayNames[i]]) { //$scope.dataPrintResultStep1[Consultation__Details.Appointment.Relevant]
                                $scope.dataPrintResultStep1[$scope.arrayNames[i]] = {

                                }
                            }

                            for (var subkey in $scope.dataPrintResultStep0[key]) { //$scope.dataPrintResultStep0[Consultation__Details.Appointment.Relevant.0 .1 .2]
                                if(!$scope.dataPrintResultStep1[$scope.arrayNames[i]][subkey])
                                    $scope.dataPrintResultStep1[$scope.arrayNames[i]][subkey] = {};
                                $scope.dataPrintResultStep1[$scope.arrayNames[i]][subkey][key] = {
                                    name: key,
                                    type: $scope.dataPrintResultStep0[key][subkey].Type,
                                    value: $scope.dataPrintResultStep0[key][subkey].Value
                                };
                            }
                        }
                    }
                    if(!check) {
                        for (var subkey in $scope.dataPrintResultStep0[key]) {
                            $scope.dataPrintResultStep1[key] = {
                                name: key,
                                type: $scope.dataPrintResultStep0[key][subkey].Type,
                                value: $scope.dataPrintResultStep0[key][subkey].Value
                            }
                            break;
                        }
                    }
                }
            };

            /**
             * Parse print data ve array:
             * [
             *      ...,
             *      {
             *          name:
             *          type:
             *          value:
             *      },
             *      ...
             * ]
             * image : https://drive.google.com/file/d/0Bz29ZPfG4pnHUXBMUkQzY2d4bTA/view?usp=sharing
             */
            $scope.parsePrintDataStep2 = function () {
                for (var key in $scope.dataPrintResultStep1) {
                    for (var i = 0; i < $scope.arrayNames.length; i++) {
                        if (key.indexOf($scope.arrayNames[i]) >= 0) {
                            var arr = [];
                            for (var subkey in $scope.dataPrintResultStep1[key]) {
                                var arrItem = [];
                                for(var itemKey in $scope.dataPrintResultStep1[key][subkey]) {
                                    var item = {
                                        name: itemKey,
                                        type: $scope.dataPrintResultStep1[key][subkey][itemKey].type,
                                        value: $scope.dataPrintResultStep1[key][subkey][itemKey].value,
                                    }
                                    arrItem.push(item);
                                }
                                arr.push(arrItem);

                            }
                            $scope.dataPrintResultStep2.push({
                                name: key,
                                type: 'repeat',
                                value: arr
                            })
                        }
                        else {
                            var item = {
                                name: key,
                                type: $scope.dataPrintResultStep1[key].type,
                                value: $scope.dataPrintResultStep1[key].value,
                            }
                            $scope.dataPrintResultStep2.push(item);
                        }
                    }
                }
            }


            $scope.PrintPDF = function() {
                o.loadingPage(true);
                var ConsultationDataTemp = [];
                for (var key in $scope.requestInfo.Consultations[0].ConsultationData) {
                    var newkey = key.split("__").join(" ");
                    var res = newkey.split(".");
                    var otherkey = res[2] + res[3]  + res[4]?res[4]:0 + 'Other';
                    var object = {
                        dataKey: key,
                        Section: res[0],
                        Category: res[1],
                        Type: res[2],
                        Name: res[3],
                        Description: res[4]?res[4]:0,
                        Value: ($scope.requestInfo.Consultations[0].ConsultationData[key].Value == 'OtherProvider') ? $scope.requestOther[otherkey] : $scope.requestInfo.Consultations[0].ConsultationData[key].Value,
                        FileUploads: $scope.requestInfo.Consultations[0].ConsultationData[key].FileUploads
                    };
                    var isExist = false;

                    ConsultationDataTemp.forEach(function(valueTemp, keyTemp) {
                        if (object.Value !== null) {
                            if (valueTemp.Section == object.Section &&
                                valueTemp.Category == object.Category &&
                                valueTemp.Type == object.Type &&
                                valueTemp.Name == object.Name &&
                                valueTemp.Description == object.Description) {
                                isExist = true;
                            }
                        } else {
                            isExist = true;
                        };
                    });
                    if (!isExist) {
                        if (object.Value !== null && object.Value !== "") {
                            ConsultationDataTemp.push(object);
                        };
                    };
                };
                $scope.parsePrintDataStep0(ConsultationDataTemp);
                console.log("parsePrintDataStep0", $scope.dataPrintResultStep0);
                $scope.parsePrintDataStep1();
                console.log("parsePrintDataStep1", $scope.dataPrintResultStep1);
                $scope.parsePrintDataStep2();
                console.log("parsePrintDataStep2", $scope.dataPrintResultStep2);


                consultationServices.getPatientDetail($stateParams.UIDPatient).then(function(response) {
                    var PDFData = null;
                    var postData = angular.copy($scope.dataPrintResultStep2);

                    var firstname = {
                        name: "firstname",
                        value: response.data[0].FirstName,
                        type: 'string'
                    }
                    postData.push(firstname)
                    var lastname = {
                        name: "lastname",
                        value: response.data[0].LastName,
                        type: 'string'
                    }
                    postData.push(lastname)
                    var DOB = {
                        name: "DOB",
                        value: response.data[0].DOB,
                        type: 'string'
                    }
                    postData.push(DOB)
                    var gender = {
                        name: "gender",
                        value: response.data[0].Gender,
                        type: 'string'
                    }
                    postData.push(gender)
                    var consultationdate = {
                        name: "consultation_date",
                        value: moment().format('DD/MM/YYYY'),
                        type: 'string'
                    }
                    postData.push(consultationdate)
                    var dataPost = {
                        printMethod: "jasper",
                        templateUID: "consult_note",
                        data: postData
                    }
                    console.log(">>>>>>>>>>>>>>>>final make data:", dataPost);
                    consultationServices.PrintPDF(dataPost).then(function(responsePrintPDF) {
                        o.loadingPage(false);
                        console.log(responsePrintPDF)
                        var blob = new Blob([responsePrintPDF.data], {
                            type: 'application/pdf'
                        });
                        saveAs(blob, "ConsultationNote_" + response.data[0].FirstName + response.data[0].LastName);
                    }, function(err) {
                        o.loadingPage(false);
                        toastr.error("Print PDF Fail");
                    });
                }, function(err) {
                    o.loadingPage(false);
                    toastr.error("Print PDF Fail");
                });

                //-----------------------------------------------------------------------------------------------------------------------------



                
                /*for (var key in $scope.requestInfo.Consultations[0].ConsultationData) {
                    var newkey = key.split("__").join(" ");
                    var res = newkey.split(".");
                    var otherkey = res[2] + res[3]  + 'Other';
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
                        if (object.Value !== null && object.Value !== "") {
                            ConsultationDataTemp.push(object);
                        };
                    };
                };
                consultationServices.getPatientDetail($stateParams.UIDPatient).then(function(response) {
                    var PDFData = null;
                    var postData = []
                    var PDFData = angular.copy(ConsultationDataTemp);
                    PDFData.forEach(function(valueTemp, keyTemp) {
                        var object = {
                            value: valueTemp.Value,
                            name: valueTemp.Name
                        };
                        postData.push(object)
                    })
                    console.log($scope.requestInfo.Consultations[0].FileUploads)
                    var Image = {
                      name:"consult_note_image",
                      value:($scope.requestInfo.Consultations[0].FileUploads.length > 0)?$scope.requestInfo.Consultations[0].FileUploads[0].UID:""
                    }
                    postData.push(Image)
                    
                    var firstname = {
                        name: "firstname",
                        value: response.data[0].FirstName
                    }
                    postData.push(firstname)
                    var lastname = {
                        name: "lastname",
                        value: response.data[0].LastName
                    }
                    postData.push(lastname)
                    var DOB = {
                        name: "DOB",
                        value: response.data[0].DOB
                    }
                    postData.push(DOB)
                    var gender = {
                        name: "gender",
                        value: response.data[0].Gender
                    }
                    postData.push(gender)
                    var consultationdate = {
                        name: "consultation_date",
                        value: moment().format('DD/MM/YYYY')
                    }
                    postData.push(consultationdate)
                    var dataPost = {
                        printMethod: "jasper",
                        templateUID: "consult_note",
                        data: postData
                    }
                    consultationServices.PrintPDF(dataPost).then(function(responsePrintPDF) {
                        o.loadingPage(false);
                        console.log(responsePrintPDF)
                        var blob = new Blob([responsePrintPDF.data], {
                            type: 'application/pdf'
                        });
                        saveAs(blob, "ConsultationNote_" + response.data[0].FirstName + response.data[0].LastName);
                    }, function(err) {
                        o.loadingPage(false);
                        toastr.error("Print PDF Fail");
                    });
                }, function(err) {
                    o.loadingPage(false);
                    toastr.error("Print PDF Fail");
                });*/
            }
            $scope.Reset = function() {
                $state.go("authentication.consultation.detail.consultNote", {}, {
                    reload: true
                });
            }
            $scope.loadData = function(data) {
                console.log("loadData:data", data);
                $timeout(function() {
                    $.uniform.update();
                }, 0);
                $scope.CheckUpdate = false;
                $scope.FileUploads = angular.copy(data.FileUploads);
                //tan custom
                $scope.relevantFileUploads = {};
                $scope.requestInfo = {
                    UID: $stateParams.UID,
                    Consultations: [{
                        UID: data.UID,
                        ConsultationData: []
                    }]
                }
                $scope.Temp = angular.copy(data.ConsultationData);
                $scope.relevantGroup = {};
                $scope.Temp.forEach(function(valueRes, indexRes) {
                    if (valueRes != null && valueRes != undefined) {
                        //tan custom
                        if(valueRes.Type == 'Relevant')
                        {
                            var desc = valueRes.Description?valueRes.Description:0;
                            $scope.relevantGroup[desc] = {name: desc};
                            if(valueRes.Name == 'FileUploads') {
                                $scope.relevantFileUploads[desc] = angular.copy(valueRes.FileUploads);
                            }
                        }

                        var keyClinicalDetail = valueRes.Section + '.' + valueRes.Category + '.' + valueRes.Type + '.' + valueRes.Name + '.' + (valueRes.Description?valueRes.Description:0);
                        keyClinicalDetail = keyClinicalDetail.split(" ").join("__");
                        var keyOther = valueRes.Type + valueRes.Name + (valueRes.Description?valueRes.Description:0);
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
                console.log("loadData: result $scope.requestInfo.Consultations[0]", $scope.requestInfo.Consultations[0]);
                //$scope.requestInfo.Consultations[0].FileUploads = $scope.FileUploads; //Tan comment
            }

            $scope.Create = function() {
                (($scope.uploader.queue.length > 0) ? $scope.SendRequestUploadFile() : $scope.createConsultation());
            }
            $scope.Update = function() {
                (($scope.uploader.queue.length > 0) ? $scope.SendRequestUploadFile() : $scope.updateConsultation());
            }
            $scope.createConsultation = function() {
                $scope.ConsultationDataCreate();
                if ($scope.requestInfo.Consultations[0].ConsultationData.length !== 0 || $scope.requestInfo.Consultations[0].FileUploads.length !== 0) {
                    //tan comment
                    /*if ($scope.requestInfo.Consultations[0].FileUploads.length !== 0 && $scope.requestInfo.Consultations[0].ConsultationData.length == 0) {
                        var FileUploads = {
                            Category: "Appointment",
                            FileUploads: null,
                            Name: "FileUploads",
                            Section: "Consultation Details",
                            Type: "FileUploads",
                            Value: $scope.requestInfo.Consultations[0].FileUploads.length
                        }
                        $scope.requestInfo.Consultations[0].ConsultationData.push(FileUploads);
                    }*/
                    console.log('$scope.requestInfo', $scope.requestInfo)
                    o.loadingPage(true);
                    consultationServices.createConsultation($scope.requestInfo).then(function(response) {
                        o.loadingPage(false);
                        consultationServices.detailConsultation(response.data[0].UID).then(function(response) {
                            $scope.checkRoleUpdate = false;
                            $scope.uploader.clearQueue();
                            $scope.requestInfo = null;
                            $scope.requestOther = {};
                            if (response.data !== null) {
                                $scope.DataPrintPDF = angular.copy(response.data)
                                $scope.loadData(response.data);
                            } else {
                                toastr.error("Detail Empty");
                                $scope.Reset();
                            };
                        }, function(err) {
                            o.loadingPage(false);
                            toastr.error('Detail Consultation Fail');
                        });
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
                } else {
                    toastr.error("Please input data");
                };
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
                console.log("$scope.requestInfo.Consultations[0].ConsultationData>>>>>>>>>>>", $scope.requestInfo.Consultations[0].ConsultationData);
                var ConsultationDataTemp = [];
                for (var key in $scope.requestInfo.Consultations[0].ConsultationData) {
                    var newkey = key.split("__").join(" ");
                    var res = newkey.split(".");
                    var otherkey = res[2] + res[3] +res[4] + + 'Other';
                    var object = {
                        Section: res[0],
                        Category: res[1],
                        Type: res[2],
                        Name: res[3],
                        Description: res[4],
                        Value: ($scope.requestInfo.Consultations[0].ConsultationData[key].Value == 'OtherProvider') ? $scope.requestOther[otherkey] : $scope.requestInfo.Consultations[0].ConsultationData[key].Value,
                        FileUploads: $scope.requestInfo.Consultations[0].ConsultationData[key].FileUploads
                    };
                    var isExist = false;

                    ConsultationDataTemp.forEach(function(valueTemp, keyTemp) {
                        if (object.Value !== null) {
                            if (valueTemp.Section == object.Section &&
                                valueTemp.Category == object.Category &&
                                valueTemp.Type == object.Type &&
                                valueTemp.Name == object.Name &&
                                valueTemp.Description == object.Description) {
                                isExist = true;
                            }
                        } else {
                            isExist = true;
                        };
                    });
                    if (!isExist) {
                        if (object.Value !== null && object.Value !== "") {
                            ConsultationDataTemp.push(object);
                        };
                    };
                };
                $scope.requestInfo.Consultations[0].ConsultationData = ConsultationDataTemp;
                // $scope.requestInfo.Consultations[0].FileUploads = $scope.requestInfo.Consultations[0].FileUploads.concat($scope.FileUploads);// Tan comment
            }
            $scope.ConsultationUpdate = function() {
                var ConsultationDataTemp = [];
                console.log("ConsultationUpdate: $scope.requestInfo.Consultations[0].ConsultationData", $scope.requestInfo.Consultations[0].ConsultationData);
                for (var key in $scope.requestInfo.Consultations[0].ConsultationData) {
                    var newkey = key.split("__").join(" ");
                    var res = newkey.split(".");
                    var otherkey = res[2] + res[3] + res[4] + 'Other';
                    var object = {
                        Section: res[0],
                        Category: res[1],
                        Type: res[2],
                        Name: res[3],
                        Description: res[4],
                        Value: ($scope.requestInfo.Consultations[0].ConsultationData[key].Value == 'OtherProvider') ? $scope.requestOther[otherkey] : $scope.requestInfo.Consultations[0].ConsultationData[key].Value,
                        FileUploads: $scope.requestInfo.Consultations[0].ConsultationData[key].FileUploads
                    };
                    var isExist = false;
                    $scope.ConsultationData.forEach(function(valueTemp, keyTemp) {
                        if (valueTemp.Section == object.Section &&
                            valueTemp.Category == object.Category &&
                            valueTemp.Type == object.Type &&
                            valueTemp.Name == object.Name &&
                            valueTemp.Description == object.Description) {
                            if (object.Value !== null) {
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
                                valueTemp.Name == object.Name &&
                                valueTemp.Description == object.Description) {
                                valueTemp.Value = object.Value;
                                isExist = true;
                            };
                        } else {
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
                console.log("update:$scope.requestInfo.Consultations[0].ConsultationData",$scope.requestInfo.Consultations[0].ConsultationData)
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
            $scope.previewImageFileUpload = function(filePreUpload) {
                var modalInstance = $modal.open({
                    templateUrl: 'modalPreviewImageFileUpload',
                    controller: function($scope ,filePreUpload, CommonService, $modalInstance){
                        $scope.item = filePreUpload;
                        $scope.getBlobUrl = function(objectUrl) {
                            $scope.objectUrl = objectUrl;
                        }
                        $scope.viewFull = function () {
                            CommonService.previewImageFileUpload($scope.objectUrl);
                        }
                        $scope.cancel = function() {
                            $modalInstance.dismiss('cancel');
                        };
                    },
                    windowClass: 'app-modal-window-full',
                    resolve: {
                        filePreUpload: function() {
                            return filePreUpload;
                        }
                    }
                });
                modalInstance.result.then(function(data) {
                    $modalInstance.close('err');
                });
            }

            $scope.closeWindow = function(fileInfo) {
                Window.close();
            }
            $scope.RemoveDrawing = function(index) {
                $scope.FileUploads.splice(index, 1);
            }
            $scope.AddDrawing = function(key) {
                
                /*$scope.currentRelevantFileUploadKey = 'Consultation__Details.Appointment.Relevant.FileUploads.'+key;
                $scope.currentRelevantGroupKey = key;*/
                $scope.setCurrentRelevantGroup(key);

                if (typeof(Window) == 'undefined' || Window.closed) {
                    window.refreshCode = $rootScope.refreshCode;
                    window.relevantFileUploadKey = $scope.currentRelevantFileUploadKey;
                    window.relevantGroupKey = $scope.currentRelevantGroupKey;
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
