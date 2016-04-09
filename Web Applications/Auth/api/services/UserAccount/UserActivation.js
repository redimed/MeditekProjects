/**
 * @namespace UserActivationService
 * 
 */

var $q = require('q');
var randomstring = require("randomstring");
var o = require("../HelperService");
var moment = require("moment");
module.exports = {
    /**
     * TODO
     */
    CheckActivated: function(userInfo, transaction) {
    	var error = new Error("UserActivation.Error");
	    var whereClause = {};
    	function Validation()
    	{
    		
    		var q = $q.defer();
    		try {
		        if (_.isObject(userInfo) && !_.isEmpty(userInfo)) {
		            if (o.checkData(userInfo.UID)) {
		                whereClause.UID = userInfo.UID;
		            } else if (o.checkData(userInfo.UserName)) {
		                whereClause.UserName = userInfo.UserName;
		            } else if (o.checkData(userInfo.Email)) {
		                whereClause.Email = userInfo.Email;
		            } else if (o.checkData(userInfo.PhoneNumber)) {
		                whereClause.PhoneNumber = userInfo.PhoneNumber;
		            } else {
		                error.pushError("CheckActivated.conditionNotFound");
		            }
		        } else {
		            error.pushError("CheckActivated.requireUserInfo");
		        }
		        if (error.getErrors().length > 0) {
		            throw error;
		        }
		        else
		        {
		        	q.resolve({status:'success'});
		        }
    		}
    		catch(e)
    		{
    			q.reject(e);
    		}
    		return q.promise;
    	}

    	return Validation()
    	.then(function(status){
    		return UserAccount.findOne({
                where: whereClause,
                transaction: transaction,
            })
            .then(function(user){
            	if (user) {
	                return user;
	            } else {
	                error.pushError("CheckActivated.UserIsNotExist");
	                throw error;
	            }
            },function(err){
            	error.pushError("CheckActivated.findError");
                throw error;
            })
    	})
    	.catch(function(err){
    		throw err;
    	})
    },

    /**
     * @typedef {object} CreateUserActivationException
     * @memberOf UserActivationService
     * @property {string} ErrorType "CreateUserActivation.Error"
     * @property {Array.<string|object>} ErrorsList Chỉ sử dụng ErrorsList[0]</br>
     * - UserUID.notProvided</br>
     * - SystemType.notProvided</br>
     * - DeviceID.notProvided</br>
     * - AppID.notProvided</br>
     * - SystemType.unknown</br>
     * - CreateUserActivation.paramsNotFound</br>
     * - CreateUserActivation.updateActivationError</br>
     * - CreateUserActivation.userActivationInsertError</br>
     * - CreateUserActivation.checkExistQueryError</br>
     * - CreateUserActivation.userNotFound</br>
     * - CreateUserActivation.userQueryError</br>
     */
    /**
     * @function CreateUserActivation
     * @memberOf UserActivationService
     * @description Tạo UserActivation </br>
     *	Đối với web system: mỗi user chỉ có 1 record</br>
     *	Đối với mobile system: tương ứng với mỗi cặp {userId, deviceId,appId} có 1 record</br>
     *	Nếu record activation của user đã tồn tại thì update, nếu chưa thì insert mới</br>
     * 	+trường hợp update: các thông tin được update: 
     * 		VerificationCode,VerificationToken,TokenCreatedDate,TokenExpired,CodeExpired,
     * 		ModifiedBy,ModifiedDate</br>
     * 	+trường hợp insert: các thông tin được insert:
     * 		UserAccountID,Type,VerificationCode,VerificationToken,CreatedBy,TokenCreatedDate,
     * 		TokenExpired,CodeExpired,CreatedDate</br>
     * @param {object} activationInfo Thông tin dùng để tạo activation
     * @param {string} activationInfo.UserUID 
     * @param {string} activationInfo.Type System type
     * @param {string} [activationInfo.DeviceID] yêu cầu khi mobile
     * @param {string} [activationInfo.AppID] yêu cầu khi mobile
     * @param {objec} transaction DB transaction
     * @return {object} new UserActivation info
     * @throws {UserActivationService.CreateUserActivationException}
     * @throws {UserAccountService.GetUserAccountDetailsException}
     */
    CreateUserActivation: function(activationInfo, transaction) {
        var err = new Error('CreateUserActivation.Error');
        //Kiểm tra thông tin activationInfo có hợp lệ hay không
        function Validation() {
            var q = $q.defer();
            var systems = [];
            var mobileSystems = [];
            systems.push(HelperService.const.systemType.website);
            systems.push(HelperService.const.systemType.ios);
            systems.push(HelperService.const.systemType.android);
            mobileSystems.push(HelperService.const.systemType.ios);
            mobileSystems.push(HelperService.const.systemType.android);

            activationInfo.VerificationCode = randomstring.generate({
                length: o.const.verificationCodeLength,
                charset: 'numeric'
            });
            activationInfo.VerificationToken = randomstring.generate({
                length: o.const.verificationTokenLength
            });
            try {
                if (_.isObject(activationInfo) && !_.isEmpty(activationInfo)) {
                    //Check UserAccountId
                    if (!activationInfo.UserUID) {
                        err.pushError('UserUID.notProvided');
                    }
                    //Check system type
                    if (!activationInfo.Type) {
                        err.pushError('SystemType.notProvided');
                    } else if (systems.indexOf(activationInfo.Type) >= 0) {
                        if (mobileSystems.indexOf(activationInfo.Type) >= 0) {
                            if (!activationInfo.DeviceID) {
                                err.pushError('DeviceID.notProvided');
                            }
                            if (!activationInfo.AppID) {
                                err.pushError('AppID.notProvided');
                            }
                        }
                    } else {
                        err.pushError('SystemType.unknown');
                    }
                } else {
                    err.pushError("CreateUserActivation.paramsNotFound");
                }

                if (err.getErrors().length > 0) {
                    throw err;
                } else {
                    q.resolve({ result: 'success' });
                }
            } catch (err) {
                q.reject(err);
            }
            return q.promise;
        }

        return Validation()
            .then(function(success) {
                return Services.UserAccount.GetUserAccountDetails({ UID: activationInfo.UserUID }, null, transaction)
                    .then(function(user) {
                        if (o.checkData(user)) {
                            //Hàm truy vấn userActivation theo điều kiện
                            function CheckExist() {
                                if (activationInfo.Type == HelperService.const.systemType.website) {
                                    return UserActivation.findOne({
                                        where: {
                                            UserAccountID: user.ID,
                                            Type: HelperService.const.systemType.website
                                        },
                                        transaction: transaction,
                                    });
                                } else {
                                    return UserActivation.findOne({
                                        where: {
                                            UserAccountID: user.ID,
                                            DeviceID: activationInfo.DeviceID,
                                            AppID: activationInfo.AppID,
                                        }
                                    })
                                }
                            }

                            return CheckExist()
                                .then(function(activation) {
                                    if (o.checkData(activation)) {
                                        //Nếu userActivationn đã tồn tại thì update
                                        return activation.updateAttributes({
                                                VerificationCode: activationInfo.VerificationCode,
                                                VerificationToken: activationInfo.VerificationToken,
                                                TokenCreatedDate: new Date(),
                                                TokenExpired: o.const.activationTokenExpired,
                                                CodeExpired: o.const.activationCodeExpired,
                                                ModifiedBy: activationInfo.CreatedBy || null
                                            }, { transaction: transaction })
                                            .then(function(result) {
                                                return result;
                                            }, function(e) {
                                                o.exlog(e);
                                                err.pushError("CreateUserActivation.updateActivationError");
                                                throw err;
                                            })
                                    } else {
                                        //Nếu userActivation chưa tồn tại thì tạo mới
                                        var insertInfo = {
                                            UserAccountID: user.ID,
                                            Type: activationInfo.Type,
                                            VerificationCode: activationInfo.VerificationCode,
                                            VerificationToken: activationInfo.VerificationToken,
                                            CreatedBy: activationInfo.CreatedBy || null,
                                            TokenCreatedDate: new Date(),
                                            TokenExpired: o.const.activationTokenExpired,
                                            CodeExpired: o.const.activationCodeExpired
                                        };
                                        if (activationInfo.Type != HelperService.const.systemType.website) {
                                            insertInfo.DeviceID = activationInfo.DeviceID;
                                            insertInfo.AppID = activationInfo.AppID;
                                        }
                                        return UserActivation.create(insertInfo, { transaction: transaction })
                                            .then(function(result) {
                                                return result;
                                            }, function(e) {
                                                o.exlog(e);
                                                err.pushError("CreateUserActivation.userActivationInsertError");
                                                throw err;
                                            })

                                    }
                                }, function(e) {
                                    o.exlog(e);
                                    err.pushError("CreateUserActivation.checkExistQueryError");
                                    throw err;
                                })

                        } else {
                            err.pushError("CreateUserActivation.userNotFound");
                            throw err;
                        }
                    }, function(e) {
                        o.exlog(e);
                        err.pushError("CreateUserActivation.userQueryError")
                        throw err;
                    })

            }, function(e) {
                throw e;
            })
    },

    /**
     * @typedef {object} ActivationException
     * @memberOf UserActivationService
     * @property {string} ErrorType "Activation.Error"
     * @property {Array.<string|object>} ErrorsList Chỉ sử dụng ErrorsList[0]</br>
     * - Activation.userNotProvided</br>
     * - Activation.systemTypeNotProvided</br>
     * - Activation.methodInvalid</br>
     * - Activation.methodNotProvided</br>
     * - Activation.verificationCodeNotProvided</br>
     * - Activation.deviceIdNotProvided</br>
     * - Activation.appIdNotProvided</br>
     * - Activation.systemTypeInvalid</br>
     * - Activation.tokenInvalid</br>
     * - Activation.tokenExpired</br>
     * - Activation.userUpdateError</br>
     * - Activation.codeInvalid</br>
     * - Activation.codeExpiredUpdateError</br>
     * - Activation.codeExpired</br>
     * - Activation.activationNotFound</br>
     * - Activation.getUserActivationQueryError</br>
     * - Activation.userNotFound</br>
     * - Activation.userQueryError </br>
     */
    /**
     * @function Activation
     * @memberOf UserActivationService
     * @description Activation một account
     * @param {object} activationInfo thông tin dùng để check activation
     * @param {string} activationInfo.UserUID
     * @param {string} activationInfo.SystemType
     * @param {string} [activationInfo.Method] token hay code. Chỉ sử dụng cho website.
     * Nếu method là token thì cần VerificationToken, nếu method là code thì cần VerificationCode
     * @param {string} [activationInfo.VerificationToken] Chỉ sử dụng cho website
     * @param {string} [activationInfo.VerificationCode] Sử dụng cho cả web và mobile
     * @param {string} [activationInfo.DeviceID] Chỉ sử dụng cho mobile
     * @param {string} [activationInfo.AppID] Chỉ sử dụng cho mobile
     * @param {object} transaction DB transaction
     * @return {object} obj.status='success'
     * @throws {UserActivationService.ActivationException}
     * @throws {UserAccountService.GetUserAccountDetailsException}
     */
    Activation: function(activationInfo, transaction) {
        var UserUID = null;
        var SystemType = null;
        var VerificationCode = null;
        var VerificationToken = null;
        var Method = null; //Token,Code
        var DeviceID = null;
        var AppID = null;
        var error = new Error("Activation.Error");
        //Hàm kiểm tra thông tin activationInfo có hợp lệ hay không
        function Validation() {
            var q = $q.defer();
            try {
                if (o.checkData(activationInfo.UserUID)) {
                    UserUID = activationInfo.UserUID;
                } else {
                    error.pushError("Activation.userNotProvided");
                    throw error;
                }

                if (o.checkData(activationInfo.SystemType)) {
                    SystemType = activationInfo.SystemType;
                } else {
                    error.pushError("Activation.systemTypeNotProvided");
                    throw error;
                }

                if (SystemType == o.const.systemType.website) {
                    //Nếu system type là website thì kiểm tra method là token hay code
                    //Nếu là token thì kiểm tra xem có VerificationToken hay không
                    //Nếu là code thì kiểm tra xem có VerificationCode hay không
                    if (o.checkData(activationInfo.Method)) {
                        Method = activationInfo.Method;
                        if (Method == o.const.verificationMethod.token) {
                            VerificationToken = activationInfo.VerificationToken;
                        } else if (Method == o.const.verificationMethod.code) {
                            VerificationCode = activationInfo.VerificationCode;
                        } else {
                            error.pushError("Activation.methodInvalid");
                            throw error;
                        }
                    } else {
                        error.pushError("Activation.methodNotProvided");
                        throw error;
                    }
                } else if ([o.const.systemType.ios, o.const.systemType.android].indexOf(SystemType) >= 0) {
                    //Nếu là mobile thì kiểm tra xem có VerificationCode hay không
                    if (o.checkData(activationInfo.VerificationCode)) {
                        VerificationCode = activationInfo.VerificationCode;
                    } else {
                        error.pushError("Activation.verificationCodeNotProvided");
                        throw error;
                    }
                    if (o.checkData(activationInfo.DeviceID)) {
                        DeviceID = activationInfo.DeviceID;
                    } else {
                        error.pushError("Activation.deviceIdNotProvided");
                        throw error;
                    }
                    if (o.checkData(activationInfo.AppID)) {
                        AppID = activationInfo.AppID;
                    } else {
                        error.pushError("Activation.appIdNotProvided");
                        throw error;
                    }
                } else {
                    error.pushError("Activation.systemTypeInvalid");
                    throw error;
                }
                q.resolve({ status: 'success' });
            } catch (err) {
                q.reject(err);
            }
            return q.promise;
        }

        return Validation()
            .then(function(data) {
                return Services.UserAccount.GetUserAccountDetails({ UID: UserUID }, null, transaction)
                    .then(function(user) {
                        if (o.checkData(user)) {
                            //hàm truy vấn lấy thông tin userActivation
                            function GetUserActivation() {
                                if (SystemType == o.const.systemType.website) {
                                    //Nếu là web system thì kiểm tra record Activation của user có tồn tại
                                    //hay chưa dựa vào UserId và SystemType='WEB'
                                    VerificationToken = activationInfo.VerificationToken;
                                    return UserActivation.findOne({
                                        where: { UserAccountID: user.ID, Type: o.const.systemType.website },
                                        transaction: transaction,
                                    })
                                } else {
                                    //Nếu là mobile system thì kiểm tra record Activation của user có tồn tại
                                    //hay chưa dựa vào userId và DeviceId
                                    VerificationCode = activationInfo.VerificationCode;
                                    DeviceID = activationInfo.DeviceID;
                                    AppID = activationInfo.AppID;
                                    return UserActivation.findOne({
                                        where: { UserAccountID: user.ID, DeviceID: DeviceID, AppID: AppID }
                                    })
                                }
                            }
                            return GetUserActivation()
                                .then(function(activation) {
                                    if (o.checkData(activation)) {
                                        //Hàm xử lý activation bằng token
                                        function activationByToken() {
                                            var tokenCreatedDate = moment(activation.TokenCreatedDate);
                                            var verificationDate = tokenCreatedDate.clone().add(activation.TokenExpired, 'seconds');
                                            console.log('verificationDate:' + verificationDate.format("DD/MM/YYYY HH:mm:ss"));
                                            var current = moment();
                                            console.log('current:' + current.format("DD/MM/YYYY HH:mm:ss"));
                                            if (current.isBefore(verificationDate)) {
                                                if (activation.VerificationToken == VerificationToken) {
                                                    return { status: 'sucess' };
                                                } else {
                                                    error.pushError("Activation.tokenInvalid");
                                                    throw error;
                                                }
                                            } else {
                                                error.pushError("Activation.tokenExpired");
                                                throw error;
                                            }
                                        }
                                        //Hàm xử lý activation bằng code
                                        //Code có codeExpired (số lần tối đa được phép nhập sai)
                                        //Nếu user nhập sai quá số lần quy định thì throw về error
                                        function activationByCode() {
                                            var codeExpired = activation.CodeExpired;
                                            if (codeExpired > 0) {
                                                if (activation.VerificationCode == VerificationCode) {
                                                    return user.updateAttributes({ Activated: "Y" }, { transaction: transaction })
                                                        .then(function(data) {
                                                            return { status: 'success', VerificationToken: activation.VerificationToken };
                                                        }, function(err) {
                                                            o.exlog(err);
                                                            error.pushError("Activation.userUpdateError");
                                                            throw error;
                                                        })
                                                } else {
                                                    return activation.updateAttributes({
                                                            CodeExpired: (codeExpired - 1)
                                                        }) /*{transaction:transaction}*/
                                                        .then(function(data) {
                                                            console.log(data);
                                                            error.pushError("Activation.codeInvalid")
                                                            throw error;
                                                        }, function(err) {
                                                            o.exlog(err);
                                                            error.pushError("Activation.codeExpiredUpdateError");
                                                            throw error;
                                                        });

                                                }
                                            } else {
                                                error.pushError("Activation.codeExpired");
                                                throw error;
                                            }
                                        }
                                        if (SystemType == o.const.systemType.website) {
                                            if (Method == o.const.verificationMethod.token)
                                                return activationByToken();
                                            else
                                                return activationByCode();
                                        } else {
                                            return activationByCode();
                                        }
                                    } else {
                                        error.pushError("Activation.activationNotFound");
                                        throw error;
                                    }
                                }, function(err) {
                                    o.exlog(err);
                                    error.pushError("Activation.getUserActivationQueryError");
                                    throw error;
                                })
                        } else {
                            error.pushError("Activation.userNotFound");
                            throw error;
                        }

                    }, function(err) {
                        o.exlog(err);
                        error.pushError("Activation.userQueryError");
                        throw error;
                    })
            }, function(err) {
                throw err;
            })
    },


    /**
     * DeactivationUserAccount (for admin role) 
     * deactivation thông qua các tiêu chí ID, UID , UserName, Email, Phone,
     * chỉ cần 1 trong 5 tiêu chí được cung cấp thì user tương ứng sẽ bị deactivation
     * Input:
     * 	criteria: là json chứa 1 trong các thuộc tính [ID, UID, UserName, Email, Phone]
     * 	transaction: nếu được cung cấp thì sẽ áp dụng transaction vào các câu truy vấn
     * Output:
     * 	if success return promise update UserAccount
     * 	if error throw err;
     */

    DeactivationUserAccount: function(criteria, transaction) {
        var whereClause = {};
        if (criteria.ID)
            whereClause.ID = criteria.ID;
        else if (criteria.UID)
            whereClause.UID = criteria.UID;
        else if (criteria.UserName)
            whereClause.UserName = criteria.UserName;
        else if (criteria.Email)
            whereClause.Email = criteria.Email;
        else if (criteria.PhoneNumber)
            whereClause.PhoneNumber = criteria.PhoneNumber;
        else {
            var err = new Error('DeactivationUserAccount.Error');
            err.pushError('DeactivationUserAccount.criteriaNotFound');
            throw err;
        }
        return UserAccount.update({ Activated: 'N' }, {
            where: whereClause,
            transaction: transaction,
        });
    },

    /**
     * ActivationUserAccount (for admin role)
     * activation thông qua các tiêu chí ID, UID, UserName, Email, Phone,
     * chỉ cần 1 trong 5 tiêu chí được cung cấp thì user tương ứng sẽ được activation
     * Input:
     * 	criteria: là json chứa 1 trong các thuộc tính [ID, UID, UserName, Email, Phone]
     * 	transaction: nếu được cung cấp thì sẽ áp dụng transaction vào các câu truy vấn
     * Output:
     * 	if success return promise update UserAccount
     * 	if error throw err;
     */
    ActivationUserAccount: function(criteria, transaction) {
        var whereClause = {};
        if (criteria.ID)
            whereClause.ID = criteria.ID;
        else if (criteria.UID)
            whereClause.UID = criteria.UID;
        else if (criteria.UserName)
            whereClause.UserName = criteria.UserName;
        else if (criteria.Email)
            whereClause.Email = criteria.Email;
        else if (criteria.PhoneNumber)
            whereClause.PhoneNumber = criteria.PhoneNumber;
        else {
            var err = new Error('ActivationUserAccount.Error');
            err.pushError('ActivationUserAccount.criteriaNotFound');
            throw err;
        }
        return UserAccount.update({ Activated: 'Y' }, {
            where: whereClause,
            transaction: transaction,
        });
    }

}
