/**
 * Created by tannvdts on 14/04/2016.
 */
var requestIp = require("request-ip");
module.exports = function(req, res, next) {
  var error=new Error("Policies.Error");
  
  /*console.log("||||||||||||||||| Your current IP:"+req.ip);
  console.log(req.ips);
  console.log(req.headers);
  console.log(req.connection.remoteAddress);*/

  var clientIp = requestIp.getClientIp(req);
  console.log("Client IP: "+clientIp);

  if (sails.config.ip.allow.indexOf(clientIp)>=0)
  {
    return next();
  }
  else
  {
    error.pushError("Policies.ipNotAllow");
    return res.unauthor(error);
  }
}
