var _ = require('lodash');
var o = require("../HelperService");
module.exports = function(data, userLogin) {
	if(!data) {
		var err = new Error('updatePassword.error');
		err.pushError('notFound.params');
		throw err;
	}

	if(!data.UserName) {
		var err = new Error('updatePassword.error');
		err.pushError('notFound.UserName.params');
		throw err;
	}

	if(!data.Password) {
		var err = new Error('updatePassword.error');
		err.pushError('notFound.Password.params');
		throw err;
	}

	var p = new Promise(function(a, b) {
		var user;
		var userUID;
		sequelize.transaction()
		.then(function(t) {
			if(!userLogin) {
				var err = new Error('updateUserData.error');
				err.pushError('notFound.loginUser');
				b(err);
			}
			else {
				var isAdmin = false;
				for(var i = 0; i < userLogin.roles.length; i++) {
					if(userLogin.roles[i].RoleCode == 'ADMIN') {
						isAdmin = true;
					}
				}
				console.log("isAdmin ",isAdmin)
				if(isAdmin == false) {
					var err = new Error('updatePassword.error');
					err.pushError('not.Admin');
					t.rollback();
					b(err);
				}
				else {
					UserAccount.findOne({
						attributes:['ID','UID'],
						where : { UserName : data.UserName },
						transaction : t
					})
					.then(function(got_user) {
						if(!got_user) {
							var err = new Error('updatePassword.error');
							err.pushError('notFound.User');
						}
						else {
							return UserAccount.update({Password : data.Password},{
								where : { UserName : data.UserName },
								transaction : t,
							});
						}
					}, function(err) {
						throw err;
					})
					.then(function(updated) {
						t.commit();
						a(updated);
					}, function(err) {
						t.rollback();
						b(err);
					})
				}

			}
		}, function(err) {
			b(err);
		})
	});

	return p;
};