/***
GLobal Directives
***/

// Route State Load Spinner(used on page or content load)
app.directive('ngSpinnerBar', ['$rootScope',
    function($rootScope) {
        return {
            link: function(scope, element, attrs) {
                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default

                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function() {
                    element.removeClass('hide'); // show spinner bar
                });

                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function() {
                    element.addClass('hide'); // hide spinner bar
                    $('body').removeClass('page-on-load'); // remove page loading indicator
                    Layout.setSidebarMenuActiveLink('match'); // activate selected link in the sidebar menu

                    // auto scorll to page top
                    setTimeout(function() {
                        App.scrollTop(); // scroll to the top on content load
                    }, $rootScope.settings.layout.pageAutoScrollOnLoad);
                });

                // handle errors
                $rootScope.$on('$stateNotFound', function() {
                    element.addClass('hide'); // hide spinner bar
                });

                // handle errors
                $rootScope.$on('$stateChangeError', function() {
                    element.addClass('hide'); // hide spinner bar
                });
            }
        };
    }
])

// Handle global LINK click
app.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function(e) {
                    e.preventDefault(); // prevent link click for above criteria
                });
            }
        }
    };
});

// Handle Dropdown Hover Plugin Integration
app.directive('dropdownMenuHover', function() {
    return {
        link: function(scope, elem) {
            elem.dropdownHover();
        }
    };
});

// Datepicker
app.directive('datePicker', function($timeout) {
    return {
        restrict: "A",
        scope: {
            // startDate: '=startDate',
            setDate: '=setDate',
        },
        controller: function($scope) {
            /*$('#inputDate').datepicker({
                rtl: App.isRTL(),
                orientation: "left",
                // format: 'mm/dd/yyyy',
                startDate: $scope.startDate,
                autoclose: !0,
            });*/

        },
        link: function(scope, elem, attrs) {
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>..............");
            console.log(elem);
            console.log(attrs);
            elem.datepicker({
                rtl: App.isRTL(),
                orientation: "left",
                // format: 'mm/dd/yyyy', // ko co tac dung
                // startDate: scope.startDate,
                autoclose: !0,
            });
            scope.$watch('setDate', function(oldVal, newVal) {
                elem.datepicker('setDate', oldVal);
            });
            // $timeout(function(){
            //     elem.datepicker('setDate', scope.setDate);
            //     console.log('.................',scope.setDate);
            // },0);

            elem.addClass('form-control');
            // elem.attr('data-date-format', 'dd/mm/yyyy');
            // elem.attr('readonly', true);
            elem.attr('type', 'text');
            elem.attr('placeholder', 'dd/mm/yyyy');
            // elem.attr('data-date-start-date',"20/11/2015");
            // elem.attr('data-date-end-date',"0d" );
        },
    };
});
// Timepicker
app.directive('timePicker', function($timeout) {
    return {
        scope: {
            setTime: '=setTime',
        },
        link: function(scope, elem, attrs) {
            elem.timepicker({
                autoclose: false,
                minuteStep: 1, // cach nhau bao nhieu phut
                showSeconds: false, //ko show giay
                showMeridian: false, // khong su dung kieu format AM PM
            });
            scope.$watch('setTime', function(oldVal, newVal) {
                elem.timepicker('setTime', oldVal);
            });
            elem.addClass('form-control');
            // elem.attr('data-format', 'hh:mm A');
            elem.attr('data-default-time', '');
            // elem.attr('readonly', true);
            elem.attr('type', 'text');
            elem.attr('placeholder', 'hh:mm');
        },
    };
});

app.directive('datetimePicker', function() {
    return {
        link: function(scope, elem, attr) {
            elem.datetimepicker({
                // viewMode: 'years',
                format: 'dd/mm/yyyy hh:ii',
            });
            elem.addClass('form-control');
            elem.attr('type', 'text');
            elem.attr('placeholder', 'dd/mm/yyyy hh:mm');
            // elem.attr('readonly', true);
        }
    };
});

app.directive('autoComplete', function($timeout) {
    return function(scope, iElement, iAttrs) {
        iElement.autocomplete({
            source: scope[iAttrs.uiItems],
            select: function() {
                $timeout(function() {
                    iElement.trigger('input');
                }, 0);
            }
        });
        iElement.addClass('form-control');
        iElement.attr('type', 'text');
    };
});

app.directive('patientDetailDirective', function($uibModal, $timeout, $cookies) {
    return {
        restrict: 'E',
        scope: {
            info: "="
        },
        templateUrl: 'common/views/patientDetailDirective.html',
        controller: function($scope, WAAppointmentService) {
            $scope.rolePatient = true
            var roles = $cookies.getObject('userInfo').roles;
            console.log("roles", roles);
            for (var i = 0; i < roles.length; i++) {
                if (roles[i].RoleCode === "ADMIN" || roles[i].RoleCode === "ASSISTANT" || roles[i].RoleCode === "INTERNAL_PRACTITIONER")
                    $scope.rolePatient = false;
            }
            $scope.info.setDataPatientDetail = function(data) {
                console.log("patientDetailDirective", data);
                $scope.apptdetail = data;
                if ($scope.apptdetail != null) {
                    if ($scope.apptdetail.Patients.length > 0) {
                        $scope.patientInfo = $scope.apptdetail.Patients[0];
                        console.log('$scope.patientInfo', $scope.patientInfo);
                    } else if ($scope.apptdetail.PatientAppointments.length > 0) {
                        $scope.patientInfo = $scope.apptdetail.PatientAppointments[0];
                        console.log('$scope.patientInfo', $scope.patientInfo);
                    } else if ($scope.apptdetail.TelehealthAppointment != null) {
                        $scope.patientInfo = $scope.apptdetail.TelehealthAppointment.PatientAppointment;
                        console.log('$scope.patientInfo', $scope.patientInfo);
                    }
                    if($scope.apptdetail.AppointmentData.length > 0) {                        
                        for (var i = 0; i < $scope.apptdetail.AppointmentData.length; i++) {                                                       
                            if($scope.apptdetail.AppointmentData[i].Name =='ResultEmail')
                            $scope.patientInfo.resultEmail = $scope.apptdetail.AppointmentData[i].Value;

                        }
                    }
                };
            };

            $scope.sendEmail = function(response) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: 'common/views/sendEmail.html',
                    resolve: {},
                    controller: function($scope, $stateParams, CommonService, FileUploader, toastr, $cookies, consultationServices) {
                        console.log("asiodhiaoshdoashdoias ", response);
                        var self = $scope;
                        self.show_consult = false;
                        self.patientInfo = response;
                        self.consult = {};
                        self.ApptUID = $stateParams.UID;
                        App.initAjax();
                        self.data = {
                            sender: "meditek.bk001@gmail.com",
                            recipient: [],
                            bodyContent: "",
                            subject: "",
                        };
                        var userInfo = $cookies.getObject('userInfo');
                        self.searchObj = {
                            Filter: [{
                                Patient: {
                                    UID: $stateParams.UIDPatient
                                }
                            }],
                            Order: [{
                                Consultation: {
                                    CreatedDate: 'DESC'
                                }
                            }]
                        };
                        console.log("userInfo", userInfo.UID);
                        self.uploadFile = {
                            patientUID: $stateParams.UIDPatient,
                            ApptUID: $stateParams.UID,
                            userUID: userInfo.UID
                        }

                        self.UIDTemplate = [];

                        self.cutstring = function(string) {
                            var string = string.split(", ");
                        };

                        if (response.resultEmail != null) {
                            self.data.recipient.push(response.resultEmail);
                        } else if (response.Email1 != null) {
                            self.data.recipient.push(response.Email1);
                        } else if (response.Email2 != null) {
                            self.data.recipient.push(response.Email2);
                        }

                        self.checkUIDTemplate = function(Note, index) {
                            console.log("index", index);
                            console.log("Note", Note);
                            console.log("Note", Note);
                            console.log("self.UIDTemplate", self.UIDTemplate);
                            var checkExit = 0
                            for (key in self.UIDTemplate) {
                                console.log("self.UIDTemplate>>>>>>>>", self.UIDTemplate[key]);
                            }
                            if (self.UIDTemplate[Note] == "") {
                                delete self.UIDTemplate[Note]
                            }
                            console.log("self.UIDTemplate", self.UIDTemplate);


                        };

                        self.getEformTemplant = function() {
                            console.log("self.UIDTemplate", self.UIDTemplate);
                            console.log("..............", $stateParams);
                            self.info = {
                                patientUID: $stateParams.UIDPatient,
                                search: {
                                    ApptUID: $stateParams.UID
                                }
                            };
                            CommonService.getListEformTemplant(self.info).then(function(data) {
                                console.log("|||||||||||||||||||||||||||||||||||", data);
                                self.attach = data.rows;
                                for (var i = 0; i < self.attach.length; i++) {
                                    self.attach[i].Note = (self.attach[i].Note == null) ? self.attach[i].UID : self.attach[i].Note;
                                }
                                consultationServices.listConsultation(self.searchObj)
                                    .then(function(response) {
                                        console.log("response ", response);
                                        self.show_consult = true;
                                        self.consult = response.rows[0];
                                       self.consult.Code = self.attach[0].Appointments[0].Code;
                                    }, function(err) {
                                        console.log("err ", err);
                                    })

                            })
                        };
                        self.getEformTemplant();

                        self.close = function() {
                            modalInstance.close();
                        };

                        self.submitted = false;

                        self.send = function() {
                            self.submitted = true;
                            // if (self.myForm.Subject.$invalid || self.myForm.email1.$dirty && self.myForm.email1.$invalid || self.myForm.Content.$invalid ) {
                            if (self.myForm.$invalid) {
                                toastr.error("you must enter full information !!!!!");
                            } else {
                                o.loadingPage(true);
                                // if (self.data.bodyContent === null || self.data.bodyContent === undefined) {
                                //     self.data.bodyContent = " ";
                                // }                            
                                // self.data.recipient = self.data.recipient[0].split(", ");                                                 
                                self.attachments = [];

                                for (var key in self.UIDTemplate) {
                                    if (self.UIDTemplate[key] != "" && self.UIDTemplate[key] != null && self.UIDTemplate[key] != undefined) {
                                        var subStrs = typeof self.UIDTemplate[key] === 'string' ? self.UIDTemplate[key].split(".") : key;
                                        var name = typeof self.UIDTemplate[key] === 'string' ? '' : 'ConsultNote';
                                        for (var i = 0; i < self.attach.length; i++) {
                                            if (self.attach[i].UID === self.UIDTemplate[key] || self.attach[i].Note === self.UIDTemplate[key]) {
                                                name = self.attach[i].Name;
                                            }
                                        };
                                        var type = subStrs.length > 1 ? "fileupload" : "report";
                                        if (typeof self.UIDTemplate[key] === 'object') {
                                            type = 'fixedreport';
                                        }
                                        var content = typeof self.UIDTemplate[key] === 'string' ? subStrs[0] : null;
                                        var extension = typeof self.UIDTemplate[key] === 'string' && subStrs.length > 1 ? subStrs[1] : "pdf";
                                        tmp = {
                                            type: type,
                                            content: content,
                                            name: name,
                                            extension: extension,
                                        };
                                        if (typeof self.UIDTemplate[key] === 'object') tmp.fixedFormData = self.UIDTemplate[key];
                                        self.attachments.push(tmp);
                                    }
                                }
                                if (self.attachments.length > 0) {
                                    self.data.attachments = self.attachments;
                                } else {
                                    if (self.data.attachments) {
                                        delete self.data.attachments;
                                    }
                                }
                                // toastr.info('Sending...');                                                                                                                                                
                                CommonService.sendEmail(self.data).then(function(data) {
                                    o.loadingPage(false);
                                    modalInstance.close();
                                    toastr.success('Send successfully');
                                }, function(err) {
                                    o.loadingPage(false);
                                    toastr.error('Send failed', "Unexpected Error");
                                })
                            }

                        };

                        self.makeData = function(data) {
                            self.FileUploads = angular.copy(data.FileUploads);
                            //tan custom
                            self.relevantFileUploads = {};
                            self.requestInfo = {
                                UID: $stateParams.UID,
                                Consultations: [{
                                    UID: data.UID,
                                    ConsultationData: []
                                }]
                            }
                            self.Temp = angular.copy(data.ConsultationData);
                            self.relevantGroup = {};
                            self.Temp.forEach(function(valueRes, indexRes) {
                                if (valueRes != null && valueRes != undefined) {
                                    //tan custom
                                    if (valueRes.Type == 'Relevant') {
                                        var desc = valueRes.Description ? valueRes.Description : 0;
                                        self.relevantGroup[desc] = { name: desc };
                                        if (valueRes.Name == 'FileUploads') {
                                            self.relevantFileUploads[desc] = angular.copy(valueRes.FileUploads);
                                        }
                                    }

                                    var keyClinicalDetail = valueRes.Section + '.' + valueRes.Category + '.' + valueRes.Type + '.' + valueRes.Name + '.' + (valueRes.Description ? valueRes.Description : 0);
                                    keyClinicalDetail = keyClinicalDetail.split(" ").join("__");
                                    var keyOther = valueRes.Type + valueRes.Name + (valueRes.Description ? valueRes.Description : 0);
                                    if (keyOther != 0) {
                                        keyOther = keyOther.split(" ").join("");
                                    }
                                    self.requestInfo.Consultations[0].ConsultationData[keyClinicalDetail] = {};
                                    if (valueRes.Name == 'US' || valueRes.Name == 'MRI' || valueRes.Name == 'PetScan' || valueRes.Name == 'CT') {
                                        if (valueRes.Value !== 'WD' && valueRes.Value !== 'ENVISION' && valueRes.Value !== 'INSIGHT') {
                                            self.requestInfo.Consultations[0].ConsultationData[keyClinicalDetail].Value = 'OtherProvider';
                                            self.requestOther[keyOther + 'Other'] = valueRes.Value;
                                        } else {
                                            self.requestInfo.Consultations[0].ConsultationData[keyClinicalDetail].Value = valueRes.Value;
                                        };
                                    } else {
                                        self.requestInfo.Consultations[0].ConsultationData[keyClinicalDetail].Value = valueRes.Value;
                                    };

                                    self.requestInfo.Consultations[0].ConsultationData[keyClinicalDetail].FileUploads = valueRes.FileUploads;
                                    // self.requestOther[keyOther] = true;
                                }
                            })
                            self.ConsultationData = data.ConsultationData;
                            return self.requestInfo;
                        };

                        self.arrayNames = ["Consultation__Details.Appointment.Relevant"];

                        self.dataPrintType = {
                            'Consultation__Details.Appointment.History.immunosuppressionValue': 'radio', //immunosuppressionvalue
                            'Consultation__Details.Appointment.History.immunosuppression': 'string', //immunosuppression
                            'Consultation__Details.Appointment.History.Melanoma': 'radio', //melanoma
                            'Consultation__Details.Appointment.History.CellAquamous': 'radio', //cellaquamous
                            'Consultation__Details.Appointment.History.ConcernedAboutValue': 'string', //concernedaboutvalue
                            'Consultation__Details.Appointment.History.ConcernedAbout': 'radio', //concernedabout
                            'Consultation__Details.Appointment.History.HaditChanged': 'radio', //haditchanged
                            'Consultation__Details.Appointment.History.PleaseDescribe': 'string', //pleasedescribe
                            'Consultation__Details.Appointment.History.SkinCancer': 'radio', //skincancer
                            'Consultation__Details.Appointment.History.IfYesMelanoma': 'radio', //ifyesmelanoma
                            'Consultation__Details.Appointment.History.WhenWasItDiagnosed': 'string', //if YES, when was it diagnosed ?
                            'Consultation__Details.Appointment.History.WhatWasTheDepth': 'string', //What was the depth ?
                            'Consultation__Details.Appointment.History.LymphNodeCheck': 'radio',
                            'Consultation__Details.Appointment.History.Suspicious_Lesions': 'checkbox', //suspicious_lesions
                            'Consultation__Details.Appointment.Relevant.Biopsiedproven': 'radio', //biopsiedproven
                            'Consultation__Details.Appointment.Relevant.Site': 'string', //site
                            'Consultation__Details.Appointment.Relevant.Dimension': 'string', //dimension
                            'Consultation__Details.Appointment.Relevant.Colour': 'string', //colour
                            'Consultation__Details.Appointment.Relevant.Border': 'string', //border
                            'Consultation__Details.Appointment.Relevant.ULCERATION': 'radio', //ulceration
                            'Consultation__Details.Appointment.Relevant.Satellite_Lesion': 'radio', //satellite_lesion
                            'Consultation__Details.Appointment.Relevant.Perineural_Symptoms': 'radio', //perineural_symptoms
                            'Consultation__Details.Appointment.Relevant.RelevantotherValue': 'string', //relevantothervalue
                            'Consultation__Details.Appointment.Relevant.Relevantother': 'checkbox', //
                            'Consultation__Details.Appointment.Relevant.DDX_BCC': 'checkbox', //bcc
                            'Consultation__Details.Appointment.Relevant.DDX_SCC': 'checkbox', //scc
                            'Consultation__Details.Appointment.Relevant.DDX_DdxMelanoma': 'checkbox', //ddxmelanoma
                            'Consultation__Details.Appointment.Relevant.DDX_Merkel': 'checkbox', //merkel
                            'Consultation__Details.Appointment.Relevant.DDX_DdxotherValue': 'string', //ddxothervalue
                            'Consultation__Details.Appointment.Relevant.DDX_Ddxother': 'checkbox', //ddxother
                            'Consultation__Details.Appointment.RECOMMENDATIONS.Biopsy': 'checkbox', //biopsy
                            'Consultation__Details.Appointment.RECOMMENDATIONS.Effudex__/__Aldara': 'checkbox', //effudex / aldara
                            'Consultation__Details.Appointment.RECOMMENDATIONS.Cryotherapy': 'checkbox', //cryotherapy
                            'Consultation__Details.Appointment.RECOMMENDATIONS.Laser__ablation': 'checkbox', //laser ablation
                            'Consultation__Details.Appointment.RECOMMENDATIONS.Surgical__excision': 'checkbox', //surgical excision
                            'Consultation__Details.Appointment.RECOMMENDATIONS.Risk__complication': 'checkbox', //risk complication
                            'Consultation__Details.Appointment.RECOMMENDATIONS.Flap': 'checkbox', //flap
                            'Consultation__Details.Appointment.RECOMMENDATIONS.Graft': 'checkbox', //graft
                            'Consultation__Details.Appointment.RECOMMENDATIONS.SSG': 'checkbox', //ssg
                            'Consultation__Details.Appointment.RECOMMENDATIONS.FTSG': 'checkbox', //ftsg
                            'Consultation__Details.Appointment.Suithble__for.SpecialistValue': 'string', //specialistvalue
                            'Consultation__Details.Appointment.Suithble__for.Specialist': 'checkbox', //specialist
                            'Consultation__Details.Appointment.Suithble__for.TelehealthValue': 'string', //telehealthvalue
                            'Consultation__Details.Appointment.Suithble__for.Telehealth': 'checkbox', //telehealth
                            'Consultation__Details.Appointment.Suithble__for.Skin_CheckinComment': 'string',
                            'Consultation__Details.Appointment.Suithble__for.Skin_Checkin': 'radio',
                            // 'Consultation__Details.Appointment.Relevant.FileUploads':'normal_image'//consult_note_image
                            'Consultation__Details.Appointment.Relevant.FileUploads': 'image_array', //consult_note_image
                            'Consultation__Details.Appointment.DoctorInfo.D_Name': 'string', //d_name
                            'Consultation__Details.Appointment.DoctorInfo.D_Date': 'string', //d_date
                            'Consultation__Details.Appointment.DoctorInfo.D_Signature': 'normal_image' //d_signature:     d_signature/type: normal_image,
                        };

                        self.mapName = function(object) {
                            var mapped = false;
                            for (var key in self.dataPrintType) {
                                if (object.dataKey.indexOf(key) >= 0) {
                                    if (!self.dataPrintResultStep0[key])
                                        self.dataPrintResultStep0[key] = {};
                                    if (!self.dataPrintResultStep0[key][object.Description])
                                        self.dataPrintResultStep0[key][object.Description] = {
                                            Name: key,
                                            Type: self.dataPrintType[key]
                                        };
                                    if (key == 'Consultation__Details.Appointment.Relevant.FileUploads') {
                                        if (object.FileUploads && object.FileUploads.length > 0) {
                                            var file = [];
                                            for (var i = 0; i < object.FileUploads.length; i++) {

                                                file.push({ value: object.FileUploads[i].UID });
                                            }
                                            self.dataPrintResultStep0[key][object.Description].Value = file;
                                            // self.dataPrintResultStep0[key][object.Description].Value = object.FileUploads[0].UID;
                                        } else
                                            self.dataPrintResultStep0[key][object.Description].Value = null;
                                    } else {
                                        self.dataPrintResultStep0[key][object.Description].Value = object.Value;
                                    }
                                    mapped = true;
                                    break;
                                }
                            }
                            return mapped;
                        };

                        self.swapName = function(name) {
                            var newName = name.split("__").join(" ");
                            var res = newName.split('.');
                            var result = res[res.length - 1];
                            if (result.indexOf("DDX_") >= 0) {
                                result = result.split("DDX_")[1];
                            }
                            result = result.toLowerCase();
                            if (result == 'fileuploads')
                                result = 'consult_note_image';
                            return result;
                        }

                        self.parsePrintDataStep0 = function(ConsultationDataTemp) {
                            for (var i = 0; i < ConsultationDataTemp.length; i++) {
                                self.mapName(ConsultationDataTemp[i]);
                            }
                        };
                        self.parsePrintDataStep1 = function() {

                            for (var key in self.dataPrintResultStep0) {
                                var check = false;

                                for (var i = 0; i < self.arrayNames.length; i++) {
                                    if (key.indexOf(self.arrayNames[i]) >= 0) {
                                        check = true;
                                        var name = key.substring(self.arrayNames[i].length + 1, key.length);
                                        if (!self.dataPrintResultStep1[self.arrayNames[i]]) { //self.dataPrintResultStep1[Consultation__Details.Appointment.Relevant]
                                            self.dataPrintResultStep1[self.arrayNames[i]] = {

                                            }
                                        }

                                        for (var subkey in self.dataPrintResultStep0[key]) { //self.dataPrintResultStep0[Consultation__Details.Appointment.Relevant.0 .1 .2]
                                            if (!self.dataPrintResultStep1[self.arrayNames[i]][subkey])
                                                self.dataPrintResultStep1[self.arrayNames[i]][subkey] = {};
                                            self.dataPrintResultStep1[self.arrayNames[i]][subkey][key] = {
                                                name: key,
                                                type: self.dataPrintResultStep0[key][subkey].Type,
                                                value: self.dataPrintResultStep0[key][subkey].Value
                                            };
                                        }
                                    }
                                }
                                if (!check) {
                                    for (var subkey in self.dataPrintResultStep0[key]) {
                                        self.dataPrintResultStep1[key] = {
                                            name: key,
                                            type: self.dataPrintResultStep0[key][subkey].Type,
                                            value: self.dataPrintResultStep0[key][subkey].Value
                                        }
                                        break;
                                    }
                                }
                            }
                        };

                        self.parsePrintDataStep2 = function() {
                            for (var key in self.dataPrintResultStep1) {
                                for (var i = 0; i < self.arrayNames.length; i++) {
                                    if (key.indexOf(self.arrayNames[i]) >= 0) {
                                        var arr = [];
                                        for (var subkey in self.dataPrintResultStep1[key]) {
                                            var arrItem = [];
                                            for (var itemKey in self.dataPrintResultStep1[key][subkey]) {
                                                var item = {
                                                    name: self.swapName(itemKey),
                                                    type: self.dataPrintResultStep1[key][subkey][itemKey].type,
                                                    value: self.dataPrintResultStep1[key][subkey][itemKey].value,
                                                }
                                                arrItem.push(item);
                                            }
                                            arr.push(arrItem);

                                        }
                                        self.dataPrintResultStep2.push({
                                            name: self.swapName(key),
                                            type: 'repeat',
                                            value: arr
                                        })
                                    } else {
                                        var item = {
                                            name: self.swapName(key),
                                            type: self.dataPrintResultStep1[key].type,
                                            value: self.dataPrintResultStep1[key].value,
                                        }
                                        self.dataPrintResultStep2.push(item);
                                    }
                                }
                            }
                        };

                        self.makeDataConsultNote = function(DataPrintPDF) {
                            var promise_make = new Promise(function(a, b) {

                                var ConsultationDataTemp = [];
                                self.dataPrintResultStep0 = {};
                                self.dataPrintResultStep1 = {};
                                self.dataPrintResultStep2 = [];
                                for (var key in DataPrintPDF.Consultations[0].ConsultationData) {
                                    var newkey = key.split("__").join(" ");
                                    var res = newkey.split(".");
                                    var otherkey = res[2] + res[3] + res[4] ? res[4] : 0 + 'Other';
                                    var object = {
                                        dataKey: key,
                                        Section: res[0],
                                        Category: res[1],
                                        Type: res[2],
                                        Name: res[3],
                                        Description: res[4] ? res[4] : 0,
                                        Value: (DataPrintPDF.Consultations[0].ConsultationData[key].Value == 'OtherProvider') ? self.requestOther[otherkey] : DataPrintPDF.Consultations[0].ConsultationData[key].Value,
                                        FileUploads: DataPrintPDF.Consultations[0].ConsultationData[key].FileUploads
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
                                self.parsePrintDataStep0(ConsultationDataTemp);
                                self.parsePrintDataStep1();
                                self.parsePrintDataStep2();


                                consultationServices.getPatientDetail($stateParams.UIDPatient).then(function(response) {
                                    var PDFData = null;
                                    var postData = angular.copy(self.dataPrintResultStep2);

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
                                    a(dataPost);
                                }, function(err) {
                                    b(err);
                                });
                            });
                            return promise_make;
                        };

                        self.getConsultNote = function(consult_uid) {
                            var isHaveConsultNote = false;
                            for (var key in self.UIDTemplate) {
                                if (consult_uid === key) {
                                    isHaveConsultNote = true;
                                }
                            }
                            if (isHaveConsultNote == false) {
                                consultationServices.detailConsultation(consult_uid).then(function(response) {
                                    if (response.data !== null) {
                                        self.makeDataConsultNote(self.makeData(response.data))
                                            .then(function(dataPrint) {
                                                console.log("data Print", dataPrint);
                                                self.UIDTemplate[consult_uid] = dataPrint;
                                            }, function(err) {
                                                console.log("err ", err);
                                            })
                                    }
                                }, function(err) {
                                    console.log("err ", err);
                                });
                            } else {
                                var index = self.UIDTemplate.indexOf(consult_uid);
                                self.UIDTemplate.splice(index, 1);
                            }
                        };
                    },
                });
                modalInstance.result
                    .then(function(result) {}, function(result) {});
            };

            $scope.newAppointment = function() {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'common/views/newAppointment.html',
                    size: "lg",
                    resolve: {
                        item: function() {
                            return $scope.patientInfo;
                        },
                        type: function() {
                            return $scope.apptdetail.Type;
                        },

                    },
                    controller: function($scope, item, type) {
                        $scope.item = item;
                        $scope.type = type;
                        $scope.close = function() {
                            modalInstance.close();
                        };
                    }
                });
            };
        },
    };
});
app.directive('medicareDirective', function() {
    return {
        scope: {
            info: "="
        },
        restrict: 'E',
        templateUrl: 'common/views/medicareDirective.html',
        controller: function($scope, WAAppointmentService, PatientService) {
            $scope.info.setDataMedicare = function(data) {
                console.log("medicareDirective", data);
                if (data != null) {
                    if (data.Patients.length > 0) {
                        PatientService.detailChildPatient({ UID: data.Patients[0].UID, model: ['PatientMedicare', 'PatientDVA'] }).then(function(response) {
                            console.log("PatientMedicare ", response.data)
                            if (response.data) {
                                if (response.data.PatientMedicare.length > 0) {
                                    $scope.patientTelehealth = response.data.PatientMedicare[0];
                                }
                                if (response.data.PatientDVA.length > 0) {
                                    $scope.patientTelehealth.DVANumber = response.data.PatientDVA[0].DVANumber;
                                }
                            }
                        }, function(err) {
                            console.log(err);
                        })
                    } else if (data.PatientAppointments.length > 0) {
                        $scope.patientTelehealth = data.PatientAppointments[0];
                        console.log("medicare Directive", $scope.patientTelehealth);
                    } else if (data.TelehealthAppointment != null) {
                        $scope.patientTelehealth = data.TelehealthAppointment.PatientAppointment;
                    }
                }
            }
        },
    };
});
app.directive('appointmentDetailDirective', function() {
    return {
        restrict: 'E',
        scope: {
            info: "="
        },
        templateUrl: 'common/views/appointmentDetailDirective.html',
        controller: function($scope, WAAppointmentService, AuthenticationService, $cookies, $state, toastr) {
            $scope.rolePatient = true
            var roles = $cookies.getObject('userInfo').roles;
            for (var i = 0; i < roles.length; i++) {
                if (roles[i].RoleCode === "PATIENT")
                    $scope.rolePatient = false;
            }
            $scope.info.setDataApptDetail = function(data) {
                console.log("appointmentDetailDirective", data);
                $scope.apptdetail = data;
                if ($scope.apptdetail != null) {
                    $scope.apptDate = ($scope.apptdetail.FromTime != null) ? moment($scope.apptdetail.FromTime).format('DD/MM/YYYY') : 'N/A';
                    $scope.apptTime = ($scope.apptdetail.FromTime != null) ? moment($scope.apptdetail.FromTime).format('HH:mm') : 'N/A';
                };
            }

            var userInfo = $cookies.getObject('userInfo');
            ioSocket.getRoomOpentok.then(function(data) {
                $scope.Opentok = data.data;
                console.log("$scope.Opentok", $scope.Opentok);
            })
            $scope.funCallOpentok = function() {
                console.log(ioSocket.telehealthOpentok);
                WAAppointmentService.GetDetailPatientByUid({
                    UID: $scope.apptdetail.Patients[0].UID
                }).then(function(data) {
                    console.log(data);
                    if (data.data[0].TeleUID != null) {
                        var userCall = data.data[0].TeleUID;
                        var userName = data.data[0].FirstName + " " + data.data[0].LastName;
                        ioSocket.telehealthPatientCallWindow = window.open($state.href("blank.call", {
                            apiKey: ioSocket.telehealthOpentok.apiKey,
                            sessionId: ioSocket.telehealthOpentok.sessionId,
                            token: ioSocket.telehealthOpentok.token,
                            userName: userName,
                            uidCall: userCall,
                            uidUser: userInfo.TelehealthUser.UID,
                        }), "CAll", { directories: "no" });
                    } else {
                        toastr.error("Patient Is Not Exist", "Error");
                    };
                });
            };
        },
    };
});

app.directive("drawingDirective", function() {
    return {
        scope: {
            color: '=',
            lineWidth: '=',
        },
        restrict: "A",
        link: function(scope, element, attr) {
            var ctx = element[0].getContext('2d');

            // variable that decides if something should be drawn on mousemove
            var drawing = false;

            // the last coordinates before the current move
            var lastX;
            var lastY;

            element.bind('mousedown', function(event) {

                lastX = event.offsetX;
                lastY = event.offsetY;

                // begins new line
                ctx.beginPath();

                drawing = true;
            });
            element.bind('mousemove', function(event) {
                if (drawing) {
                    // get current mouse position
                    currentX = event.offsetX;
                    currentY = event.offsetY;

                    draw(lastX, lastY, currentX, currentY);

                    // set current coordinates to last one
                    lastX = currentX;
                    lastY = currentY;
                }

            });
            element.bind('mouseup', function(event) {
                // stop drawing
                drawing = false;
            });

            // canvas reset
            function reset() {
                element[0].width = element[0].width;
            }

            function draw(lX, lY, cX, cY) {
                // line from
                ctx.moveTo(lX, lY);
                // to
                ctx.lineTo(cX, cY);
                // color
                ctx.strokeStyle = scope.color; //"#4bf";
                // line stroke
                ctx.lineWidth = scope.lineWidth;
                // draw it
                ctx.stroke();
            }
        }
    };
});

// Notification
app.directive("globalNotify", function() {
    return {
        restrict: 'A',
        scope: {
            scope: "="
        },
        templateUrl: 'common/views/globalNotify.html',
        controller: function($scope, $cookies, notificationServices, toastr, $uibModal, $state) {
            var UserInfo = $cookies.getObject('userInfo');
            var Role = [];
            var roles = UserInfo.roles;

            for (var i = 0; i < roles.length; i++) {
                Role.push(roles[i].RoleCode);
            };

            $scope.loadListGlobalNotify = function() {
                var data = {
                    Search: {
                        queue: 'GLOBALNOTIFY',
                        Role: Role,
                        UID: UserInfo.UID
                    },
                    order: 'CreatedDate DESC',
                };

                notificationServices.LoadListGlobalNotify(data).then(function(data) {
                    for (var i = 0; i < data.data.length; i++) {
                        data.data[i].MsgContent = JSON.parse(data.data[i].MsgContent);
                        data.data[i].fromTime = moment(data.data[i].CreatedDate).fromNow();
                        if (data.data[i].Read.indexOf(UserInfo.UID) === -1) {
                            data.data[i].iRead = 'N'
                        };
                    };
                    $scope.listGlobalNotify = data.data;
                    $scope.globalCount = data.count;
                    console.log("Count", data.count);
                    console.log("$scope.listGlobalNotify", $scope.listGlobalNotify);
                });
            };

            function ReloadSocket() {
                if (socketNcFunction.LoadGlobalNotify) {
                    socketNcFunction.LoadGlobalNotify("msg");
                };
                if (socketNcFunction.LoadListGlobal) {
                    socketNcFunction.LoadListGlobal();
                };
            };

            $scope.OpenDetail = function(global) {
                if (global.MsgContent.Command && global.MsgContent.Command.Url_State) {
                    $state.go(global.MsgContent.Command.Url_State, { UID: global.MsgContent.Display.Object.UID });
                } else {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        size: 'lg', // windowClass: 'app-modal-window', 
                        templateUrl: 'modules/notification/views/notificationGlobalDetail.html',
                        resolve: {
                            data: function() {
                                return global;
                            }
                        },
                        controller: 'notificationGlobalDetailCtrl',
                    });
                    modalInstance.result.then(function(result) {
                        if (result === 'Close') {
                            ReloadSocket();
                        };
                    }, function(err) {
                        console.log("globalNotify.Directive", err);
                    });
                };

                // Change Read Log
                if (global.Read.indexOf(UserInfo.UID) === -1) {
                    var info = {
                        ID: global.ID,
                        Read: global.Read,
                        UserUID: UserInfo.UID
                    };
                    notificationServices.ChangeReadQueueJobg(info).then(function(data) {
                        ReloadSocket();
                    }, function(err) {
                        console.log("GlobalNotify.ChangeReadQueueJobg", err);
                    });
                };
            };

            $scope.dissMissAll = function() {
                if ($scope.globalCount > 0) {
                    var info = {
                        Role: Role,
                        UID: UserInfo.UID,
                        queue: 'GLOBALNOTIFY',
                    };
                    notificationServices.ChangeReadAllQueueJobg(info).then(function(data) {
                        ReloadSocket()
                    });
                };
            };

            socketNcFunction.LoadGlobalNotify = function(msg) {
                $scope.loadListGlobalNotify();
                if (msg != 'msg') {
                    toastr.info(msg.Display.Subject + " send you a message ", "Notification");
                }
            };

            $scope.loadListGlobalNotify();
        },
    };
});

app.directive("privateNotify", function() {
    return {
        restrict: 'A',
        scope: {
            scope: "="
        },
        templateUrl: 'common/views/privateNotify.html',
        controller: function($scope, $cookies, notificationServices, AuthenticationService, toastr, $uibModal, $state) {
            var UserInfo = $cookies.getObject('userInfo');;

            $scope.loadListNotify = function() {
                // var roles = UserInfo.roles;
                var userUID = UserInfo.UID;
                var queue = 'NOTIFY';

                var info = {
                    Search: {
                        userUID: userUID,
                        queue: queue
                    },
                    order: 'CreatedDate DESC',
                };

                console.log('%c loadListNotify!!!!!!!!!!!!!!!!!!!!!!! ', 'background: #222; color: #bada55');
                notificationServices.getListNotifySearch(info).then(function(data) {
                    for (var i = 0; i < data.data.length; i++) {
                        data.data[i].MsgContent = JSON.parse(data.data[i].MsgContent);
                        data.data[i].fromTime = moment(data.data[i].CreatedDate).fromNow();
                    };
                    console.log("listNotify", data.data);
                    console.log("listNotify", data.count);
                    $scope.listNotify = data.data;
                    $scope.UnReadCount = data.count;
                });
            };

            $scope.loadListNotify();

            function ReloadSocket() {
                if (socketNcFunction.LoadPrivateNotify) {
                    socketNcFunction.LoadPrivateNotify("msg");
                };
                if (socketNcFunction.LoadListPrivate) {
                    socketNcFunction.LoadListPrivate();
                };
            };

            function UpdateQueueJob(whereClause) {
                AuthenticationService.updateReadQueueJob(whereClause).then(function(data) {
                    if (data.status === 'success') {
                        ReloadSocket();
                    };
                }, function(err) {
                    console.log("updateReadQueueJob ", err);
                });
            };

            $scope.updateReadQueueJob = function(queuejob) {
                var userUID = UserInfo.UID;
                var queue = 'NOTIFY';
                var whereClause = {
                    userUID: userUID,
                    queue: queue
                };
                if (queuejob) {
                    if (queuejob.Read === 'N') {
                        whereClause.ID = queuejob.ID;
                        UpdateQueueJob(whereClause);
                    };
                    if (queuejob.MsgContent.Command && queuejob.MsgContent.Command.Url_State) {
                        $state.go(queuejob.MsgContent.Command.Url_State, { UID: queuejob.MsgContent.Display.Object.UID });
                    } else {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            size: 'lg', // windowClass: 'app-modal-window', 
                            templateUrl: 'modules/notification/views/notificationPrivateDetail.html',
                            resolve: {
                                data: function() {
                                    return queuejob;
                                }
                            },
                            controller: 'notificationPrivateDetailCtrl',
                        });
                        modalInstance.result.then(function(result) {
                            if (result === 'Close') {
                                ReloadSocket();
                            };
                        }, function(err) {
                            console.log("globalNotify.Directive", err);
                        });
                    };
                } else {
                    if ($scope.UnReadCount > 0) {
                        UpdateQueueJob(whereClause);
                    };
                };
            };

            socketNcFunction.LoadPrivateNotify = function(msg) {
                $scope.loadListNotify();
                console.log(msg);
                if (msg != 'msg') {
                    toastr.info(msg.Display.Subject + " send you a message ", "Notification");
                }
            };

            socketNcFunction.LoadTodoNotify = function(msg) {
                $scope.loadListNotify();
                console.log(msg);
                if (msg != 'msg') {
                    toastr.info(msg.Display.Subject + " sent you a message in TodoList ", "Notification");
                }
            };

            socketNcFunction.LoadRequestNotify = function(msg) {
                $scope.loadListNotify();
                console.log(msg);
                if (msg != 'msg') {
                    toastr.info(msg.Display.Subject + " sent you a message in Request ", "Notification");
                }
            };

            socketNcFunction.LoadReviewNotify = function(msg) {
                $scope.loadListNotify();
                console.log(msg);
                if (msg != 'msg') {
                    toastr.info(msg.Display.Subject + " sent you a message in Review ", "Notification");
                }
            };
        },
    };
});

// End Notification
