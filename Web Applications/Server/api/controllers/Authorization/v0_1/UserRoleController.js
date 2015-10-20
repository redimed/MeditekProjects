module.exports={
	CreateUserRole:function(req,res){
		var userRoleInfo=req.body;
		console.log(userRoleInfo);
		sequelize.transaction().then(function(t){
			Services.UserRole.CreateUserRole(userRoleInfo,t)
			.then(function(data){
				t.commit();
				res.ok(data);
			})
			.catch(function(err){
				t.rollback();
				res.serverError(ErrorWrap(err));
			})
		});	
		
	},

	GetRolesOfUser:function(req,res){
		var criteria=req.query;
		Services.UserRole.GetRolesOfUser(criteria)
		.then(function(roles){
			res.ok(roles);
		},function(err){
			res.serverError(ErrorWrap(err));
		})
	}
}