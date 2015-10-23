var o=require("../services/HelperService");
var ErrorWrap=require("../services/ErrorWrap");
module.exports = function(req, res, next) {
    var error=new Error("Policies.Error");
    if(o.checkData(req.user))
    {
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
            error.pushError("Policies.notInternalPractitioner");
            return res.unauthor(ErrorWrap(error));
        }
    }
    else
    {
        error.pushError("Policies.notLogin");
        return res.unauthor(ErrorWrap(error));
    }
	
};
