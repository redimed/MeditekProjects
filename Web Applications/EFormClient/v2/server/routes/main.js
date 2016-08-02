var MainController = require('../controllers/MainController');

module.exports = function(router){
    router.get('/eFormTemplate/detail', MainController.getEFormTemplateDetail);
    router.get('/eForm/detail', MainController.getEFormDetail);
}