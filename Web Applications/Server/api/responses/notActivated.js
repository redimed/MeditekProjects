module.exports = function notActivated(data, options) {
	  var req = this.req;
	  var res = this.res;
	  var sails = req._sails;

	  // Set status code
	  // Non-Authoritative Information:203
	  res.json(203,data);
	   //meditek  modified
    req.typeResponse = 'notActivated: 203';
    LoggingService(req);
    //end meditek
}