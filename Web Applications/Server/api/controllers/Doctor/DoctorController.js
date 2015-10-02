module.exports = {

	/*  
		GetDoctor: Get all data from specific table
		Ouput: Information of doctor table
	*/
	GetDoctor: function(req, res) {

		// Information
		var postData = req.body.data;

		Doctor
			.findAll({
				offset: postData.offset,
				limit: postData.limit,
				order: [
					['CreationDate', postData.sort]
				]
			})
			.then(function(result) {
				Doctor
					.count()
					.then(function(counts) {
						res.json(200, {
							data: result,
							count: counts
						});
					});
			})
			.catch(function(err) {
				res.json(500, {
					error: err
				});
			});

	},
	/*
		GetByIdDoctor: Get data according to ID of doctor
		Input: ID
		Output: Information doctor
	*/
	GetByIdDoctor: function(req, res) {

		var postData = req.body.data;

		Doctor
			.findOne({
				where: {
					ID: postData.ID
				}
			})
			.then(function(result) {
				res.json(200, {
					data: result
				});
			})
			.catch(function(err) {
				res.json(500, {
					error: err
				});
			});

	},
	/*
		CreateDoctor: Create new data into doctor table and Create new data into useraccount table
		Input: Information data of doctor
		Output: return success or error
	*/
	CreateDoctor: function(req, res) {

		// Information
		var postData = req.body.data;

		// Validate
		var email_error = postData.Email.match(HelperService.regexPattern.email);
		var numberphone_error = postData.PhoneNumber.match(HelperService.regexPattern.fullPhoneNumber);
		var date_error = postData.Dob.match(HelperService.regexPattern.date);
		var phone_error = postData.Phone.match(HelperService.regexPattern.fullPhoneNumber);

		if(!email_error) {
			return res.json(500, {
				error: "Email is invalid"
			});
		}
		if(!numberphone_error || !phone_error) {
			return res.json(500, {
				error: "Phone is invalid"
			});
		}
		if(!date_error) {
			return res.json(500, {
				error: "Date is invalid"
			});
		}
		else {

			// User
			var info_user = {

				UserName: postData.UserName,
				Email: postData.Email,
				PhoneNumber: postData.PhoneNumber,
				Password: postData.Password

			}
			// Create user
			Services
				.UserAccount
					.CreateUserAccount(info_user)
						.then(function(result_info) {
							// Doctor
							var info_doctor = {

								UID: UUIDService.Create(),
								SiteID: postData.SiteID,
								UserAccountID: result_info.ID,
								FirstName: postData.FirstName,
								MiddleName: postData.MiddleName,
								LastName: postData.LastName,
								Dob: postData.Dob,
								Email: postData.Email,
								Phone: postData.Phone,
								Enable: 'Y',
								CreationDate: postData.CreationDate,
								CreatedBy: postData.CreatedBy

							}
							// Create doctor
							Doctor
								.create(info_doctor)
									.then(function(success) {
										res.json(200, {
											success: "Created Successfull"
										});
									})
									.catch(function(err) {
										res.json(500, {
											error: err
										});
									});

						}, function(err) {
							res.json(500, {
								error: err
							});
						});

		}
		
	},
	/* 
		CreateDoctors: Create new data into doctor table and link into user existed
		Input: information of doctor and ID of user
		Output: return success or error
	*/
	CreateDoctors: function(req, res) {

		// Information
		var postData = req.body.data;

		// Validate
		var email_error = postData.Email.match(HelperService.regexPattern.email);
		var date_error = postData.Dob.match(HelperService.regexPattern.date);
		var phone_error = postData.Phone.match(HelperService.regexPattern.fullPhoneNumber);

		if(!email_error) {
			return res.json(500, {
				error: "Email is invalid"
			});
		}
		if(!phone_error) {
			return res.json(500, {
				error: "Phone is invalid"
			});
		}
		if(!date_error) {
			return res.json(500, {
				error: "Date is invalid"
			});
		}
		else {

			var info_doctor = {

				UID: UUIDService.Create(),
				SiteID: postData.SiteID,
				UserAccountID: postData.UserAccountID,
				FirstName: postData.FirstName,
				MiddleName: postData.MiddleName,
				LastName: postData.LastName,
				Dob: postData.Dob,
				Email: postData.Email,
				Phone: postData.Phone,
				Enable: 'Y',
				CreationDate: postData.CreationDate,
				CreatedBy: postData.CreatedBy

			}

			Doctor
				.create(info_doctor)
					.then(function(success) {
						res.json(200, {
							success: "Created Successfull"
						})
					})
					.catch(function(err) {
						res.json(500, {
							error: err
						});
					});
		}

	},
	/* 
		UpdateDoctor: Update data into doctor table
		Input: information data of doctor
		Ouput: return success or error
	*/
	UpdateDoctor: function(req, res) {

		// Information
		var postData = req.body.data;

		// Validate
		var email_error = postData.Email.match(HelperService.regexPattern.email);
		var date_error = postData.Dob.match(HelperService.regexPattern.date);
		var phone_error = postData.Phone.match(HelperService.regexPattern.fullPhoneNumber);

		if(!email_error) {
			return res.json(500, {
				error: "Email is invalid"
			});
		}
		if(!phone_error) {
			return res.json(500, {
				error: "Phone is invalid"
			});
		}
		if(!date_error) {
			return res.json(500, {
				error: "Date is invalid"
			});
		}
		else {
		
			var info_doctor = {

				FirstName: postData.FirstName,
				MiddleName: postData.MiddleName,
				LastName: postData.LastName,
				Dob: postData.Dob,
				Email: postData.Email,
				Phone: postData.Phone,
				Enable: postData.Enable,
				ModifiedDate: postData.ModifiedDate,
				ModifiedBy: postData.ModifiedBy

			}

			Doctor
				.update(info_doctor, {
					where: {
						ID: postData.ID
					}
				})
				.then(function(result) {
					res.json(200, {
						success: "Updated Successfull"
					});
				})
				.catch(function(err) {
					res.json(500, {
						error: err
					});
				});
		}
	
	},
	/* 
		SearchDoctor: Search information of doctor from doctor table
		Input: Information of doctor
		Ouput: Get data from doctor table
	*/
	SearchDoctor: function(req, res) {

		var postData = req.body.data;

		Doctor
			.findAndCountAll({
				where: {
					$or: [
						{
							FirstName: {
								$like: '%' + postData.key + '%'
							}
						},
						{ 
							LastName: { 
								$like: '%' + postData.key + '%' 
							} 
						},
						{
							Email: {
								$like: '%' + postData.key + '%'
							}
						},
						{
							Phone: {
								$like: '%' + postData.key + '%'
							}
						}
					]
				},
				offset: postData.offset,
				limit: postData.limit
			})
			.then(function(result) {
				res.json(200, {
					data: result.rows,
					count: result.count
				});
			})
			.catch(function(err) {
				res.json(500, {
					error: err
				});
			});

	},
	/* 
		DeleteDoctor: Delete doctor from doctor table
		Input: ID doctor
		Ouput: success or error
	*/
	DeleteDoctor: function(req, res) {

		var postData = req.body.data;

		Doctor
			.destroy({
				where: {
					ID: postData.ID
				}
			})
			.then(function(result) {

				UserAccount
					.destroy({
						where: {
							ID: postData.UserAccountID
						}
					})
					.then(function(success) {
						res.json(200, {
							success: "Deleted Successfull"
						});
					})
					.catch(function(err) {
						res.json(500, {
							error: err
						});
					});

			})
			.catch(function(err) {
				res.json(500, {
					error: err
				});
			});

	}

};