module.exports={
	CreateUserRoleWithExistUser:function(req,res){
		var CreatedBy=req.user?req.user.ID:null;
		var userRoleInfo={
			UserUID:req.body.UserUID,
			RoleCode:req.body.RoleCode,
			SiteId:req.body.SiteId,
			CreatedBy:CreatedBy
		};
		
		sequelize.transaction().then(function(t){
			return Services.UserRole.CreateUserRoleWithExistUser(userRoleInfo,t)
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


	CreateUserRoleWhenCreateUser:function(req,res){
		var CreatedBy=req.user?req.user.ID:null;
		var userRoleInfo={
			RoleCode:req.body.RoleCode,
			SiteId:req.body.SiteId,
			CreatedBy: CreatedBy,
		};
		var userInfo={
			Email:req.body.Email,
			Password:req.body.Password,
			CreatedBy:CreatedBy,
		}
		sequelize.transaction().then(function(t){
			return Services.UserAccount.CreateUserAccount(userInfo,t)
			.then(function(newUser){
				return Services.UserRole.CreateUserRoleWhenCreateUser(newUser,userRoleInfo,t)
				.then(function(data){
					t.commit();
					res.ok(data);
				},function(err){
					t.rollback();
					res.serverError(ErrorWrap(err));
				})
			},function(err){
				res.serverError(ErrorWrap(err));
			})
			
		},function(err){
			var error=new Error("CreateUserRoleWhenCreateUser.Error");
			error.pushError("CreateUserRoleWhenCreateUser.transactionOpenError");
			res.serverError(ErrorWrap(error));
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