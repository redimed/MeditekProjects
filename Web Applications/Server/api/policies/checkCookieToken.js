var o=require("../services/HelperService");
var ErrorWrap=require("../services/ErrorWrap");
var hasToken=require("../policies/hasToken");
module.exports = function(req, res, next) {
    //console.log(req.headers.authorization);
    //console.log(req.cookies.token);
    console.log("=========THIS IS CHECK COOKIES TOKEN==========");
    req.headers.authorization="Bearer "+req.cookies.token;
    console.log("req.headers.authorization: "+req.headers.authorization);
    hasToken(req,res,next);

};