module.exports = function(req, res, next) {
	var isDoctor=false;
	_.each(req.user.roles,function(role){
		if(role.RoleCode=='DOCTOR')
			isDoctor=true;
	});
    if (isDoctor) {
        return next();
    }
    else{
        return res.unauthor();
    }
};
