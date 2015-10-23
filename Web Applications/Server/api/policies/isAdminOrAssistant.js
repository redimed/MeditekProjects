var o=require("../services/HelperService");
var ErrorWrap=require("../services/ErrorWrap");
module.exports = function(req, res, next) {
    var error=new Error("Policies.Error");
    if(req.user)
    {
        var roleAccepted=[o.const.roles.admin,o.const.roles.assistant];
        var flag=false;
        _.each(req.user.roles,function(role){
            if(_.intersection([role.RoleCode],roleAccepted).length>0)
                flag=true;
        });
        if (flag) {
            return next();
        }
        else
        {
            
            error.pushError("Policies.notAdminOrAssistant");
            return res.unauthor(ErrorWrap(error));
        }
    }
    else
    {
        error.pushError("Policies.notLogin");
        return res.unauthor(ErrorWrap(error));
    }
    
};
