module.exports = function(req, res, next) {
	var isAdmin=false;
	_.each(req.user.roles,function(role){
		if(role.RoleCode=='ADMIN')
			isAdmin=true;
	});
    if (isAdmin) {
        return next();
    }
    else{
        return res.unauthor();
    }
};
