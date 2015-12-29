var app = angular.module('app.blank.drawing',[
	'app.blank.drawing.controller',
]);

app.config(function($stateProvider){
	$stateProvider
		.state('blank.drawing',{
			abstract: true,
			url: '/drawing',
			views: {
				'blank': {
					templateUrl: 'modules/drawing/views/drawing.html',
					controller: 'drawingCtrl',
				}
			}
		})
		.state('blank.drawing.home',{
			data: {pageTitle: 'Drawing Home'},
			url: '/home',
			views: {
				'blank': {
					templateUrl: 'modules/drawing/views/drawingHome.html',
					controller: 'drawingHomeCtrl',
				}
			}
		})
		;
});