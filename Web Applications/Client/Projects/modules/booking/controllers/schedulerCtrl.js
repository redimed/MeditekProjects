var app = angular.module('app.authentication.booking.scheduler.controller',[
    'app.authentication.booking.scheduler.create.controller',
    'app.authentication.booking.scheduler.edit.controller',
    'app.authentication.booking.scheduler.delete.controller',
]);
app.controller('schedulerCtrl', function($scope,$timeout, $uibModal, RosterService){
        var currentEvent = {id: ''};
        var oldEvent = {id: ''};
        function ServerListBooking(startDate){
            var postData = {
                    Filter: [
                            {
                                Roster: {
                                    Enable: 'Y',
                                    FromTime: startDate
                                }
                            }
                    ]
            }
            RosterService.PostListRoster(postData)
            .then(function(response){
                    var events = [];
                    _.forEach(response.data.rows, function(roster, index){
                            var doctor = roster.UserAccounts[0].Doctor;
                            var FromTime = moment(roster.FromTime).format('YYYY-MM-DDTHH:mm:ss');
                            var EndTime = moment(roster.ToTime).format('YYYY-MM-DDTHH:mm:ss');
                            var event = {
                                    id: roster.UID,
                                    resourceId: doctor.UID,
                                    start: FromTime,
                                    end: EndTime,
                                    color: roster.Services[0].Colour,
                                    rendering: 'background',
                                    Services: roster.Services,
                                    Sites: roster.Sites,
                                    UserAccounts: roster.UserAccounts
                            };
                            $('#calendar').fullCalendar('addResource', {
                                    id: doctor.UID, title: doctor.FirstName+' '+doctor.LastName
                            });
                            events.push(event);
                    });
                    $('#calendar').fullCalendar('addEventSource',events);
            }, function(error){
                    
            })
            
        }

    function formatDate(data){
        return moment(data).subtract(0,'days').format("DD/MM/YYYY");
    };
    function formatTime(data){
        return moment(data).subtract(0,'time').format("hh:mm:ss a");
    };
    $scope.eventRender = function(event, element, view) {
        element.attr('title', 
            event.title
            +'\n'+formatDate(event.start)
            +'\n'+formatTime(event.start) + ' - ' + formatTime(event.end)
        );
    };

     $scope.viewRender = function(view, element){
            //INIT
            var date = $('#calendar').fullCalendar('getDate');
            var zone = moment().format('Z');
            var today = moment(date).format('YYYY-MM-DD'+' '+zone);
            ServerListBooking(today);
    };

    $scope.eventAfterRender = function(event, element, view){
        if (event.rendering != 'background') {
            $(element).attr('id', 'event_id_'+event._id);
            $.contextMenu({
                selector: '#event_id_'+event._id,
                items: {
                    edit: {
                        name: 'Edit', 
                        callback: function(key,opt){
                            var modalInstance = $uibModal.open({
                                animation: true,
                                size: 'md',
                                templateUrl: 'modules/booking/views/schedulerEdit.html',
                                controller: 'schedulerEditCtrl',
                                resolve: {
                                    event: function(){
                                        return event;
                                    }
                                },
                            });
                            modalInstance.result
                                .then(function(result) {
                                    var dataEvent = {
                                        resourceId: resource.id,
                                        title: result.service,
                                        start: start,
                                        end: end,
                                        allDay: allDay,
                                        isReoccurance: result.isReoccurance,
                                        reoccuranceType: result.reoccuranceType,
                                        endReoccurance: result.endReoccurance,
                                    };
                                    $scope.events.push(result);
                                    $scope.scheduler.fullCalendar('renderEvent', dataEvent, true);
                                    $scope.scheduler.fullCalendar('unselect');
                                }, function(result) {
                                    // dismiss
                                });
                        },
                        icon: function(opt, $itemElement, itemKey, item){
                            // Set the content to the menu trigger selector and add an bootstrap icon to the item.
                            $itemElement.html('<span class="glyphicon glyphicon-edit" aria-hidden="true"></span> Edit');
                            // Add the context-menu-icon-updated class to the item
                            return 'context-menu-icon-updated';
                        }
                    },
                    delete: {
                        name: 'Delete',
                        callback: function(key, opt){
                            var modalInstance = $uibModal.open({
                                animation: true,
                                size: 'md',
                                templateUrl: 'modules/booking/views/schedulerDelete.html',
                                controller: 'schedulerDeleteCtrl',
                                resolve: {
                                    event: function(){
                                        return event;
                                    }
                                },
                            });
                            modalInstance.result
                                .then(function(result) {
                                    var dataEvent = {
                                        resourceId: resource.id,
                                        title: result.service,
                                        start: start,
                                        end: end,
                                        allDay: allDay,
                                        isReoccurance: result.isReoccurance,
                                        reoccuranceType: result.reoccuranceType,
                                        endReoccurance: result.endReoccurance,
                                    };
                                    $scope.events.push(result);
                                    $scope.scheduler.fullCalendar('renderEvent', dataEvent, true);
                                    $scope.scheduler.fullCalendar('unselect');
                                }, function(result) {
                                    // dismiss
                                });
                        },
                        icon: function(opt, $itemElement, itemKey, item){
                            // Set the content to the menu trigger selector and add an bootstrap icon to the item.
                            $itemElement.html('<span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Delete');
                            // Add the context-menu-icon-updated class to the item
                            return 'context-menu-icon-updated';
                        }
                    }
                },
            });
        }
    };

    // create new event
    $scope.select = function(start, end, jsEvent, view, resource, event, allDay ) {

            if(oldEvent.id !== currentEvent.id){
                    var modalInstance = $uibModal.open({
                                animation: true,
                                size: 'md',
                                templateUrl: 'modules/booking/views/schedulerCreate.html',
                                controller: 'schedulerCreateCtrl',
                                resolve: {
                                        event: function(){
                                                return currentEvent;
                                        },
                                        start: function(){
                                                return start;
                                        },
                                        end: function(){
                                                return end;
                                        }
                                }
                    });
                    modalInstance.result
                    .then(function(result) {
                            //$scope.events.splice(0, $scope.events.length);
                            //ServerListCalendar($scope.calendarTemp.startDate,$scope.calendarTemp.endDate);
                    }, function() {});
                    currentEvent = {id: ''};
            }
    };
    $scope.selectOverlap = function(event){
            currentEvent = event;
            return true;
    },
    $scope.eventClick = function(event, jsEvent, view, start, end, element){
    };

    // move a event
    $scope.eventDrop = function(event) {
        $scope.events[event.id] = event;
    };
    // scale a event
    $scope.eventResize = function(event, jsEvent, ui, view) {
    	$scope.events[event.id] = event;
    };

    var todayNotTZ = moment().format('YYYY-MM-DD');

    $scope.scheduler = angular.element('#calendar').fullCalendar({
        schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
        timezone: 'UTC',
        defaultView: 'agendaDay', // the hien trong ngay // 'agendaWeek' the hien trong tuan
        ignoreTimezone: false,
        defaultDate: todayNotTZ,
        editable: false,
        slotDuration: '00:05:00',//'00:5:00', // khoang cach thoi gian
        selectable: true, //true, // ko cho select
        eventLimit: true, // allow "more" link when too many events
        scrollTime: moment(),
        minTime: "07:00:00",
        maxTime: "18:00:00",
        header: {
            left: 'today prev,next ',
            center: 'title',
            right: 'agendaDay,agendaTwoDay, agendaWeek',// right: 'agendaDay,agendaTwoDay,agendaWeek,month'
        },
        views: {
            agendaTwoDay: {
                type: 'agenda',
                duration: {
                    days: 2
                },

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
        eventMouseover: function(data, event, view){
        },
        eventMouseout: function(calEvent,jsEvent) {
        },
    }); 
});