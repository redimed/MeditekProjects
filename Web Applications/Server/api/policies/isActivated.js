var ErrorWrap=require("../services/ErrorWrap");

module.exports=function(req,res,next){
	if(req.user)
	{
		
	}
	else
	{
		req.unauthor();
	}
}