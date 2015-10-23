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
    TelehealthService.MakeRequest({
        path: '/api/login',
        method: 'POST',
        body: {
            'UserName': u,
            'Password': p
        }
    }).then(function(response) {
        var data = response.getBody();
        var user = data.user;
        TelehealthUser.find({
            where: {
                userAccountID: user.ID
            },
            attributes: ['UID']
        }).then(function(teleUser) {
            if (teleUser) {
                user.UserUID = user.UID;
                user.UID = teleUser.UID;
                data.user = user;
                return done(null, data, response.getBody().message);
            } else return done(null, false, {
                message: 'Wrong Username Or Password!'
            })
        }).catch(function(err) {
            return done(err);
        })
    }).catch(function(err) {
        return done(null, false, err.getBody());
    })
}));