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
    'post /eform/update': {
        controller: 'EForm/EFormController',
        action: 'PostUpdate'
    }
};
