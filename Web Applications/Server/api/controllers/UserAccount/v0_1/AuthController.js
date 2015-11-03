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

            req.logIn(user, function(err) 
            {
                if (err) 
                {
                    res.unauthor(ErrorWrap(err));
                }
                else
                {
                    //TẠO TOKEN
                    //Tạo secret key
                    var userToken={
                        UserUID:user.UID,
                        SystemType:req.headers.systemtype,
                        DeviceID:req.headers.deviceid
                    }
                    Services.UserToken.MakeUserToken(userToken)
                    .then(function(data){
                        // var token = jwt.sign(user, secret, { expiresInMinutes: 60*24 });
                        var token = jwt.sign(user, data.SecretKey, { expiresIn: o.const.authTokenExpired[req.headers.systemtype] });//second
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
                    },function(err){
                        res.serverError(ErrorWrap(err));
                    })
                    
                    
                }
                
            });

        })(req, res);
    },

    /**
     * logout: xử lý logout
     */
    logout: function(req, res) {
        var userToken={
            UserUID:req.user.UID,
            SystemType:req.headers.systemtype,
            DeviceID:req.headers.deviceid
        }
        Services.UserToken.MakeUserToken(userToken)
        .then(function(data){
            req.logout();
            res.ok({status:'success'});
        },function(err){
            res.serverError(ErrorWrap(err));
        })
        
    },
    
    refreshToken:function(req,res)
    {
        res.ok({status:'success'});
    },

    
};

