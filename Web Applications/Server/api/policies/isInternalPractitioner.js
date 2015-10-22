var o=require("../services/HelperService");
var ErrorWrap=require("../services/ErrorWrap");
module.exports = function(req, res, next) {
	var isInternalPractitioner=false;
	_.each(req.user.roles,function(role){
		if(role.RoleCode==o.const.roles.internalPractitioner)
			isInternalPractitioner=true;
	});
    if (isInternalPractitioner) 
    {
        return next();
    }
    else
    {
        var error=new Error("Policies.Error");
        error.pushError("Policies.InternalPractitioner");
        return res.unauthor(ErrorWrap(error));
    }
};
