var app = angular.module('app.authentication.booking',[
	'app.authentication.booking.controller',
	'app.authentication.booking.services'
]);

app.config(function($stateProvider){
	$stateProvider
		.state('authentication.booking',{
			abstract: true,
			data: {title: 'booking', pageTitle: 'booking'},
			url: '/booking',
			templateUrl: 'modules/booking/views/booking.html',
			controller: 'bookingCtrl',
		})
		.state('authentication.booking.scheduler',{
			data: {title: 'Booking Scheduler', pageTitle: 'Booking Scheduler'},
			url: '/scheduler',
			templateUrl: 'modules/booking/views/scheduler.html',
			controller: 'schedulerCtrl',
		})
		;
});