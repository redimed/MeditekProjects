module.exports = function(req, res, next) {
	var isGp=false;
	_.each(req.user.roles,function(role){
		if(role.RoleCode=='GP')
			isGp=true;
	});
    if (isGp) {
        return next();
    }
    else{
        return res.unauthor();
    }
};
