var app = angular.module('app.authentication.roster.calendar.controller', [
    'app.authentication.roster.calendar.create.controller',
    'app.authentication.roster.calendar.edit.controller',
    'app.authentication.roster.calendar.delete.controller',
]);

app.controller('calendarCtrl', function(doctorService, $state, $scope, $compile, $filter, $timeout, uiCalendarConfig, $uibModal){
    //Config
    var selectedColor = 'yellow';

    $scope.events = [
        {title: 'Event1', start: '2016-01-03T13:30:00'},
        // {title: 'Event1', start: '2016-01-21T13:30:00', color:'brown', textColor: 'white'},
        // {title: 'Event51', start: '2016-01-21T13:25:00', color:'pink', textColor: 'white'},
        // {title: 'Event2', start: new Date(y,m,22,15,30,0), color:'green', allDay: false},
        // {title: 'Event3', start: '2016-01-23T13:25:00', end: '2016-01-24T13:25:00', allDay: false},
        // {title: 'Event4', start: new Date(y,m,24), end: new Date(y,m,26), allDay: false,},
    ];
    $scope.eventSources = [{ events: $scope.events }];
    $scope.data = {};
    $scope.selectedEvent = null;

    function formatDate(data){
        return moment(data).subtract(0,'days').format("DD/MM/YYYY");
    };
    function formatTime(data){
        return moment(data).subtract(0,'time').format("hh:mm:ss");
    };

    $scope.eventRender = function(event, element, view){
        if (event.allDay === 'true') {
            event.allDay = true;
        } else {
            event.allDay = false;
        }
    };
    $scope.eventResize = function(event){
    };
    $scope.eventClick = function(event){
        console.log(event);
        $scope.selectedEvent = event;
        event.color = 'red'; // mau de chon
        $('#calendar').fullCalendar('updateEvent', event);
        /*var modalInstance = $uibModal.open({
            animation: true,
            size: 'md',
            templateUrl: 'modules/roster/views/calendarEdit.html',
            controller: 'calendarEditCtrl',
            resolve: {
                event: function(){
                    return event;
                }
            },
        });
        modalInstance.result
            .then(function(result) {
                
                console.log(result);
                $scope.events.push(result);
            }, function(result) {
                // dismiss
            });*/

        // console.log('eventClick',event);
        // $scope.data = event;
        // $scope.data.startDate = formatDate($scope.data.start);
        // $scope.data.startTime = formatTime($scope.data.start);
        // $scope.data.endDate = formatDate($scope.data.end);
        // $scope.data.endTime = formatTime($scope.data.end);
        // $('#calendar').fullCalendar('updateEvent', event);
    };
    $scope.eventAfterRender = function(event, element, view){
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
                            templateUrl: 'modules/roster/views/calendarEdit.html',
                            controller: 'calendarEditCtrl',
                            resolve: {
                                event: function(){
                                    return event;
                                }
                            },
                        });
                        modalInstance.result
                            .then(function(result) {
                                $scope.events.push(result);
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
                            templateUrl: 'modules/roster/views/calendarDelete.html',
                            controller: 'calendarDeleteCtrl',
                            resolve: {
                                event: function(){
                                    return event;
                                }
                            },
                        });
                        modalInstance.result
                            .then(function(result) {
                                $scope.events.push(result);
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

        })

    };
    $scope.select = function(event){

        var modalInstance = $uibModal.open({
            animation: true,
            size: 'md',
            templateUrl: 'modules/roster/views/calendarCreate.html',
            controller: 'calendarCreateCtrl',
            resolve: {
                event: function(){
                    return event;
                }
            },
        });
        modalInstance.result
            .then(function(result) {
                $scope.events.push(result);
            }, function(result) {
                // dismiss
            });
    };
    $scope.dayClick = function(event){  
    };
    $scope.changeEvent = function(event){
        $scope.submitted = true;
        if($scope.form.$valid){
            // start Datetime
            if ($scope.data.endDate != '' && $scope.data.endTIme != ''){
                var part1 = $scope.data.startDate.split('/');
                var part2 = $scope.data.startTime.split(':');
                var start = new Date(
                    part1[2],   //yyyy
                    part1[1]-1, //mm
                    part1[0],   //dd
                    part2[0],   //hh
                    part2[1],   //mm
                    '00'//part2[2]    //ss
                ); 
                event.start = start;
            }
            // end Datetime
            if ($scope.data.endDate != '' && $scope.data.endTIme != ''){
                var part3 = $scope.data.endDate.split('/');
                var part4 = $scope.data.endTime.split(':');
                var end = new Date(
                    part3[2],   //yyyy
                    part3[1]-1, //mm
                    part3[0],   //dd
                    part4[0],   //hh
                    part4[1],   //mm
                    '00'//part4[2]    //ss
                );
                event.end = end;
            }
            $('#calendar').fullCalendar('updateEvent', event);
        }
    };
    $scope.removeEvent = function(event){
        var r = confirm("Do you want to delete this event ?");
        if(r == true){
            for (var i = 0; i < $scope.events.length; i++){
                if ($scope.events[i]._id === event._id) {
                    $scope.events.splice(i,1);
                    alert('Success!');
                    break;
                }
            }
        }
    };
    $scope.calendarConfig = {
        calendar: {
            schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
            editable: true,
            selectable: true,
            // selectHelper: true,
            // weekMode: 'liquid',
            header: {
                left: 'today prev,next',
                center: 'title',
                right: 'month agendaWeek agendaDay',//'month,agendaWeek,agendaDay'
            },
            height: 450,
            // timeFormat: 'H(:mm)', // uppercase H for 24-hour clock
            eventRender: $scope.eventRender,
            eventAfterRender: $scope.eventAfterRender,
            dayRender: $scope.dayRender,
            eventResize: $scope.eventResize,
            eventClick: $scope.eventClick,
            eventRightclick: $scope.eventRightclick,
            dayClick: $scope.dayClick,
            select: $scope.select,
        }
    };  

});