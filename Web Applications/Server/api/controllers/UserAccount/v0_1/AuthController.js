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
            Services.RefreshToken.MakeRefreshToken(userAccess)
            .then(function(rt){

                var sessionUser={
                    ID:user.ID,
                    UID:user.UID,
                    Activated:user.Activated,
                    roles:user.roles,
                    //--------------------------------
                    SystemType:req.headers.systemtype,
                    DeviceID:req.headers.deviceid,
                    //--------------------------------
                    SecretKey:rt.SecretKey,
                    SecretCreatedAt:rt.SecretCreatedAt,
                    SecretExpired:rt.SecretExpired
                }

                var payload={
                    UID:user.UID,
                    RefreshCode:md5(rt.RefreshCode),
                };
                var token=jwt.sign(
                    payload,
                    rt.SecretKey,
                    {expiresIn:15}
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
            DeviceID:req.headers.deviceid
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

