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

app.directive('patientDetailDirective', function($uibModal, $timeout) {
    return {
        restrict: 'E',
        scope: {
            info: "="
        },
        templateUrl: 'common/views/patientDetailDirective.html',
        controller: function($scope, WAAppointmentService) {
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
                };
            };

            $scope.sendEmail = function(){
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: 'common/views/sendEmail.html',
                    resolve: {
                    },
                    controller: function($scope, $stateParams, CommonService, FileUploader, toastr, $cookies){
                        var self = $scope;
                        App.initAjax();                    
                        self.data = {                            
                            sender: null,
                            recipient:[],
                            bodyContent: "",
                            subject: "",
                        };
                        var userInfo = $cookies.getObject('userInfo');
                        console.log("userInfo", userInfo.UID);
                        self.uploadFile = {
                                patientUID: $stateParams.UIDPatient,
                                ApptUID: $stateParams.UID,
                                userUID:  userInfo.UID
                            }
                                                             
                        self.UIDTemplate = [];                         

                        self.cutstring = function(string){
                            var string = string.split(", ");                            
                        };

                        self.checkUIDTemplate = function(Note,index) {
                            console.log("index", index);                            
                            console.log("Note", Note);
                            console.log("Note", Note);
                            console.log("self.UIDTemplate", self.UIDTemplate);
                            var checkExit = 0
                            for(key in self.UIDTemplate){
                                console.log("self.UIDTemplate>>>>>>>>", self.UIDTemplate[key]);
                            }
                            if (self.UIDTemplate[Note] == ""){
                                delete self.UIDTemplate[Note]
                            }
                            console.log("self.UIDTemplate", self.UIDTemplate);

                                                     
                        };                        

                        self.getEformTemplant = function(){
                            console.log("self.UIDTemplate", self.UIDTemplate);
                            console.log("..............", $stateParams);
                            self.info = {
                                patientUID: $stateParams.UIDPatient,
                                search:{
                                    ApptUID: $stateParams.UID
                                }
                            };
                            CommonService.getListEformTemplant(self.info).then(function(data) {
                                console.log("|||||||||||||||||||||||||||||||||||", data);
                                self.attach = data.rows;  
                                for (var i = 0; i < self.attach.length; i++) {
                                      self.attach[i].Note = ( self.attach[i].Note == null)? self.attach[i].UID :  self.attach[i].Note;
                                  } 

                            })
                        };
                        self.getEformTemplant();

                        self.close = function(){
                            modalInstance.close();
                        };

                        self.submitted = false;                        

                        self.send = function(){
                            self.submitted = true;
                            // if (self.myForm.Subject.$invalid || self.myForm.email1.$dirty && self.myForm.email1.$invalid || self.myForm.Content.$invalid ) {
                            if (self.myForm.$invalid){
                                toastr.error("you must enter full information !!!!!");                            
                            }
                            else
                            {
                                o.loadingPage(true);
                                // if (self.data.bodyContent === null || self.data.bodyContent === undefined) {
                                //     self.data.bodyContent = " ";
                                // }                            
                                self.data.recipient = self.data.recipient[0].split(", ");                                                 
                                self.attachments = [];

                                for (var key in self.UIDTemplate){
                                    console.log(key," here ", self.UIDTemplate[key]);
                                    if(self.UIDTemplate[key] != "" && self.UIDTemplate[key] != null && self.UIDTemplate[key] != undefined){
                                        console.log("this is the value - ",self.UIDTemplate[key]);
                                        var subStrs = self.UIDTemplate[key].split(".");
                                        var name = '';
                                        for (var i = 0; i < self.attach.length; i++) {
                                            if (self.attach[i].UID === self.UIDTemplate[key] || self.attach[i].Note === self.UIDTemplate[key]) {
                                                name = self.attach[i].Name;
                                            };
                                        };
                                        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>> aaaaaaaaa", name);
                                        tmp = {
                                            type:subStrs.length>1?"fileupload":"report",
                                            content: subStrs[0],
                                            name:name,
                                            extension:subStrs.length>1?subStrs[1]:"pdf"
                                        };
                                        self.attachments.push(tmp);
                                    }
                                }                            
                                if (self.attachments.length > 0) {
                                    self.data.attachments = self.attachments;
                                }
                                else{
                                    if (self.data.attachments) {
                                        delete self.data.attachments;
                                    }
                                }
                                // toastr.info('Sending...');                                                                                                                                                
                                CommonService.sendEmail(self.data).then(function(data){
                                     o.loadingPage(false);                              
                                    modalInstance.close();                                                                                            
                                    toastr.success('Send successfully');
                                }, function(err){
                                     o.loadingPage(false);
                                    toastr.error('Send failed',"Unexpected Error");
                                })   
                            }
                                         
                        };
                    },
                });
                modalInstance.result
                    .then(function(result) {
                    }, function(result) {
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
