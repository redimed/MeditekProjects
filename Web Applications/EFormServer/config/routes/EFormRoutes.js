module.exports = {
    'get /eformtemplate/list': {
        controller: 'EForm/EFormController',
        action: 'GetListEFormTemplate'
    },
    'post /eformtemplate/create': {
        controller: 'EForm/EFormController',
        action: 'PostCreateEFormTemplate'
    },
    'post /eformtemplate/update': {
        controller: 'EForm/EFormController',
        action: 'PostUpdateEFormTemplate'
    },
    'post /eformtemplate/updatePrintType': {
        controller: 'EForm/EFormController',
        action: 'PostUpdatePrintTypeEFormTemplate'
    },
    'post /eformtemplate/detail': {
        controller: 'EForm/EFormController',
        action: 'PostDetailEFormTemplate'
    },
    'post /eformtemplate/remove': {
        controller: 'EForm/EFormController',
        action: 'PostRemoveEFormTemplate'
    },
    'post /eformtemplate/save': {
        controller: 'EForm/EFormController',
        action: 'PostSaveEFormTemplate'
    },
    'get /eformtemplate/getUserRoles': {
        controller: 'EForm/EFormController',
        action: 'GetEFormUserRoles'
    },
    'post /eform/list': {
        controller: 'EForm/EFormController',
        action: 'PostList'
    },
    'post /eform/save': {
        controller: 'EForm/EFormController',
        action: 'PostSave'
    },
    'post /eform/remove': {
        controller: 'EForm/EFormController',
        action: 'PostRemove'
    },
    'post /eform/detail': {
        controller: 'EForm/EFormController',
        action: 'PostDetail'
    },
    'post /eform/checkDetail': {
        controller: 'EForm/EFormController',
        action: 'PostCheckDetail'
    },
    'post /eform/update': {
        controller: 'EForm/EFormController',
        action: 'PostUpdate'
    },
    'post /eform/historyDetail': {
        controller: 'EForm/EFormController',
        action: 'PostHistoryDetail'
    },
    'post /eformtemplatemodule/create': {
        controller: 'EForm/EFormController',
        action: 'PostCreateEFormTemplateModule'
    },
    'post /eformtemplatemodule/update': {
        controller: 'EForm/EFormController',
        action: 'PostUpdateEFormTemplateModule'
    },
    'get /eformtemplatemodule/list': {
        controller: 'EForm/EFormController',
        action: 'GetListEFormTemplateModule'
    },
    'post /eformtemplatemodule/remove': {
        controller: 'EForm/EFormController',
        action: 'PostRemoveEFormTemplateModule'
    },
    'post /eformtemplatemodule/detail': {
        controller: 'EForm/EFormController',
        action: 'PostDetailEFormTemplateModule'
    },
    'post /eformtemplatemodule/save': {
        controller: 'EForm/EFormController',
        action: 'PostSaveEFormTemplateModule'
    },
    'post /eformgroup/create': {
        controller: 'EForm/EFormController',
        action: 'PostCreateEFormGroup'
    },
    'post /eformgroup/update': {
        controller: 'EForm/EFormController',
        action: 'PostUpdateEFormGroup'
    },
    'post /eformgroup/remove': {
        controller: 'EForm/EFormController',
        action: 'PostRemoveEFormGroup'
    },
    'get /eformgroup/list': {
        controller: 'EForm/EFormController',
        action: 'GetListEFormGroup'
    }
};