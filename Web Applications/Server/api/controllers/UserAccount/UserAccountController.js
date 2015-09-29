module.exports = {
	Test:function(req,res)
	{
		UserAccount.findOne({
			where :{UserName: u}
		})
		.then(function(user){
			res.json(200,user);
		},function(err){
			res.json(500,err);
		})
	},
	
	createUser:function(req,res){
		var userInfo={
			UserName:req.body.UserName,
			Email:req.body.Email,
			PhoneNumber:req.body.PhoneNumber,
			Password:req.body.Password,
			Activated:'Y',
			Enable:'Y'
		}
		userInfo.UID=UUIDService.Create();
		try {
			if(userInfo.UserName || userInfo.Email || userInfo.PhoneNumber)
			{
				UserAccount.create(userInfo)
				.then(function(data){
					res.ok(data);
				},function(err){
					throw err;
				})
				.catch(function(err){
					console.log(err);
					res.serverError({message:err.message});
				});
			}
			else
			{
				throw new Error('Must enter User Name or Email or Phone Number');
			}
		}
		catch(err) {			
		    res.serverError({message:err.message});
		}
	},

	FindByPhoneNumber:function(req,res)
	{
		var PhoneNumber=req.query.PhoneNumber;
		UserAccount.findAll({
			where :{
				PhoneNumber:PhoneNumber
			}
		})
		.then(function(rows){
			if(rows.length>0)
				res.ok(rows[0]);
			else
				res.notFound();
		},function(err){
			res.serverError({message:err.message});
		})

	}
}