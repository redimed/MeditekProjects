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
    // done(null, user.ID);//set req.session.passport.user=user.ID
    done(null, user); //set req.session.passport.user=user
});
/**
 * Lấy lại thông tin user login cho mỗi request
 * Thông tin user sẽ được lưu tron req.user
 */
// passport.deserializeUser(function(ID, done) {
passport.deserializeUser(function(sessionUser, done) {
    console.log(">>>>>>>>>>>>>>>>>>>>>> passport deserializeUser");
    //từ sessionUser(req.session.passport.user) ==> tạo ra req.user
    //do đó về cơ bản sessionUser và req.user là 2 object khác nhau
    //Tuy nhiên dưới đây đã quy định sessionUser và req.user là cùng 1 object
    if(o.checkData(sessionUser))
    {
        done(null,sessionUser);//set req.user=sessionUser
    }
    else
    {
        var error=new Error("authentication.deserializeUser.sessionUserNotFound");
        done(error);
    }
});

passport.use(new LocalStrategy({
    usernameField: 'UserName',
    passwordField: 'Password',
    passReqToCallback: true
}, function(req, u, p, done) { //req: ..., UserUID, DeviceID, VerificationToken
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>Passport authentication");
    //Kiểm tra user đang login bằng phương thức nào
    //Password hay activation token hay PinNumber
    var whereClause = {};
    var loginInfo = req.body;
    if (o.checkData(loginInfo.UserUID)) {
        //Trường hợp login bằng activation token hoặc PinNumber
        whereClause.UID = loginInfo.UserUID;
        if(!loginInfo.PinNumber)
        {
            //Trường hợp login bằng activation token
            if (!o.checkData(loginInfo.DeviceID)) {
                var err = new Error("DeviceID.notProvided");
                return done(null, false, err);
            }
            if (!o.checkData(loginInfo.AppID)) {
                var err = new Error("AppID.notProvided");
                return done(null, false, err);
            }
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
        include: [
            {
                model: RelUserRole,
                attributes: ['ID', 'UserAccountId', 'RoleId', 'SiteId'],
                include: {
                    model: Role,
                    attributes: ['ID', 'UID', 'RoleCode', 'RoleName']
                }
            },
            {
                model:TelehealthUser,
                attributes:['ID','UID'],
            }
        ]
    }).then(function(user) {
    	console.log(user);
        if (!user) {
            var err = new Error("User.notFound");
            return done(null, false, err);
        }
        if (user && user.Enable != 'Y') {
            var err = new Error("User.disabled");
            return done(null, false, err);
        }
        
        //Chuẩn bị thông tin trả về
        var listRoles = [];
        _.each(user.RelUserRoles, function(item) {
            if(HelperService.CheckExistData(item) &&
                HelperService.CheckExistData(item.dataValues) &&
                HelperService.CheckExistData(item.Role) &&
                HelperService.CheckExistData(item.Role.dataValues)){
                item.Role.dataValues.SiteId = item.dataValues.SiteId;
            }
            listRoles.push(item.Role);
        });
        var returnUser = {
            ID: user.ID,
            UID: user.UID,
            UserName: user.UserName,
            Activated: user.Activated,
            roles: listRoles,
            TelehealthUser:user.TelehealthUser,
        };
        //----------------------------
        //Kiểm tra user login bằng phương pháp thường (password)
        //hay login bằng activation token (mobile)
        //hay login bằng PinNumber
        if (loginInfo.UserUID) {
            //Nếu login bằng UserUID thì có thể là login bằng activation token
            //hoặc bằng PinNumber
            if(loginInfo.PinNumber)
            {
                //Login bằng pin number
                //Kiểm tra Pin có expired hay chưa
                if(user.ExpiryPin>0)
                {
                    //Pin chưa expired
                    if(user.PinNumber==loginInfo.PinNumber)
                    {
                        //Pin hợp lệ
                        console.log("Login via PinNumber success");
                        return done(null, returnUser, {
                            message: 'Logged In via PinNumber Successfully'
                        });
                    }
                    else
                    {
                        //Pin không hợp lệ
                        //Cập nhật lại Pin Expiry
                        var currentExpiryPin=user.ExpiryPin;
                        user.updateAttributes({ExpiryPin:currentExpiryPin-1})
                        .then(function(userUpdated){
                            var err = new Error("PinNumber.Invalid");
                            return done(null, false, err);
                        },function(err){
                            return done(err);
                        })                        
                    }
                }
                else
                {
                    if(isNaN(user.ExpiryPin))
                        var err = new Error("ExpiryPin.unknown");
                    else
                        var err = new Error("PinNumber.Expired");
                    return done(null, false, err);
                }
            }
            else
            {
                //Nếu login bằng token activation
                UserActivation.findOne({
                    where: {
                        UserAccountID: user.ID,
                        DeviceID: loginInfo.DeviceID,
                        AppID:loginInfo.AppID,
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
            }
            
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

