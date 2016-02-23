var EForm = require('../controllers/eform.js');

module.exports = function(router){
            router.get('/eformtemplate/list', EForm.GetListTemplate);
            router.post('/eformtemplate/create', EForm.PostCreateTemplate);
            router.post('/eformtemplate/update', EForm.PostUpdateTemplate);
            router.post('/eformtemplate/detail', EForm.PostDetailTemplate);
            router.post('/eformtemplate/remove', EForm.PostRemoveTemplate);
            router.post('/eformtemplate/save', EForm.PostSaveTemplate);
            router.get('/eform/list', EForm.GetList);
            router.post('/eform/save', EForm.PostSave);
            router.post('/eform/remove', EForm.PostRemove);
            router.post('/eform/detail', EForm.PostDetail);
            router.post('/eform/update', EForm.PostUpdate);
}