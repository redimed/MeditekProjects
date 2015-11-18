/**
 * AuthController
 *
 * @description : Controller for authentication
 */

var passport = require('passport');
var jwt = require('jsonwebtoken');
var secret = 'ewfn09qu43f09qfj94qf*&H#(R';
var o=require("../../../services/HelperService");
var md5 = require('md5');
var moment=require('moment');
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

            var userAccess={
                UserUID:user.UID,
                SystemType:req.headers.systemtype,
                DeviceID:req.headers.deviceid,
                AppID:req.headers.appid,
            }
            Services.RefreshToken.MakeRefreshToken(userAccess)
            .then(function(rt){
                var secretExpiredPlusAt=null;
                if(o.checkListData(rt.SecretExpired,rt.SecretExpiredPlus))
                {
                    secretExpiredPlusAt=moment(rt.SecretCreatedAt)
                                        .add(rt.SecretExpired+rt.SecretExpiredPlus,'seconds')
                                        .toDate();
                }
                var sessionUser={
                    ID:user.ID,
                    UID:user.UID,
                    Activated:user.Activated,
                    roles:user.roles,
                    //--------------------------------
                    SystemType:req.headers.systemtype,//Dùng để validation request
                    DeviceID:req.headers.deviceid,//Dùng để validation request
                    AppID:req.headers.appid,//Dùng để validation request
                    //--------------------------------
                    SecretKey:rt.SecretKey,
                    SecretCreatedAt:rt.SecretCreatedAt,
                    SecretExpired:rt.SecretExpired,
                    SecretExpiredPlus:rt.SecretExpiredPlus,
                    SecretExpiredPlusAt:secretExpiredPlusAt
                }
                var payload={
                    UID:user.UID,
                    RefreshCode:md5(rt.RefreshCode),
                };
                var token=jwt.sign(
                    payload,
                    rt.SecretKey,
                    {expiresIn:o.const.authTokenExpired[req.headers.systemtype]}
                );
                console.log("=====================REQ.LOGIN========================");
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
                                token:token,
                                refreshCode:rt.RefreshCode,
                            });
                        }
                        else
                        {
                            res.notActivated({
                                status:'success',
                                message: info.message,
                                user: user,
                                token:token,
                                refreshCode:rt.RefreshCode,
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
            DeviceID:req.headers.deviceid,
            AppID:req.headers.appid,
        }
        Services.RefreshToken.MakeRefreshToken(userAccess)
        .then(function(data){
            req.logout();
            res.ok({status:'success'});
        },function(err){
            res.serverError(ErrorWrap(err));
        })
        
    },
    
};

