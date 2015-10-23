var o=require("../services/HelperService");
var ErrorWrap=require("../services/ErrorWrap");
module.exports = function(req, res, next) {
    var error=new Error("Policies.Error");
    if(o.checkData(req.user))
    {
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
            
            error.pushError("Policies.notPatient");
            return res.unauthor(ErrorWrap(error));
        }
    }
    else
    {
        error.pushError("Policies.notLogin");
        return res.unauthor(ErrorWrap(error));
    }
};
