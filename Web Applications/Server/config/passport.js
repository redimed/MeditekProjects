var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    bcrypt = require('bcrypt-nodejs');
var o = require("../api/services/HelperService");
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
        where: {
            ID: ID
        },
        include: {
            model: RelUserRole,
            attributes: ['ID', 'UserAccountId', 'RoleId'],
            include: {
                model: Role,
                attributes: ['ID', 'UID', 'RoleCode', 'RoleName']
            }
        }
    }).then(function(user) {

        var listRoles = [];
        _.each(user.RelUserRoles, function(item) {
            listRoles.push(item.Role);
        });
        var returnUser = {
            ID: user.ID,
            UID: user.UID,
            UserName: user.UserName,
            Activated: user.Activated,
            roles: listRoles
        };

        done(null, returnUser);
    }, function(err) {
        done(err);
    })
});
passport.use(new LocalStrategy({
    usernameField: 'UserName',
    passwordField: 'Password',
    passReqToCallback: true
}, function(req, u, p, done) { //req: ..., UserUID, DeviceID, VerificationToken
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>Passport authentication");
    //Kiểm tra user đang login bằng email hay phoneNumber hay username
    var whereClause = {};
    var loginInfo = req.body;
    if (o.checkData(loginInfo.UserUID)) {
        //Trường hợp login bằng mobile (UserUID, DeviceID, VerificationToken)
        whereClause.UID = loginInfo.UserUID;
        if (!o.checkData(loginInfo.DeviceID)) {
            var err = new Error("DeviceID.notProvided");
            return done(null, false, err);
        }
    } else {
        //Trường hợp login bằng phương pháp userName, password thông thường
        if (o.isValidEmail(u)) {
            console.log("Login with email");
            whereClause.Email = u;
        } else {
            var phoneTest = u;
            phoneTest = o.parseAuMobilePhone(phoneTest);
            if (o.checkData(phoneTest)) {
                console.log("Login with phone number");
                phoneTest = phoneTest.slice(-9);
                phoneTest = '+61' + phoneTest;
                whereClause.PhoneNumber = phoneTest;
            } else {
                console.log("Login with username");
                whereClause.UserName = u;
            }
        }
    }
    console.log(whereClause);
    UserAccount.findOne({
        where: whereClause,
        include: {
            model: RelUserRole,
            attributes: ['ID', 'UserAccountId', 'RoleId'],
            include: {
                model: Role,
                attributes: ['ID', 'UID', 'RoleCode', 'RoleName']
            }
        }
    }).then(function(user) {
        if (!user) {
            var err = new Error("User.notFound");
            return done(null, false, err);
        }
        if (user && user.Enable != 'Y') {
            var err = new Error("User.disabled");
            return done(null, false, err);
        }
        //Code của Luân
        /*if (user && user.Activated != 'Y') {
            // Activation
            Services.UserActivation.CreateUserActivation({
                UserUID: user.UID,
                Type: HelperService.const.systemType.website,
                ModifiedBy: user.ID
            }).then(function(result_actv) {
                SendSMSService.Send({
                    phone: user.PhoneNumber,
                    content: 'Your REDiMED account activation code is ' + result_actv.VerificationCode
                }, function(err) {
                    if (err) throw err;
                    var returnUser = {
                        ID: user.ID,
                        UID: user.UID,
                        UserName: user.UserName,
                        Activated: user.Activated,
                        roles: listRoles
                    };
                    return done(null, returnUser, {
                        message: 'User Not Activated!'
                    });
                })
            }).catch(function(err) {
                res.serverError(ErrorWrap(err));
            });
        }*/
        //Chuẩn bị thông tin trả về
        var listRoles = [];
        _.each(user.RelUserRoles, function(item) {
            listRoles.push(item.Role);
        });
        var returnUser = {
            ID: user.ID,
            UID: user.UID,
            UserName: user.UserName,
            Activated: user.Activated,
            roles: listRoles
        };
        //----------------------------
        //Kiểm tra user login bằng mobile hay web
        if (loginInfo.UserUID) {
            //Nếu bằng mobile thì kiểm tra token activation
            UserActivation.findOne({
                where: {
                    UserAccountID: user.ID,
                    DeviceID: loginInfo.DeviceID
                }
            }).then(function(activation) {
                if (activation) {
                    if (activation.CodeExpired > 0) {
                        if (loginInfo.VerificationToken == activation.VerificationToken) {
                            console.log("Login via mobile success");
                            return done(null, returnUser, {
                                message: 'Logged In via Mobile Successfully'
                            });
                        } else {
                            var err = new Error("VerificationToken.invalid");
                            return done(null, false, err);
                        }
                    } else {
                        var err = new Error("Activation.expired");
                        return done(null, false, err);
                    }
                } else {
                    var err = new Error("Activation.notFound");
                    return done(null, false, err);
                }
            }, function(err) {
                return done(err);
            })
        } else {
            bcrypt.compare(p, user.Password, function(err, res) {
                if (!res) {
                    var err = new Error("Password.Invalid");
                    return done(null, false, err);
                }
                console.log("Login via web success");
                return done(null, returnUser, {
                    message: 'Logged In via Web Successfully'
                });
            });
        }
    }, function(err) {
        o.exlog(err);
        var error = new Error("UserAccount.queryError");
        return done(error);
    })
}));

