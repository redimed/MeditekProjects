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
		UserAccount.findOne({
			where :{UserName: u}
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
				var returnUser = {
					UserName: user.UserName,
					role:user.role
				};
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