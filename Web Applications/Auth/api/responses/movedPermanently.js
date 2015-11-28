/**
 * Trả về http status 400 kèm message để thông báo version của api không tồn tại
 */
module.exports = function invalidVersion(data, options) {
  	  var req = this.req;
	  var res = this.res;
	  var sails = req._sails;

	  res.json(301,data);
}