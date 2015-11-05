var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    bcrypt = require('bcryptjs');
passport.serializeUser(function(data, done) {
    done(null, data.user.ID);
});
passport.deserializeUser(function(ID, done) {
    UserAccount.findOne({
        where: {
            ID: ID
        }
    }).then(function(user) {
        done(null, user.dataValues);
    }, function(err) {
        done(err);
    })
});
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, u, p, done) {
    var deviceId = req.headers.deviceid;
    var deviceType = req.headers.systemtype;
    var activationInfo = null;
    if (req.body.activationInfo) activationInfo = req.body.activationInfo;
    var requestBody = {
        'UserName': u,
        'Password': p,
        'UserUID': !activationInfo ? null : activationInfo.userUID,
        'DeviceID': !activationInfo ? null : deviceId,
        'VerificationToken': !activationInfo ? null : activationInfo.verifyCode
    }
    TelehealthService.MakeRequest({
        path: '/api/login',
        method: 'POST',
        body: requestBody,
        headers: {
            'DeviceID': deviceId,
            'SystemType': HelperService.const.systemType[deviceType.toLowerCase()]
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
                if (activationInfo) user.patientUID = activationInfo.patientUID;
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