var EFormTemplate = require('modules/eform/eformTemplate');
var EFormTemplateDetail = require('modules/eform/eformTemplateDetail');
var EFormDetail = require('modules/eform/eformDetail');
var EFormTemplateModule = require('modules/eform/eformTemplateModule');
var EFormTemplateModuleDetail = require('modules/eform/eformTemplateModuleDetail');

module.exports = [
	{path: '/eformTemplate', component: EFormTemplate},
             {path: '/eformTemplateModule', component: EFormTemplateModule},
             {path: '/eformTemplateModule/detail/:templateModuleUID/:userUID', component: EFormTemplateModuleDetail},
	{path: '/eformTemplate/detail/:templateUID/:userUID', component: EFormTemplateDetail},
             {path: '/eform/detail', component: EFormDetail}
]