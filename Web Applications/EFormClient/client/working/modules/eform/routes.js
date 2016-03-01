var Main = require('modules/eform/main');
var MainDetail = require('modules/eform/mainDetail');
var MainClient = require('modules/eform/mainClient');
var MainClientDetail = require('modules/eform/mainClientDetail');
var MainClientDetailView = require('modules/eform/mainClientDetailView');

module.exports = [
	{path: '/eformDev', component: Main},
	{path: '/eformDev/detail/:formId', component: MainDetail},
	{path: '/eform', component: MainClient},
	{path: '/eform/detail/appointment/:appointmentId/patient/:patientId/form/:formId/user/:userId', component: MainClientDetail},
	{path: '/eform/detail/appointment/:appointmentId/patient/:patientId/user/:userId/client/:clientId', component: MainClientDetailView}
]