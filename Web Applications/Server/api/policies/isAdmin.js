var o=require("../services/HelperService");
var ErrorWrap=require("../services/ErrorWrap");
module.exports = function(req, res, next) {
	var isAdmin=false;
	_.each(req.user.roles,function(role){
		if(role.RoleCode==o.const.roles.admin)
			isAdmin=true;
	});
    if (isAdmin) {
        return next();
    }
    else
    {
        var error=new Error("Policies.Error");
        error.pushError("Policies.notAdmin");
        return res.unauthor(ErrorWrap(error));
    }
};
