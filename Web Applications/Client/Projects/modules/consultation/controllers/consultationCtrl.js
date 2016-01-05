var app = angular.module("app.authentication.consultation.controller",[
	'app.authentication.consultation.list.controller',
	'app.authentication.consultation.detail.controller',
	'app.authentication.consultation.drawing.controller',
	'app.authentication.consultation.services',
	'app.authentication.consultation.directives.listConsultation',
	'app.authentication.consultation.directives.listAppConsultation',
	'app.authentication.consultation.directives.listPatientConsultation'
]);

app.controller('consultationCtrl', function(){
});
