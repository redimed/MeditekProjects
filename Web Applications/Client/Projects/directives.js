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
        link: function(scope, elem, attrs) {
            $timeout(function() {
                ComponentsDateTimePickers.init();
            });
            elem.addClass('form-control date-picker');
            elem.attr('data-date-format', 'dd/mm/yyyy');
            elem.attr('readonly', true);
            elem.attr('type', 'text');
            elem.attr('placeholder', 'dd/mm/yyyy');
            // elem.attr('data-date-start-date',"20/11/2015");
            // elem.attr('data-date-end-date',"0d" );
        },
    };
});
// Timepicker
app.directive('timePickerNoSeconds', function($timeout) {
    return {
        link: function(scope, elem, attrs) {
            $timeout(function() {
                ComponentsDateTimePickers.init();
            });
            elem.addClass('form-control timepicker timepicker-no-seconds');
            elem.attr('data-format', 'hh:mm A');
            elem.attr('data-default-time', '');
            elem.attr('readonly', true);
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

app.directive('patientDetailDirective', function() {
    return {
        restrict: 'E',
        scope: {
            apptuid: "="
        },
        templateUrl: 'common/views/patientDetailDirective.html',
        controller: function($scope, WAAppointmentService) {
            if ($scope.apptuid) {
                WAAppointmentService.getDetailWAAppointmentByUid($scope.apptuid).then(function(data) {
                    if (data.data != null) {
                        $scope.patientInfo = data.data.Patients[0];
                        console.log('$scope.patientInfo', $scope.patientInfo);
                    };
                }, function(error) {});
            };
        },
    };
});
app.directive('medicareDirective', function() {
    return {
        scope: {
            apptuid: "="
        },
        restrict: 'E',
        templateUrl: 'common/views/medicareDirective.html',
        controller: function($scope, WAAppointmentService) {
            if ($scope.apptuid) {
                WAAppointmentService.getDetailWAAppointmentByUid($scope.apptuid).then(function(data) {
                    if (data.data != null) {
                        $scope.patientTelehealth = data.data.TelehealthAppointment.PatientAppointment;
                        console.log('$scope.patientTelehealth', $scope.patientTelehealth);
                    };
                }, function(error) {});
            }
        },
    };
});
app.directive('appointmentDetailDirective', function() {
    return {
        restrict: 'E',
        scope: {
            apptuid: "="
        },
        templateUrl: 'common/views/appointmentDetailDirective.html',
        controller: function($scope, WAAppointmentService, AuthenticationService, $cookies, $state, toastr) {
            WAAppointmentService.getDetailWAAppointmentByUid($scope.apptuid).then(function(data) {
                if (data.data != null) {
                    $scope.appointmentInfo = data.data;
                    $scope.apptDate = ($scope.appointmentInfo.FromTime != null) ? moment($scope.appointmentInfo.FromTime).format('DD/MM/YYYY') : 'N/A';
                    $scope.apptTime = ($scope.appointmentInfo.FromTime != null) ? moment($scope.appointmentInfo.FromTime).format('HH:mm') : 'N/A';
                };
            }, function(error) {});

            var userInfo = $cookies.getObject('userInfo');
            ioSocket.getRoomOpentok.then(function (data) {
                $scope.Opentok = data.data;
                console.log("$scope.Opentok",$scope.Opentok);
            })
            $scope.funCallOpentok = function() {
                console.log(ioSocket.telehealthOpentok);
                WAAppointmentService.GetDetailPatientByUid({
                    UID: $scope.appointmentInfo.Patients[0].UID
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
