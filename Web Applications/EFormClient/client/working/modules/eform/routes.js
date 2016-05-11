var EFormTemplate = require('modules/eform/eformTemplate');
var EFormTemplateDetail = require('modules/eform/eformTemplateDetail');
var EFormDetail = require('modules/eform/eformDetail');
var EFormTemplateModule = require('modules/eform/eformTemplateModule');
var EFormTemplateModuleDetail = require('modules/eform/eformTemplateModuleDetail');
var EFormGroup = require('modules/eform/eformGroup');
var EFormConsultation = require('modules/eform/eformConsultation');
var EFrormListApptByPatient = require('modules/eform/eformPatient');

module.exports = [
            {path: '/eformTemplate', component: EFormTemplate},
            {path: '/eformTemplateModule', component: EFormTemplateModule},
            {path: '/eformTemplateModule/detail/:templateModuleUID/:userUID', component: EFormTemplateModuleDetail},
            {path: '/eformTemplate/detail/:templateUID/:userUID', component: EFormTemplateDetail},
            {path: '/eform/detail', component: EFormDetail},
            {path: '/eformGroup', component: EFormGroup},
            {path: '/eform/consultation', component: EFormConsultation},
            {path: '/eform/patient',component: EFrormListApptByPatient},
]
