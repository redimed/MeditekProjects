module.exports = {
	JoinRoom: function(req,res){
		if(!req.isSocket)
			res.json({status:'error', message: 'Socket Request Only!'});
		var phoneNumber = typeof req.param('phone') != 'undefined' ? req.param('phone') : null;
		if(phoneNumber != null){
			sails.sockets.join(req.socket, phoneNumber);
		}


	}
}