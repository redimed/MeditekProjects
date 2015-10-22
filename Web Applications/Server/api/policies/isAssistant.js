var o=require("../services/HelperService");
var ErrorWrap=require("../services/ErrorWrap");
module.exports = function(req, res, next) {
	var isAssistant=false;
	_.each(req.user.roles,function(role){
		if(role.RoleCode==o.const.roles.assistant)
			isAssistant=true;
	});
    if (isAssistant) {
        return next();
    }
    else{
        var error=new Error("Policies.Error");
        error.pushError("Policies.notAssistant");
        return res.unauthor(ErrorWrap(error));
    }
};
