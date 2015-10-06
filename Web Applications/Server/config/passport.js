var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
bcrypt = require('bcrypt');

passport.serializeUser(function(user, done) {
	done(null, user.UserName);
});

passport.deserializeUser(function(UserName, done) {
    UserAccount.findOne({ UserName: UserName } , function (err, user) {
        done(err, user);
    });
});


passport.use(new LocalStrategy({
		usernameField: 'UserName',
		passwordField: 'Password'
	},
	function(u, p, done) {
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
			console.log(u);
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
				return done(null, false, { message: 'Incorrect userName.' });
			}
			bcrypt.compare(p, user.Password, function (err, res) {
				if (!res)
					return done(null, false, 
							{
								message: 'Invalid Password'
							});
				
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


		// UserAccount.findOne({ UserName: u }, function (err, user) 
		// {
		// 	if (err) { return done(err); }
		// 	if (!user) {
		// 		return done(null, false, { message: 'Incorrect userName.' });
		// 	}

		// 	bcrypt.compare(p, user.Password, function (err, res) {
		// 		if (!res)
		// 		return done(null, false, {
		// 			message: 'Invalid Password'
		// 			});
		// 		var returnUser = {
		// 			UserName: user.UserName,
		// 			role:user.role
		// 		};
		// 		return done(null, returnUser, {
		// 			message: 'Logged In Successfully'
		// 			});
		// 	});
		// });
	}
));