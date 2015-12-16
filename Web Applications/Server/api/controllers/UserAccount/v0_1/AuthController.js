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
                        if(req.headers.systemtype==o.const.systemType.website)
                        {
                            var connectInfo=_.cloneDeep(userAccess);
                            connectInfo.sid=req.sessionID;
                            RedisService.pushUserConnect(connectInfo);
                        }
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
            if(req.headers.systemtype==o.const.systemType.website)
            {
                var connectInfo=_.cloneDeep(userAccess);
                connectInfo.sid=req.sessionID;
                RedisService.removeUserConnect(connectInfo);
            }            
            //------------------------------------------
            res.ok({status:'success'});
        },function(err){
            res.serverError(ErrorWrap(err));
        })
        
    },

    forgot: function(req, res) {
        var data = req.body.data;
        return UserAccount.findOne({
            where : {
                Email : data.email
            }
        })
        .then(function(result){
            if(result!=null && result!=""){
                data.UID = result.UID;
                Services.UserAccount.sendMail(data,secret,function(err, responseStatus, html, text){
                    if(err)
                        res.serverError(ErrorWrap(err));
                    else{
                        res.ok({message:"success"});
                    }
                });
            }
            else {
                var error = new Error("ForgotError");
                error.pushError("EmailNotExist");
                res.serverError(ErrorWrap(error));
            }
        },function(err){
            res.serverError(ErrorWrap(err));
        });
    },

    check: function(req, res) {
        var data = req.body.data;
        return UserForgot.findOne({
            where:{
                Token : data.token
            }
        })
        .then(function(result){
            if(result!=null && result!=""){
                jwt.verify(data.token,secret,function(err, decoded) {
                    if(err){
                        if(err.name=="TokenExpiredError"){
                            return sequelize.transaction()
                            .then(function(t){
                                UserAccount.findOne({
                                    where:{
                                        UID : data.UID
                                    },
                                    transaction:t
                                })
                                .then(function(result){
                                    if(result!=null && result!=""){
                                        data.email = result.Email;
                                        UserForgot.destroy({
                                            where:{
                                                UserAccountUID: data.UID
                                            },
                                            transaction:t
                                        })
                                        .then(function(success){
                                            t.commit();
                                            Services.UserAccount.sendMail(data,secret,function(err, responseStatus, html, text){
                                                if(err){
                                                    res.serverError(ErrorWrap(err));
                                                }
                                                else{
                                                    var error = new Error("serverError");
                                                    error.pushError("TokenExpiredError");
                                                    res.serverError(ErrorWrap(error));
                                                }
                                            });
                                        },function(err){
                                            t.rollback();
                                            res.serverError(ErrorWrap(err));
                                        })
                                    }
                                    else{
                                        var error = new Error("serverError");
                                        error.pushError("findOneError");
                                        res.serverError(ErrorWrap(error));
                                    }
                                },function(err){
                                    t.rollback();
                                    res.serverError(ErrorWrap(err));
                                });
                            },function(err){
                                res.serverError(ErrorWrap(err));
                            });
                        }
                        else if(err.name=="JsonWebTokenError"){
                            res.serverError(ErrorWrap(err));
                        }
                        else{
                            var error = new Error("serverError");
                            error.pushError("UnknownError");
                            res.serverError(ErrorWrap(error));
                        }
                    }
                    else{
                        return UserForgot.destroy({
                           where:{
                                UserAccountUID: data.UID
                            },
                        })
                        .then(function(success){
                            res.ok({message:"success"});
                        },function(err){
                            res.serverError(ErrorWrap(err));
                        });
                    }
                });
            }
            else {
                var error = new Error("serverError");
                error.pushError("TokennotActivated");
                res.serverError(ErrorWrap(error));
            }
        },function(err){
            res.serverError(ErrorWrap(err));
        });
    },

    changePassforgot: function(req, res) {
        var data = req.body.data;
        if(data.newpass==null || data.newpass=="" ||
            data.UID==null || data.UID==""){
            var error = new Error("serverError");
            error.pushError("invalidParams");
            res.serverError(ErrorWrap(error));
        }
        else {
            return UserAccount.update({
                Password : data.newpass
            },{
                where:{
                    UID : data.UID
                }
            })
            .then(function(success){
                console.log(success);
                if(success!=null && success!="")
                    res.ok({message:"success"});
            },function(err){
                res.serverError(ErrorWrap(err)); 
            });
        }
    }
};

