var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    bcrypt = require('bcryptjs');
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, u, p, done) {
    UserAccount.find({
        where: {
            [u.indexOf('@') > -1 ? 'email' : 'userName']: u
        }
    }).then(function(user) {
        if (user) {
            bcrypt.compare(p.toString(), user.password, function(err, check) {
                if (check) {
                    return done(null, user, {
                        message: 'Logged In Successfully!'
                    });
                } else return done(null, false, {
                    message: 'Wrong Username Or Password!'
                });
            });
        } else return done(null, false, {
            message: 'User Is Not Exist!'
        });
    }).catch(function(err) {
        return done(err);
    })
}));