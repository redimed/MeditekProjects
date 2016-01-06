var app = angular.module('app.authentication.sandbox.dragTable.controller',[
]);

app.controller('dragTableCtrl', function($scope){
	// reference to the REDIPS.drag library
	var	rd = REDIPS.drag;
	// initialization
	rd.init();
	// set hover color
	rd.hover.colorTd = '#E7C7B2';
	// set drop option to 'shift'
	rd.dropMode = 'shift';
	// set shift mode to vertical2
	rd.shift.mode = 'vertical2';
	// enable shift animation
	rd.shift.animation = true;
	// set animation loop pause
	rd.animation.pause = 20;
	// display action in the message line (list of all event handlers can be found at the drag.js bottom)
	rd.event.clicked	= function () {document.getElementById('message').innerHTML = 'Element is clicked'}
	rd.event.moved		= function () {document.getElementById('message').innerHTML = 'Element is moved'}
	rd.event.notMoved	= function () {document.getElementById('message').innerHTML = 'Element is not moved'}
	rd.event.dropped	= function () {document.getElementById('message').innerHTML = 'Element is dropped'}
	
	$scope.data = [
		{team: 'Kusanagi', name: 'Kyo Kusanari'},
		{team: 'Kusanagi', name: 'Benimaru Nikaido'},
		{team: 'Kusanagi', name: 'Daimon Goro'},
		{team: 'Kusanagi', name: 'Shingo Yabuki'},

		{team: 'Yagami', name: 'Iori Yagami'},
		{team: 'Yagami', name: 'Mature'},
		{team: 'Yagami', name: 'View'},
		{team: 'Yagami', name: 'Eiji'},

	];
});