var o=require("../services/HelperService");
var ErrorWrap=require("../services/ErrorWrap");
module.exports = function(req, res, next) {
	var isClinicTelehealth=false;
	_.each(req.user.roles,function(role){
		if(role.RoleCode==o.const.roles.clinicTelehealth)
			isClinicTelehealth=true;
	});
    if (isClinicTelehealth) {
        return next();
    }
    else
    {
        var error=new Error("Policies.Error");
        error.pushError("Policies.notClinicTelehealth");
        return res.unauthor(ErrorWrap(error));
    }
};
