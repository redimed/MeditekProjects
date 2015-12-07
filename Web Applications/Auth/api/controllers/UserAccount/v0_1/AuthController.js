/**
 * @namespace AuthController
 * @description : Controller for authentication
 */
var passport = require('passport');
var jwt = require('jsonwebtoken');
var secret = 'ewfn09qu43f09qfj94qf*&H#(R';
var o=require("../../../services/HelperService");
var moment=require('moment');
module.exports = {

	_config: { // cấu hình blueprint
        actions: false, //khong sử dụng action route 
        shortcuts: false,// không sử dụng shortcuts route
        rest: false// không sử dụng rest route
    },
    /**
    * @typedef LoginResult
    * @type Object
    * @property {string} status 
    * @property {string} message 
    * @property {object} user 
    * @property {string} token 
    * @property {string} refreshToken
    */
    /**
     * @function login
     * @memberOf  AuthController
     * @description  xử lý login
     * @param {Object} req
     * @param {string} req.UserName Email hoặc PhoneNumber hoặc UserName của user
     * @param {string} req.Password password của user
     * @param {string} [req.UserUID] uid của user, nếu login bằng mobile
     * @param {string} [req.DeviceID] deviceid của mobile, nếu login bằng mobile
     * @param {string} [req.VerificationToken] nếu login bằng mobile
     * @return {LoginResult} Logged in info
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
                    RefreshCode:o.md5(rt.RefreshCode),
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
                        //---------------------------------------------
                        /*if(req.headers.systemtype==o.const.systemType.website)
                        {
                            var connectInfo=_.cloneDeep(userAccess);
                            connectInfo.sid=req.sessionID;
                            RedisService.pushUserConnect(connectInfo);
                        }*/
                        var connectInfo=_.cloneDeep(userAccess);
                        connectInfo.sid=req.sessionID;
                        RedisService.pushUserConnect(connectInfo);
                        //---------------------------------------------
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
     * @function logout xử lý logout
     * @memberOf AuthController
     * 
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
            //------------------------------------------
            /*if(req.headers.systemtype==o.const.systemType.website)
            {
                var connectInfo=_.cloneDeep(userAccess);
                connectInfo.sid=req.sessionID;
                RedisService.removeUserConnect(connectInfo);
            }  */  
            var connectInfo=_.cloneDeep(userAccess);
            connectInfo.sid=req.sessionID;
            RedisService.removeUserConnect(connectInfo);        
            //------------------------------------------
            res.ok({status:'success'});
        },function(err){
            res.serverError(ErrorWrap(err));
        })
        
    },
    
};

