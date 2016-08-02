var app = angular.module('app.authentication.booking.controller',[
	'app.authentication.booking.scheduler.controller',
	'app.authentication.booking.patient',
	'app.authentication.booking.selectDoctor.controller',
]);

app.controller('bookingCtrl', function(){
	console.log('bookingCtrl');
});