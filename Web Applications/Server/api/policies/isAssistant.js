module.exports = function(req, res, next) {
	var isAssistant=false;
	_.each(req.user.roles,function(role){
		if(role.RoleCode=='ASSISTANT')
			isAssistant=true;
	});
    if (isAssistant) {
        return next();
    }
    else{
        return res.unauthor();
    }
};
