var app = angular.module('app.authentication.booking.scheduler.controller',[
    'app.authentication.booking.scheduler.create.controller',
    'app.authentication.booking.scheduler.edit.controller',
    'app.authentication.booking.scheduler.delete.controller',
]);

app.controller('schedulerCtrl', function($scope,$timeout, $uibModal){
	$scope.events = [
	    {
            _id: '1',
	        id: '1',
	        resourceId: 'a',
	        start: '2016-01-06',
	        end: '2016-01-08',
	        title: 'event 1',
            allDay: true,
            tooltip: 'This is a cool event1',
	    }, {
            _id: '2',
	        id: '2',
	        resourceId: 'a',
	        start: '2016-01-07T09:00:00',
	        end: '2016-01-07T14:00:00',
	        title: 'event 2',
            tooltip: 'This is a cool event2',
	    }, {
            _id: '3',
	        id: '3',
	        resourceId: 'b',
	        start: '2016-01-07T12:00:00',
	        end: '2016-01-08T06:00:00',
	        title: 'event 3',
            tooltip: 'This is a cool event3',
	    }, {
            _id: '4',
	        id: '4',
	        resourceId: 'd',
	        start: '10:00',
	        end: '10:05',
	        title: 'My repeating event',
            tooltip: 'This is a cool event4',
            dow: [1], // Repeat monday
            ranges: [{
                start: moment().startOf('week'), //next two weeks
                end: moment().endOf('week').add(7,'d'),
            }],
	    }, 
	];
	$scope.resources = [
		{
	        id: 'a',
	        title: 'Room A'
	    }, {
	        id: 'b',
	        title: 'Room B',
	        eventColor: 'green'
	    }, {
	        id: 'c',
	        title: 'Room C',
	        eventColor: 'orange'
	    }, {
	        id: 'd',
	        title: 'Room D',
	        eventColor: 'red'
	    },
    ];

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

        })
    };

    // create new event
    $scope.select = function(start, end, jsEvent, view, resource, event, allDay ) {
        // console.log(
        // 	title,
        // 	jsEvent.pageX + ',' + jsEvent.pageY,
        // 	start.format(start, "yyyy-MM-dd HH:mm:ss"),
        // 	end.format(end, "yyyy-MM-dd HH:mm:ss"),
        // 	resource ? resource.id : '(no resource)'
        // );

		// var title = prompt('Event Title:');
  //       var dataEvent = {
	 //        resourceId: resource.id,
	 //        title: title,
	 //        start: start,
  //           end: end,
  //           allDay: allDay,
	 //    };
	 //    if(title){
	 //    	$scope.events.push(event);
	 //        $scope.scheduler.fullCalendar('renderEvent', dataEvent, true);
	 //        $scope.scheduler.fullCalendar('unselect');
	 //    }



	    var modalInstance = $uibModal.open({
            animation: true,
            size: 'md',
            templateUrl: 'modules/booking/views/schedulerCreate.html',
            controller: 'schedulerCreateCtrl',
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

    };
    // $scope.dayClick = function(date, jsEvent, view, resource) {
    // };
    $scope.eventClick = function(event, jsEvent, view, start, end, element){
        
    	// event.title = "CLICKED!";
    	// $scope.scheduler.fullCalendar('updateEvent', event);
    	// console.log('Event: ' + event.title);
        // console.log('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
        // console.log('View: ' + view.name);
    };

    // remove event
    // $scope.eventRightclick = function(event, jsEvent, view) {
    //     var r = confirm("Do you want to delete event " + event.title + " ?");
    //     if(r == true){
    //         for (var i = 0; i < $scope.events.length; i++){
    //             if ($scope.events[i]._id == event._id) {
    //                 $scope.events.splice(i,1);
    //                 $scope.scheduler.fullCalendar('removeEvents', event._id);
    //                 alert('Success!');
    //                 break;
    //             }
    //         }  
    //     }
    //     // Prevent browser context menu:
    //     return false;
    // };

    
    // move a event
    $scope.eventDrop = function(event) {
        $scope.events[event.id] = event;

        // console.log($scope.events[event.id].resourceId);
        // console.log($scope.events[event.id].start.format($scope.events[event.id].start, "yyyy-MM-dd HH:mm:ss"));
        // console.log($scope.events[event.id].end.format($scope.events[event.id].end, "yyyy-MM-dd HH:mm:ss"));
    };
    // scale a event
    $scope.eventResize = function(event, jsEvent, ui, view) {
    	$scope.events[event.id] = event;

    	// console.log($scope.events[event.id].start.format($scope.events[event.id].start, "yyyy-MM-dd HH:mm:ss"));
        // console.log($scope.events[event.id].end.format($scope.events[event.id].end, "yyyy-MM-dd HH:mm:ss"));

        // console.log('eventResize', event);
        // console.log('jsEvent', jsEvent);
        // console.log('ui', ui);
        // console.log('view', view);
    };
    var i = 10;
    $scope.changeEvent = function(event){
        $scope.submitted = true;
        if($scope.form.$valid){
            alert('ss');
        }
    };


    $scope.scheduler = angular.element('#calendar').fullCalendar({
        schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
        defaultView: 'agendaDay', // the hien trong ngay // 'agendaWeek' the hien trong tuan
        defaultDate: '2016-01-07',
        editable: true,
        slotDuration: '00:30:00',//'00:5:00', // khoang cach thoi gian
        selectable: true, //true, // ko cho select
        eventLimit: true, // allow "more" link when too many events
        scrollTime: moment(),
        // minTime: "07:00:00",
        // maxTime: "21:00:00",
        header: {
            left: 'promptResource today prev,next ',
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
        customButtons: {
			promptResource: {
				text: '+ room',
				click: function() {
					var title = prompt('Resource Title:');
					var eventColor = prompt('Resource Color:');
					var resource = { id: i++, title: title, eventColor: eventColor };
					if (title) {
						$scope.resources.push(resource);
						$('#calendar').fullCalendar('addResource',
							resource,
							true // scroll to the new resource?
						);
					}
				}
			}
		},
        // -----------------------------------------
        //// uncomment this line to hide the all-day slot
        //allDaySlot: false, // ko show row all-day
        resources: $scope.resources,
        events: $scope.events,
        // -----------------------------------------
        eventClick: $scope.eventClick,
        eventRender: $scope.eventRender,
        eventAfterRender: $scope.eventAfterRender,
        select: $scope.select,
        // dayClick: $scope.dayClick,
        eventDrop: $scope.eventDrop,
        eventResize: $scope.eventResize,
        eventMouseover: function(data, event, view){
        },
        eventMouseout: function(calEvent,jsEvent) {
        },
    }); 
});