module.exports = function(req, res, next) {
	var isPatient=false;
	_.each(req.user.roles,function(role){
		if(role.RoleCode=='PATIENT')
			isPatient=true;
	});
    if (isPatient) {
        return next();
    }
    else{
        return res.unauthor();
    }
};
