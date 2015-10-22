var o=require("../services/HelperService");
var ErrorWrap=require("../services/ErrorWrap");
module.exports = function(req, res, next) {
	var isExternalPractitioner=false;
	_.each(req.user.roles,function(role){
		if(role.RoleCode==o.const.roles.internalPractitioner)
			isExternalPractitioner=true;
	});
    if (isExternalPractitioner) {
        return next();
    }
    else
    {
        var error=new Error("Policies.Error");
        error.pushError("Policies.notExternalPractitioner");
        return res.unauthor(ErrorWrap(error));
    }
};
