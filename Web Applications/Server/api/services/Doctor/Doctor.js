var $q = require('q');
var _ = require('lodash');
var S = require('string');
//moment
var moment = require('moment');

module.exports = {
	
	/* 
		findallDoctor: Get all data	
	*/
	findallDoctor: function(data) {

		return Doctor
				.findAndCountAll({
					include: [{
						model: UserAccount,
						attributes: ['PhoneNumber'],
						where: {
							$or: [
								{
									PhoneNumber: {
										like: '%' + data.PhoneNumber + '%'
									}
								}
							]
						}
					}],
					where: {
						$or: [
							{
								FirstName: {
									like: '%' + data.FirstName + '%'
								}
							},
							{
								LastName: {
									like: '%' + data.LastName + '%'	
								}
							},
							{
								Email: {
									like: '%' + data.Email + '%'
								}
							}
						]
					},
					offset: data.offset,
					limit: data.limit,
					order: [
						['Email', data.sortEmail],
						['LastName', data.sortLastName],
						['FirstName', data.sortFisrtName]
					]
				});

	},
	/*
		DoctorAppointment: List doctor for Appointment
	*/
	DoctorAppointment: function() {

		return Doctor.findAll({
						where: {
							Enable: 'Y'
						}
					});

	},
	/*
		DoctorIDAppointment: Get doctor according to ID
	*/
	DoctorIDAppointment: function(data) {
		
		return Doctor
					.findAll({
						where: {
							UID: data.UID
						}
					});
	
	},
	/*
		GetDepartment: Get all data of Department
	*/
	GetDepartment: function() {
		return Department.findAll();
	},
	/*
		CreateDoctor: Create new doctor
	*/
	CreateDoctor: function(data) {

		var info = {
			UID: UUIDService.Create(),
			UserAccountID: data.UserAccountID,
			DepartmentID: data.DepartmentID,
			Title: data.Title,
			FirstName: data.FirstName,
			MiddleName: data.MiddleName,
			LastName: data.LastName,
			Type: data.Speciality,
			DOB: data.DOB,
			Address1: data.Address1,
			Address2: data.Address2,
			Postcode: data.Postcode,
			Suburb: data.Suburb,
			State: data.State,
			CountryID: data.CountryID,
			Email: data.Email,
			HomePhoneNumber: data.HomePhoneNumber,
			WorkPhoneNumber: data.WorkPhoneNumber,
			HealthLink: data.HealthLinkID,
			ProviderNumber: data.ProviderNumber.toString(),
			Enable: 'Y',
			CreatedDate: data.CreatedDate,
			CreatedBy: data.CreatedBy
		};

		return Doctor.create(info);
	},
	/*
		GetDetail: Get information's doctor according to uid's doctor
	*/
	GetDetail: function(data) {
		return Doctor.findAll({
					where: {
						UID: data.UID
					},
					include: [{
						model: UserAccount,
						attributes: ['UserName', 'PhoneNumber', 'ID', 'Enable'],
						where: {
							ID: data.UserAccountID
						}
					},{
						model: Department,
						attributes: ['DepartmentName'],
						where: {
							ID: data.DepartmentID
						}

					}]
				});
	},
	/*
		UpdateDoctor: update information's doctor
	*/
	UpdateDoctor: function(data) {

		var info = {
			Title: data.Title.toString(),
			FirstName: data.FirstName,
			MiddleName: data.MiddleName,
			LastName: data.LastName,
			DOB: data.DOB,
			Address1: data.Address1,
			Address2: data.Address2,
			Postcode: data.Postcode.toString(),
			Suburb: data.Suburb.toString(),
			State: data.State,
			CountryID: data.CountryID.toString(),
			HomePhoneNumber: data.HomePhoneNumber.toString(),
			WorkPhoneNumber: data.WorkPhoneNumber.toString(),
			HealthLink: data.HealthLinkID,
			ProviderNumber: data.ProviderNumber.toString(),
			Enable: data.Enable,
			ModifiedDate: data.ModifiedDate,
			ModifiedBy: data.ModifiedBy
		};

		return Doctor.update(info, {
							where: {
								UID: data.UID
							}
					});

	},
	/*
		UpdateAccountDoctor: update status account's doctor
	*/
	UpdateAccountDoctor: function(data) {

		return UserAccount.update({
							Enable: data.Enable
						}, {
							where: {
								ID: data.UserAccountID
							}
						});

	},
	/*
		GetUploadFile: get UID's FileUpload
	*/
	GetUploadFile: function(data) {
		return FileUpload.findAll({
						where: {
							UserAccountID: {
								$in: [data.UserAccountID]
							},
							Enable: 'Y'
						}
					});
	},
	/*
		GetOneUser: Get UID's UserAccount
	*/
	GetOneUser: function(data) {
		return UserAccount.findAll({
					where: {
						ID: data.UserAccountID
					}
				});
	},
	/*
		GetRoleDoctor: Get role's doctor
	*/
	GetRoleDoctor: function(data) {
		return RelUserRole.findOne({
					where: {
						UserAccountId: data
					},
					include: [{
						model: Role,
						attributes: ['RoleName']
					}]
				});
	}

}