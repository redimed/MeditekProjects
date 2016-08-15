module.exports = {
    getEFormTemplateDetail: function(req, res){
        res.render('main/eFormTemplateDetail');
    },
    getEFormDetail: function(req, res){
        res.render('main/eFormDetail');
    },
    getEFormTemplateList: function(req, res) {
    	res.render('main/eFormTemplateList');
    }
}