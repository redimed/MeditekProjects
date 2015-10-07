var uuid = require('node-uuid');
module.exports = {
	GenerateUUID: function(){
		return uuid.v4();
	}
}