var app = angular.module('app.authentication.consultation.directives.consultNoteDirectives', []);
app.directive('consultNote', function(consultationServices, doctorService, $modal, $cookies, $state, $stateParams, toastr, $timeout, FileUploader, $rootScope) {
    return {
        restrict: 'E',
        scope: {
            consultationuid: '='
        },
        templateUrl: "modules/consultation/directives/templates/consultNoteDirectives.html",
        controller: function($scope) {
            var userInfo = $cookies.getObject('userInfo');
            


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
            $scope.removeRelevantGroup = function (relevantGroupKey) {
                delete $scope.relevantGroup[relevantGroupKey];
                
            }
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
                $scope.SendRequestUploadFile();
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
                            // toastr.error("Detail Empty");
                            // $scope.Reset();
                        };
                    }, function(err) {
                        o.loadingPage(false);
                        toastr.error('Detail Consultation Fail');
                    });
                };
            });

            $scope.dataRelation = {
                'immunosuppression':'Consultation__Details.Appointment.History.immunosuppression',
                'Relevantother':'Consultation__Details.Appointment.Relevant.RelevantotherValue',
                'DDX_Ddxother':'Consultation__Details.Appointment.Relevant.DDX_DdxotherValue',
            }
            $scope.dataRelationMapping = function(name, relevantKey) {
                for (var key in $scope.dataRelation) {
                    if(key == name) {
                        var modelName = $scope.dataRelation[key] + "."+relevantKey;
                        /*console.log(modelName);
                        console.log($scope.requestInfo.Consultations[0].ConsultationData);*/
                        if(!$scope.requestInfo.Consultations[0].ConsultationData[modelName])
                            $scope.requestInfo.Consultations[0].ConsultationData[modelName] = {};
                        $scope.requestInfo.Consultations[0].ConsultationData[modelName].Value = null;
                        break;
                    }
                }
            };

            $scope.dataPrintType = {
                'Consultation__Details.Appointment.History.immunosuppressionValue': 'radio',//immunosuppressionvalue
                'Consultation__Details.Appointment.History.immunosuppression': 'string',//immunosuppression
                'Consultation__Details.Appointment.History.Melanoma': 'radio',//melanoma
                'Consultation__Details.Appointment.History.CellAquamous': 'radio',//cellaquamous
                'Consultation__Details.Appointment.History.ConcernedAboutValue': 'string',//concernedaboutvalue
                'Consultation__Details.Appointment.History.ConcernedAbout': 'radio',//concernedabout
                'Consultation__Details.Appointment.History.HaditChanged': 'radio',//haditchanged
                'Consultation__Details.Appointment.History.PleaseDescribe': 'string',//pleasedescribe
                'Consultation__Details.Appointment.History.SkinCancer': 'radio',//skincancer
                'Consultation__Details.Appointment.History.IfYesMelanoma': 'radio',//ifyesmelanoma
                'Consultation__Details.Appointment.History.WhenWasItDiagnosed':'string',//if YES, when was it diagnosed ?
                'Consultation__Details.Appointment.History.WhatWasTheDepth':'string',//What was the depth ?
                'Consultation__Details.Appointment.History.LymphNodeCheck':'radio',
                'Consultation__Details.Appointment.History.Suspicious_Lesions': 'checkbox', //suspicious_lesions
                'Consultation__Details.Appointment.Relevant.Biopsiedproven': 'radio',//biopsiedproven
                'Consultation__Details.Appointment.Relevant.Site':'string',//site
                'Consultation__Details.Appointment.Relevant.Dimension':'string',//dimension
                'Consultation__Details.Appointment.Relevant.Colour':'string',//colour
                'Consultation__Details.Appointment.Relevant.Border':'string',//border
                'Consultation__Details.Appointment.Relevant.ULCERATION':'radio',//ulceration
                'Consultation__Details.Appointment.Relevant.Satellite_Lesion':'radio',//satellite_lesion
                'Consultation__Details.Appointment.Relevant.Perineural_Symptoms':'radio',//perineural_symptoms
                'Consultation__Details.Appointment.Relevant.RelevantotherValue':'string',//relevantothervalue
                'Consultation__Details.Appointment.Relevant.Relevantother':'checkbox',//
                'Consultation__Details.Appointment.Relevant.DDX_BCC':'checkbox',//bcc
                'Consultation__Details.Appointment.Relevant.DDX_SCC':'checkbox',//scc
                'Consultation__Details.Appointment.Relevant.DDX_DdxMelanoma':'checkbox',//ddxmelanoma
                'Consultation__Details.Appointment.Relevant.DDX_Merkel':'checkbox',//merkel
                'Consultation__Details.Appointment.Relevant.DDX_DdxotherValue':'string',//ddxothervalue
                'Consultation__Details.Appointment.Relevant.DDX_Ddxother':'checkbox',//ddxother
                'Consultation__Details.Appointment.RECOMMENDATIONS.Biopsy':'checkbox',//biopsy
                'Consultation__Details.Appointment.RECOMMENDATIONS.Effudex__/__Aldara':'checkbox',//effudex / aldara
                'Consultation__Details.Appointment.RECOMMENDATIONS.Cryotherapy':'checkbox',//cryotherapy
                'Consultation__Details.Appointment.RECOMMENDATIONS.Laser__ablation':'checkbox',//laser ablation
                'Consultation__Details.Appointment.RECOMMENDATIONS.Surgical__excision':'checkbox',//surgical excision
                'Consultation__Details.Appointment.RECOMMENDATIONS.Risk__complication':'checkbox',//risk complication
                'Consultation__Details.Appointment.RECOMMENDATIONS.Flap':'checkbox',//flap
                'Consultation__Details.Appointment.RECOMMENDATIONS.Graft':'checkbox',//graft
                'Consultation__Details.Appointment.RECOMMENDATIONS.SSG':'checkbox',//ssg
                'Consultation__Details.Appointment.RECOMMENDATIONS.FTSG':'checkbox',//ftsg
                'Consultation__Details.Appointment.Suithble__for.SpecialistValue':'string',//specialistvalue
                'Consultation__Details.Appointment.Suithble__for.Specialist':'checkbox',//specialist
                'Consultation__Details.Appointment.Suithble__for.TelehealthValue':'string',//telehealthvalue
                'Consultation__Details.Appointment.Suithble__for.Telehealth':'checkbox',//telehealth
                'Consultation__Details.Appointment.Suithble__for.Skin_CheckinComment':'string',
                'Consultation__Details.Appointment.Suithble__for.Skin_Checkin': 'radio',
                // 'Consultation__Details.Appointment.Relevant.FileUploads':'normal_image'//consult_note_image
                'Consultation__Details.Appointment.Relevant.FileUploads':'image_array',//consult_note_image
                'Consultation__Details.Appointment.DoctorInfo.D_Name': 'string',//d_name
                'Consultation__Details.Appointment.DoctorInfo.D_Date': 'string',//d_date
                'Consultation__Details.Appointment.DoctorInfo.D_Signature': 'normal_image'//d_signature:     d_signature/type: normal_image,
            };
            $scope.swapName = function (name) {
                var newName = name.split("__").join(" ");
                var res = newName.split('.');
                var result = res[res.length-1];
                if (result.indexOf("DDX_") >=0) {
                    result= result.split("DDX_")[1];
                }
                result = result.toLowerCase();
                if(result == 'fileuploads')
                    result = 'consult_note_image';
                return result;
            }
            $scope.arrayNames = ["Consultation__Details.Appointment.Relevant"];


            $scope.dataPrintResultStep0 = {};
            $scope.dataPrintResultStep1 = {};
            $scope.dataPrintResultStep2 = [];

            $scope.mapName = function (object) {
                var mapped = false;
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
                            if(object.FileUploads && object.FileUploads.length > 0)
                            {
                                var file = [];
                                for (var i = 0; i < object.FileUploads.length; i++) {

                                    file.push({value:object.FileUploads[i].UID});
                                }
                                $scope.dataPrintResultStep0[key][object.Description].Value =file;
                                // $scope.dataPrintResultStep0[key][object.Description].Value = object.FileUploads[0].UID;
                            }
                            else
                                $scope.dataPrintResultStep0[key][object.Description].Value = null;
                        }
                        else {
                            $scope.dataPrintResultStep0[key][object.Description].Value = object.Value;
                        }
                        mapped = true;
                        break;
                    }
                }
                return mapped;
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
                                        name: $scope.swapName(itemKey),
                                        type: $scope.dataPrintResultStep1[key][subkey][itemKey].type,
                                        value: $scope.dataPrintResultStep1[key][subkey][itemKey].value,
                                    }
                                    arrItem.push(item);
                                }
                                arr.push(arrItem);

                            }
                            $scope.dataPrintResultStep2.push({
                                name: $scope.swapName(key),
                                type: 'repeat',
                                value: arr
                            })
                        }
                        else {
                            var item = {
                                name: $scope.swapName(key),
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
                $scope.dataPrintResultStep0 = {};
                $scope.dataPrintResultStep1 = {};
                $scope.dataPrintResultStep2 = [];
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
                        name: "dob",
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
            
            $scope.Update = function(isClickBtnUpdate) {
                var isClick = isClickBtnUpdate ? isClickBtnUpdate : false;
                (($scope.uploader.queue.length > 0) ? $scope.SendRequestUploadFile() : $scope.updateConsultation(isClick));
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
                                // toastr.error("Detail Empty");
                                // $scope.Reset();
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
            $scope.updateConsultation = function(isClickBtnUpdate) {
                var isClick = isClickBtnUpdate ? isClickBtnUpdate : false;
                var obj = $scope.ConsultationUpdate();
                var objectUpdate = angular.copy($scope.requestInfo);
                objectUpdate.Consultations[0].ConsultationData = obj;

                var UID = angular.copy($scope.requestInfo.Consultations[0].UID);
                // o.loadingPage(true);
                consultationServices.updateConsultation(objectUpdate).then(function(response) {
                    if (response == 'success') {
                        if(isClick == true) {
                            toastr.success('Update Success');
                        }
                        // o.loadingPage(false);
                        // consultationServices.detailConsultation(UID).then(function(response) {
                        //     $scope.uploader.clearQueue();
                        //     $scope.requestInfo = null;
                        //     $scope.requestOther = {};
                        //     if (response.data !== null) {
                        //         toastr.success('Update Success');
                        //         $scope.loadData(response.data);
                        //     } else {
                        //         toastr.error("data error");
                        //     };
                        // });
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
                // console.log("ConsultationUpdate: $scope.requestInfo.Consultations[0].ConsultationData", $scope.requestInfo.Consultations[0].ConsultationData);
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
                // $scope.requestInfo.Consultations[0].ConsultationData = ConsultationDataTemp;
                return ConsultationDataTemp;
                // console.log("update:$scope.requestInfo.Consultations[0].ConsultationData",$scope.requestInfo.Consultations[0].ConsultationData)
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
            $scope.RemoveDrawing = function(relevantKey, index) {
                $scope.setCurrentRelevantGroup(relevantKey);
                var removeFile = angular.copy($scope.relevantFileUploads[relevantKey][index]);
                console.log("removeFile",removeFile);
                $scope.relevantFileUploads[relevantKey].splice(index,1);

                if($scope.requestInfo.Consultations[0].ConsultationData[$scope.currentRelevantFileUploadKey]) {
                    for (var i = 0; i< $scope.requestInfo.Consultations[0].ConsultationData[$scope.currentRelevantFileUploadKey].FileUploads.length; i++) {
                        var fileItem = $scope.requestInfo.Consultations[0].ConsultationData[$scope.currentRelevantFileUploadKey].FileUploads[i];
                        if(fileItem.UID == removeFile.UID)
                        {
                            $scope.requestInfo.Consultations[0].ConsultationData[$scope.currentRelevantFileUploadKey].FileUploads.splice(i,1);
                            $scope.requestInfo.Consultations[0].ConsultationData[$scope.currentRelevantFileUploadKey].Value =
                                $scope.requestInfo.Consultations[0].ConsultationData[$scope.currentRelevantFileUploadKey].FileUploads.length;
                        }
                    }
                    (($scope.uploader.queue.length > 0) ? $scope.SendRequestUploadFile() : $scope.updateConsultation());
                }


                // $scope.FileUploads.splice(index, 1);
                
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
            $('#ctrl *').filter(':input').each(function(key){
                $(this).blur(function() {
                    (($scope.uploader.queue.length > 0) ? $scope.SendRequestUploadFile() : $scope.updateConsultation());
                })
            });
            $scope.autoSave = function() {
                $scope.updateConsultation();
            };
            $scope.init = function() {
                consultationServices.checkconsultnote($stateParams.UID)
                .then(function(result) {
                    if(result.data && result.data.Consultations.length > 0) {
                        var index = result.data.Consultations.length - 1;
                        $scope.consultationuid = result.data.Consultations[index].UID;
                    }
                    else {
                        $scope.Create();
                    }
                }, function(err) {

                })
            }
            if(userInfo) {
                doctorService.getDoctor({UID: userInfo.UID})
                .then(function(response){
                    if(response.data) {
                        // FileUID_sign
                        $scope.doctorInfo = response.data;
                        var doctorName = $scope.doctorInfo.FirstName + ' ' + $scope.doctorInfo.LastName;
                        if(!$scope.requestInfo) {
                            $scope.requestInfo = {};
                            $scope.requestInfo.Consultations = [];
                            $scope.requestInfo.Consultations[0].ConsultationData = {};

                        }
                        $scope.requestInfo.Consultations[0].ConsultationData['Consultation__Details.Appointment.DoctorInfo.D_Name.0']={
                            Value: doctorName
                        };
                        $scope.requestInfo.Consultations[0].ConsultationData['Consultation__Details.Appointment.DoctorInfo.D_Date.0']={
                            Value: moment().format("DD/MM/YYYY")
                        };
                        $scope.requestInfo.Consultations[0].ConsultationData['Consultation__Details.Appointment.DoctorInfo.D_Signature.0']={
                            Value: $scope.doctorInfo.FileUID_sign
                        };
                        $scope.init();

                    }
                },function(err){
                    console.log(err);
                })
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
