var app = angular.module('app.authentication.booking.scheduler.controller', [
    'app.authentication.booking.scheduler.create.controller',
    'app.authentication.booking.scheduler.edit.controller',
    'app.authentication.booking.scheduler.delete.controller',
]);
app.controller('schedulerCtrl', function($scope, $timeout, $uibModal, $cookies, RosterService, BookingService, toastr) {

    $('#datepicker-inline').datepicker({
        autoclose: true,
        format: 'dd/mm/yyyy'
    });
    $('#datepicker-inline').datepicker().on('changeDate', function(ev) {
        var date = ev.target.value;
        if (date) {
            var dateMoment = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00';
            $('#calendar').fullCalendar('gotoDate', dateMoment);
        }
    });


    function getListSite() {
        RosterService.GetListSite()
            .then(function(response) {
                $scope.listSites = response.data;
            }, function(error) {

            })
    }

    $scope.eventResize = function(event, delta, revertFunc, jsEvent, ui, view) {
        var zone = moment().format('Z');
        var data = {
            UID: event.id,
            fromTime: moment(event.start).format('YYYY-MM-DD HH:mm:ss') + ' ' + zone,
            toTime: moment(event.end).format('YYYY-MM-DD HH:mm:ss') + ' ' + zone,
            serviceUID: event.Service.UID,
            siteUID: event.SiteID,
            doctorUID: event.resourceId,
            patientUID: event.Patient.UID
        }
        ServerUpdateBooking(data, revertFunc);
    }

    function ServerUpdateBooking(data, revertFunc) {
        var postData = {
            Appointment: {
                UID: data.UID,
                FromTime: data.fromTime,
                ToTime: data.toTime
            },
            Service: {
                UID: data.serviceUID
            },
            Site: {
                UID: data.siteUID
            },
            Doctor: {
                UID: data.doctorUID
            },
            Patient: {
                UID: data.patientUID
            }
        }
        swal({
            title: 'Are you sure?',
            text: 'It will change your appointment!!!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            allowOutsideClick: false,
            closeOnConfirm: false,
            closeOnCancel: true
        }, function(isConfirm) {
            if (isConfirm) {
                BookingService.UpdateBooking(postData)
                    .then(function(response) {
                        var today = getDateCalendar();
                        ServerListBooking(today);
                        swal.close();
                        toastr.success('Update Booking Successfully');
                    }, function(error) {
                        if (typeof error.data !== 'undefined') {
                            var type = error.data.status;
                            switch (type) {
                                case 'withoutRoster':
                                    toastr.error('Booking Appointment Time Wrong !!!');
                                    revertFunc();
                                    swal.close();
                                    break;
                            }
                        }
                    })
            } else {
                revertFunc();
            }
        })
    }

    $scope.search = {
        site: ''
    }

    $scope.searchSite = function(site) {
        var today = getDateCalendar();
        ServerListBooking(today);
    }

    var statuses = {
        Received: '#4AC3DA',
        Pending: '#2D67B2',
        Approved: '#5457A6',
        Attended: '#BB69AA',
        Waitlist: '#E14845',
        Finished: '#D48147',
        Cancelled: 'black'
    };

    var userRole = 0;
    if (typeof $cookies.getObject('userInfo')) {
        userRole = $cookies.getObject('userInfo').roles[0].ID;
    }

    var currentEvent = {
        id: ''
    };
    var oldEvent = {
        id: ''
    };

    function ServerListBooking(startDate) {
        var postData = {
            Filter: [{
                Roster: {
                    Enable: 'Y',
                    FromTime: startDate
                }
            }, {
                Site: {
                    UID: $scope.search.site
                }
            }],
            Order: [{
                UserAccount: {
                    Username: 'ASC'
                }
            }]
        }
        $('#calendar').fullCalendar('removeEvents');
        var resources = $('#calendar').fullCalendar('getResources');
        _.forEach(resources, function(resource, index) {
            $('#calendar').fullCalendar('removeResource', resource);
        })
        RosterService.PostListRoster(postData)
            .then(function(response) {
                var events = [];

                _.forEach(response.data.rows, function(roster, index) {
                    var doctor = roster.UserAccounts[0].Doctor;
                    var FromTime = moment(roster.FromTime).format('YYYY-MM-DDTHH:mm:ss');
                    var EndTime = moment(roster.ToTime).format('YYYY-MM-DDTHH:mm:ss');
                    var event = {
                        id: roster.UID,
                        resourceId: doctor.UID,
                        start: FromTime,
                        end: EndTime,
                        enddate: EndTime,
                        color: roster.Services[0].Colour,
                        rendering: 'background',
                        Services: roster.Services,
                        Sites: roster.Sites,
                        UserAccounts: roster.UserAccounts
                    };
                    $('#calendar').fullCalendar('addResource', {
                        id: doctor.UID,
                        title: doctor.FirstName + ' ' + doctor.LastName,
                        Services: roster.Services,
                        type1: doctor.UID
                    });
                    events.push(event);
                });
                $('#calendar').fullCalendar('addEventSource', events);

                var bookingData = {
                    Filter: [{
                        Appointment: {
                            Enable: 'Y',
                            FromTime: startDate,
                            Status: { $ne: 'Cancelled' }
                        }
                    }, {
                        Site: {
                            UID: $scope.search.site
                        }
                    }]
                }
                var bookingEvents = [];
                BookingService.LoadBooking(bookingData)
                    .then(function(response) {
                        _.forEach(response.data.rows, function(appointment, index) {
                            var doctor = appointment.Doctors[0];
                            var patient = appointment.Patients[0];
                            var service = appointment.Services[0];
                            var FromTime = moment(appointment.FromTime).format('YYYY-MM-DDTHH:mm:ss');
                            var EndTime = moment(appointment.ToTime).format('YYYY-MM-DDTHH:mm:ss');
                            var SiteID = appointment.Site.UID;
                            var event = {
                                id: appointment.UID,
                                resourceId: doctor.UID,
                                start: FromTime,
                                end: EndTime,
                                enddate: EndTime,
                                color: statuses[appointment.Status],
                                Patient: patient,
                                Service: service,
                                SiteID: SiteID
                            };
                            bookingEvents.push(event);
                        });
                        $('#calendar').fullCalendar('addEventSource', bookingEvents);
                    })
            }, function(error) {

            })

    }

    function formatDate(data) {
        return moment(data).subtract(0, 'days').format("DD/MM/YYYY");
    };

    function formatTime(data) {
        return moment(data).subtract(0, 'time').format("hh:mm:ss a");
    };
    $scope.eventRender = function(event, element, view) {
        angular.element('.fc-other-month').css('background', '#eee');
        if (!startedViewRender)
            return;
        else
            startedViewRender = false;

        var events = $('#calendar').fullCalendar('clientEvents');

        if (events.length === 0) {
            console.log('no events at all');
            //Set to default times?
            return;
        }

        var visibleAndNotAllDayEvents = events.filter(function(event) {
            //end not necessarily defined
            var endIsWithin = event.end ? event.end.isWithin(view.start, view.end) : false;
            return !event.allDay && (event.start.isWithin(view.start, view.end) || endIsWithin);
        });

        if (visibleAndNotAllDayEvents.length === 0) {
            console.log('no visible not all day events');
            //Set to default times?
            return;
        }

        var earliest = visibleAndNotAllDayEvents.reduce(function(previousValue, event) {
            return greaterTime(previousValue, event.start).isSame(previousValue) ? event.start : previousValue;
        }, moment('23:59:59', 'HH:mm:ss'));

        var latest = visibleAndNotAllDayEvents.reduce(function(previousValue, event) {
            var end = event.end ? event.end.clone() : event.start.clone().add(moment(calendarConfig.defaultTimedEventDuration, 'HH:mm:ss'));

            return greaterTime(previousValue, end);
        }, moment('00:00:00', 'HH:mm:ss'));

        if (calendarConfig.minTime !== earliest.format('HH:mm:ss') || calendarConfig.maxTime !== latest.format('HH:mm:ss')) {
            //Reinitialize the whole thing

            var currentDate = $('#calendar').fullCalendar('getDate');

            $('#calendar').fullCalendar('destroy');
            setTimeout(function() {
                $('#calendar').fullCalendar($.extend(calendarConfig, {
                    defaultDate: currentDate,
                    minTime: earliest.format('HH:mm:ss'),
                    maxTime: latest.format('HH:mm:ss')
                }));
            }, 500)
        }
    };

    function getDateCalendar() {
        var date = $('#calendar').fullCalendar('getDate');
        var zone = moment().format('Z');
        var today = moment(date).format('YYYY-MM-DD') + ' 00:00:00 ' + zone;
        return today;
    }

    $scope.viewRender = function(view, element) {
        startedViewRender = true;
        var today = getDateCalendar();
        ServerListBooking(today);
    };


    $scope.eventAfterRender = function(event, element, view) {
        if (typeof event.Patient !== 'undefined') {
            element.find('.fc-content').html(moment(event.start).format('HH:mm').toLowerCase() + '-' + moment(event.enddate).format('HH:mm').toLowerCase());
            element.find('.fc-content').append(' <b>' + event.Patient.FirstName + ' ' + event.Patient.LastName + '</b>');
        }

        if (userRole === 1) {
            if (event.rendering !== 'background') {
                $(element).attr('id', 'event_id_' + event.id);
                $.contextMenu({
                    selector: '#event_id_' + event.id,
                    items: {
                        cancelBooking: {
                            name: 'Cancel Booking',
                            callback: function(key, opt) {
                                var UID = opt.selector.split('_')[2];
                                BookingService.GetDetailBooking({ UID: UID })
                                    .then(function(response) {
                                        var object = response.data;
                                        swal({
                                            title: 'Are you sure?',
                                            text: 'It will make booking status to cancel!!!',
                                            type: 'warning',
                                            showCancelButton: true,
                                            confirmButtonColor: '#DD6B55',
                                            confirmButtonText: 'Yes',
                                            cancelButtonText: 'No',
                                            allowOutsideClick: true,
                                            closeOnConfirm: false,
                                            closeOnCancel: true
                                        }, function(isConfirm) {
                                            if (isConfirm) {
                                                var postData = {
                                                    Appointment: {
                                                        UID: UID,
                                                        Status: 'Cancelled'
                                                    }
                                                }
                                                BookingService.ChangeStatusBooking(postData)
                                                    .then(function(response) {
                                                        var today = getDateCalendar();
                                                        ServerListBooking(today);
                                                        swal.close();
                                                    }, function(error) {})
                                            }
                                        })
                                    }, function(error) {})
                            },
                            icon: function(opt, $itemElement, itemKey, item) {
                                $itemElement.html('<span class="glyphicon glyphicon-calendar" aria-hidden="true"></span> Cancel Booking');
                                return 'context-menu-icon-updated';
                            }
                        },
                        edit: {
                            name: 'Edit',
                            callback: function(key, opt) {
                                var UID = opt.selector.split('_')[2];
                                BookingService.GetDetailBooking({ UID: UID })
                                    .then(function(response) {
                                        var modalInstance = $uibModal.open({
                                            animation: true,
                                            size: 'md',
                                            templateUrl: 'modules/booking/views/schedulerEdit.html',
                                            controller: 'schedulerEditCtrl',
                                            resolve: {
                                                data: function() {
                                                    return response.data;
                                                }
                                            },
                                        });
                                        modalInstance.result
                                            .then(function(result) {
                                                var today = getDateCalendar();
                                                ServerListBooking(today);
                                            }, function() {});
                                    }, function(error) {})
                            },
                            icon: function(opt, $itemElement, itemKey, item) {
                                $itemElement.html('<span class="glyphicon glyphicon-edit" aria-hidden="true"></span> Edit');
                                return 'context-menu-icon-updated';
                            }
                        },
                        delete: {
                            name: 'Delete',
                            callback: function(key, opt) {
                                var UID = opt.selector.split('_')[2];
                                var modalInstance = $uibModal.open({
                                    animation: true,
                                    size: 'md',
                                    templateUrl: 'modules/booking/views/schedulerDelete.html',
                                    controller: 'schedulerDeleteCtrl',
                                    resolve: {
                                        UID: function() {
                                            return UID;
                                        }
                                    },
                                });
                                modalInstance.result
                                    .then(function(result) {
                                        var today = getDateCalendar();
                                        ServerListBooking(today);
                                    }, function() {});
                            },
                            icon: function(opt, $itemElement, itemKey, item) {
                                // Set the content to the menu trigger selector and add an bootstrap icon to the item.
                                $itemElement.html('<span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Delete');
                                // Add the context-menu-icon-updated class to the item
                                return 'context-menu-icon-updated';
                            }
                        }
                    },

                })
            }
        }
    };

    // create new event
    $scope.select = function(start, end, jsEvent, view, resource, event, allDay) {
        if (userRole === 1) {
            if (oldEvent.id !== currentEvent.id) {
                var service = currentEvent.Services[0];
                if (service.Bookable === 'Y') {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        size: 'lg',
                        templateUrl: 'modules/booking/views/schedulerCreate.html',
                        controller: 'schedulerCreateCtrl',
                        resolve: {
                            event: function() {
                                return currentEvent;
                            },
                            start: function() {
                                return start;
                            },
                            end: function() {
                                return end;
                            },
                        }
                    });
                    modalInstance.result
                        .then(function(result) {
                            var today = getDateCalendar();
                            ServerListBooking(today);
                        }, function() {});
                    currentEvent = {
                        id: ''
                    };
                } else {
                    toastr.warning('This Slot Time is not Bookable');
                }
            }
        }
    };
    $scope.selectOverlap = function(event) {
            currentEvent = event;
            return true;
        },
        $scope.eventClick = function(event, jsEvent, view, start, end, element) {};

    var todayNotTZ = moment().format('YYYY-MM-DD');
    var startedViewRender = true;

    function greaterTime(first, second) {
        //Assuming dates are the same year
        if (first.clone().dayOfYear(0).isBefore(second.clone().dayOfYear(0)))
            return second;
        else
            return first;
    }

    var tempCalendarConfig = {};

    var calendarConfig = {
        schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
        timezone: 'UTC',
        eventStartEditable: false,
        defaultView: 'agendaDay', // the hien trong ngay // 'agendaWeek' the hien trong tuan
        ignoreTimezone: false,
        defaultDate: todayNotTZ,
        allDaySlot: false,
        editable: true,
        slotDuration: '00:05:00', //'00:5:00', // khoang cach thoi gian
        selectable: true, //true, // ko cho select
        eventLimit: true, // allow "more" link when too many events
        scrollTime: moment(),
        minTime: "00:00:00",
        maxTime: "24:00:00",
        header: {
            left: 'today prev,next ',
            center: 'title',
            right: '', // right: 'agendaDay,agendaTwoDay,agendaWeek,month'
        },
        views: {
            agendaTwoDay: {
                type: 'agenda',
                // views that are more than a day will NOT do this behavior by default
                // so, we need to explicitly enable it
                groupByResource: true

                //// uncomment this line to group by day FIRST with resources underneath
                //groupByDateAndResource: true
            },
            month: {
                titleFormat: 'YYYY, MM, DD'
            },
        },
        resourceOrder: 'type1',
        resources: [],
        eventClick: $scope.eventClick,
        dayClick: $scope.dayClick,
        eventRender: $scope.eventRender,
        eventAfterRender: $scope.eventAfterRender,
        eventAfterAllRender: $scope.eventAfterAllRender,
        select: $scope.select,
        viewRender: $scope.viewRender,
        selectOverlap: $scope.selectOverlap,
        eventDrop: $scope.eventDrop,
        eventResize: $scope.eventResize,
        eventResizeStop: $scope.eventResizeStop,
        eventMouseover: function(data, event, view) {},
        eventMouseout: function(calEvent, jsEvent) {},
    }

    $scope.scheduler = angular.element('#calendar').fullCalendar(calendarConfig);

    //INIT
    getListSite();
});
////
