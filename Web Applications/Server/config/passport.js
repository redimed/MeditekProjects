var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
bcrypt = require('bcrypt-nodejs');

/**
 * passport.serializeUser:
 * only the user ID is serialized to the session, keeping the amount of data 
 * stored within the session small. When subsequent requests are received, 
 * this ID is used to find the user, which will be restored to req.user
 */
passport.serializeUser(function(user, done) {
	console.log(">>>>>>>>>>>>>>>>>>>>>> passport serializeUser");
	done(null, user.ID);
});

/**
 * Lấy lại thông tin user login cho mỗi request
 * Thông tin user sẽ được lưu tron req.user
 */
passport.deserializeUser(function(ID, done) {
	console.log(">>>>>>>>>>>>>>>>>>>>>> passport deserializeUser");

	UserAccount.findOne({
		where:{ID:ID},
		include:{
			model:RelUserRole,
			attributes:['ID','UserAccountId','RoleId'],
			include:{
				model:Role,
				attributes:['ID','UID','RoleCode','RoleName']
			}
		}
	})
	// UserAccount.findOne({
	// 	where:{ID:ID}
	// })
	.then(function(user){
		done(null,user);
	},function(err){
		done(err);
	})
});


passport.use(new LocalStrategy({
		usernameField: 'UserName',
		passwordField: 'Password'
	},
	function(u, p, done) {
		console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>Passport authentication");
		//Kiểm tra user đang login bằng email hay phoneNumber hay username
		var whereClause={};
		var emailPattern = new RegExp(HelperService.regexPattern.email);
		if(emailPattern.test(u))
		{
			console.log("Login with email");
			whereClause.Email=u;
		}
		else
		{
			var auPhoneNumberPattern=new RegExp(HelperService.regexPattern.auPhoneNumber);
			var phoneTest=u.replace(HelperService.regexPattern.phoneExceptChars,'');
			if(auPhoneNumberPattern.test(phoneTest))
			{
				console.log("Login with phone number");
				phoneTest=phoneTest.slice(-9);
				phoneTest='+61'+phoneTest;
				whereClause.PhoneNumber=phoneTest;
			}
			else
			{
				console.log("Login with username");
				whereClause.UserName=u;
			}
		}
		console.log(whereClause);
		UserAccount.findOne({
			where :whereClause,
			include:{
				model:RelUserRole,
				attributes:['ID','UserAccountId','RoleId'],
				include:{
					model:Role,
					attributes:['ID','UID','RoleCode','RoleName']
				}
			}
		})
		.then(function(user){
			if (!user) {
				var err=new Error("User.notFound");
				return done(null, false, err);
			}
			bcrypt.compare(p, user.Password, function (err, res) {
				if (!res)
				{
					var err=new Error("Password.Invalid");
					return done(null, false,err);
				}
					
				var listRoles=[];
				_.each(user.RelUserRoles,function(item){
					listRoles.push(item.Role);
				});


				var returnUser = {
					ID:user.ID,
					UID:user.UID,
					UserName: user.UserName,
					roles:listRoles
				};
				console.log("Login success");
				return done(null, returnUser, {
						message: 'Logged In Successfully'
					});
			});
		},function(err){
			return done(err);
		})
	}
));