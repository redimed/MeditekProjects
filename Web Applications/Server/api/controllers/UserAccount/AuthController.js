/**
 * AuthController
 *
 * @description : Controller for authentication
 */

var passport = require('passport');
var jwt = require('jsonwebtoken');
var secret = 'ewfn09qu43f09qfj94qf*&H#(R';

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

        passport.authenticate('local', function(err, user, info) 
        {
            if ((err) || (!user)) 
            {
                if(err) 
                    console.log(err);
                res.status(401).json({
                    status:'fail',
                    message:'login failed'
                });
                return;
            }

            req.logIn(user, function(err) 
            {
                if (err) 
                {
                    res.status(401).send(err);
                }
                else
                {
                    //tạo token
                    var token = jwt.sign(user, secret, { expiresInMinutes: 60*24 });
                    res.status(200).json({
                        status:'success',
                        message: info.message,
                        user: user,
                        token:token
                    });
                }
                
            });

        })(req, res);
    },

    /**
     * logout: xử lý logout
     */
    logout: function(req, res) {
        req.logout();
        res.status(200).json({status:"success"});
    },
    

    
};

