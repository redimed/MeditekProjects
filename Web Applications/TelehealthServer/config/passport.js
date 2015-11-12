var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    bcrypt = require('bcryptjs');
passport.serializeUser(function(sessionUser, done) {
    console.log(">>>>>>>>>>>> serializeUser");
    done(null, sessionUser);
});
passport.deserializeUser(function(sessionUser, done) {
    done(null, sessionUser);
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
                user.TeleUID = teleUser.UID;
                if (activationInfo) user.PatientUID = activationInfo.patientUID;
                user.SystemType = HelperService.const.systemType[deviceType.toLowerCase()];
                user.DeviceID = deviceId;
                data.user = user;
                UserToken.find({
                    where: {
                        UserAccountID: user.ID,
                        SystemType: HelperService.const.systemType[deviceType.toLowerCase()],
                        DeviceID: deviceId,
                        Enable: 'Y'
                    }
                }).then(function(userToken) {
                    if (userToken) {
                        var sessionUser={
                            ID:user.ID,
                            UID:user.UID,
                            Activated:user.Activated,
                            roles:user.roles,
                            SystemType: HelperService.const.systemType[deviceType.toLowerCase()],
                            DeviceID: deviceId,
                            SecretKey:userToken.SecretKey,
                            SecretCreatedDate:new Date(userToken.SecretCreatedDate),
                            TokenExpired:userToken.TokenExpired,
                            MaxExpiredDate: userToken.MaxExpiredDate
                        }
                        data.sessionUser = sessionUser;
                        return done(null, data, response.getBody().message);
                    } else return done(null, false, {
                        message: 'Error'
                    })
                }).catch(function(err) {
                    return done(err);
                })
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