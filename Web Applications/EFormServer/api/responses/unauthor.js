module.exports = function unauthor(data, options) {
	  var req = this.req;
	  var res = this.res;
	  var sails = req._sails;

	  // Set status code
	  res.json(401,data);
	   //meditek  modified
    req.typeResponse = 'unauthor: 401';
    LoggingService(req);
    //end meditek
}