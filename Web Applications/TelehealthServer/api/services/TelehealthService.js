module.exports = {
    FindByUID: function(uid) {
        return TelehealthUser.find({
            where: {
                UID: uid
            }
        });
    },
    GetOnlineUsers: function() {
    	var users = [];
        var list = sails.sockets.rooms();
        var phoneRegex = /^\+[0-9]{9,15}$/;
        if (list.length > 0) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].indexOf(":") != -1) {
                    var data = list[i].split(':');
                    if (data[1].match(phoneRegex)) {
                        users.push({
                            uid: data[0],
                            phone: data[1]
                        })
                    }
                }
            }
        } else users = []
        sails.sockets.blast('online_users', users);
    }
}