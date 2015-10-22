var ErrorWrap=require("../services/ErrorWrap");
module.exports=function(req,res,next){
	if(req.user)
	{
		if(req.user.Activated=='Y')
		{
			next();
		}
		else
		{
			var error=new Error("Policies.Error");
			error.pushError("Policies.notActivated");
			res.unauthor(ErrorWrap(error));
		}
	}
	else
	{
		res.unauthor();
	}
}