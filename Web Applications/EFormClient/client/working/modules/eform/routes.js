var EFormTemplate = require('modules/eform/eformTemplate');
var EFormTemplateDetail = require('modules/eform/eformTemplateDetail');
var EFormDetail = require('modules/eform/eformDetail');

module.exports = [
	{path: '/eformTemplate', component: EFormTemplate},
	{path: '/eformTemplate/detail/:templateUID/:userUID', component: EFormTemplateDetail},
             {path: '/eform/detail', component: EFormDetail}
]