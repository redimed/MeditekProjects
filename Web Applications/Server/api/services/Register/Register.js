module.exports = {

	/*
		CheckUsername: Is username exist?
	*/
	CheckUsername: function(data) {
		return UserAccount
					.findAll({
						where: {
							UserName: data
						}
					});
	},
	/*
		CheckEmail: Is email exist?
	*/
	CheckEmail: function(data) {
		return UserAccount
					.findAll({
						where: {
							$or: [
								{ UserName: data },
								{ Email: data }
							]
						}
					});
	}

}