/**
 * AuthController
 *
 * @description : Controller for authentication
 */

var passport = require('passport');
var jwt = require('jsonwebtoken');
var secret = 'ewfn09qu43f09qfj94qf*&H#(R';
var o=require("../../../services/HelperService");

module.exports = {

	_config: { // cấu hình blueprint
        actions: false, //khong sử dụng action route 
        shortcuts: false,// không sử dụng shortcuts route
        rest: false// không sử dụng rest route
    },

    /**
     * login: function xử lý login
     */
    login: function(req, res) {
        console.log("============LOGIN===============");

        var error=new ErrorWrap("login.Error");

        passport.authenticate('local', function(err, user, info) 
        {
            if ((err) || (!user)) 
            {
                if(!err) 
                {
                    var err=info;
                }
                return res.unauthor(ErrorWrap(err));
            }            
            //TẠO TOKEN
            //Tạo secret key
            var userAccess={
                UserUID:user.UID,
                SystemType:req.headers.systemtype,
                DeviceID:req.headers.deviceid
            }
            Services.UserToken.MakeUserToken(userAccess)
            .then(function(ut){
                var sessionUser={
                    ID:user.ID,
                    UID:user.UID,
                    Activated:user.Activated,
                    roles:user.roles,
                    SystemType:req.headers.systemtype,
                    DeviceID:req.headers.deviceid,
                    SecretKey:ut.SecretKey,
                    SecretCreatedDate:ut.SecretCreatedDate,
                    TokenExpired:ut.TokenExpired,
                    MaxExpiredDate:ut.MaxExpiredDate,
                }
                var token=jwt.sign(
                    {UID:user.UID},
                    ut.SecretKey,
                    {expiresIn:o.const.authTokenExpired[req.headers.systemtype]}
                );
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>REQ.LOGIN");
                req.logIn(sessionUser, function(err) 
                {
                    if (err) 
                    {
                        res.unauthor(ErrorWrap(err));
                    }
                    else
                    {
                        if(user.Activated=='Y')
                        {
                            res.ok({
                                status:'success',
                                message: info.message,
                                user: user,
                                token:token
                            });
                        }
                        else
                        {
                            res.notActivated({
                                status:'success',
                                message: info.message,
                                user: user,
                                token:token
                            });
                        }
                    }
                    
                });
                
            },function(err){
                res.serverError(ErrorWrap(err));
            })
        })(req, res);
    },

    /**
     * logout: xử lý logout
     */
    logout: function(req, res) {
        var userAccess={
            UserUID:req.user.UID,
            SystemType:req.headers.systemtype,
            DeviceID:req.headers.deviceid
        }
        Services.UserToken.MakeUserToken(userAccess)
        .then(function(data){
            req.logout();
            res.ok({status:'success'});
        },function(err){
            res.serverError(ErrorWrap(err));
        })
        
    },
    
};

