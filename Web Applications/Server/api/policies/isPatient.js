var o=require("../services/HelperService");
var ErrorWrap=require("../services/ErrorWrap");
module.exports = function(req, res, next) {
	var isPatient=false;
	_.each(req.user.roles,function(role){
		if(role.RoleCode==o.const.roles.patient)
			isPatient=true;
	});
    if (isPatient) 
    {
        return next();
    }
    else
    {
        var error=new Error("Policies.Error");
        error.pushError("Policies.notPatient");
        return res.unauthor(ErrorWrap(error));
    }
};
