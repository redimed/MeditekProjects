var _ = require('lodash');
module.exports = {
    /*
        CreatePatient : create a new patient
        input: Patient's information
        output: insert Patient's information into table Patient
    */
    CreatePatient: function(req, res) {
        var data = req.body.data;
        var otherData = req.body.otherData ? req.body.otherData : null;
        Services.Patient.CreatePatient(data, otherData)
            .then(function(patient) {
                if (patient !== undefined && patient !== null && patient !== '' && patient.length !== 0) {
                    if (data.rolecompany == false && data.hasOwnProperty('SiteID') == false && data.hasOwnProperty('SiteIDRefer') == false ) {
                        patient.transaction.commit();
                        var info = {
                            UID: patient.UID,
                            FirstName: patient.FirstName,
                            LastName: patient.LastName,
                            DOB: patient.DOB,
                            Address1: patient.Address1,
                            Address2: patient.Address2,
                            UserAccountUID: patient.UserAccountUID
                        };
                        res.ok({
                            status: 200,
                            message: "success",
                            data: info
                        });
                    } else if(data.SiteID && data.SiteID != 0 && data.SiteID != "0") {
                        return CompanySite.findOne({
                            where:{
                                ID : data.SiteID
                            },
                            transaction: patient.transaction
                        })
                        .then(function(got_site) {
                            if(_.isEmpty(got_site)) {
                                // patient.transaction.rollback();
                                // var err = new Error('CreatePatient.error');
                                // err.pushError('Site.notFound');
                                // return res.serverError(ErrorWrap(err));
                                return got_site;
                            }
                            else {
                                return RelCompanyPatient.create({
                                    CompanyID : got_site.CompanyID,
                                    PatientID : patient.ID,
                                    Active    : 'Y',
                                },{transaction:patient.transaction});
                            }
                        },function(err) {
                            patient.transaction.rollback();
                            res.serverError(ErrorWrap(err));
                        })
                        .then(function(created_relcompanypatient) {
                            // if(_.isEmpty(created_relcompanypatient)) {
                            //     patient.transaction.rollback();
                            //     var err = new Error('CreatePatient.error');
                            //     err.pushError('AddCompany.queryerror');
                            //     return res.serverError(ErrorWrap(err));
                            // }
                            // else {
                                patient.transaction.commit();
                                var info = {
                                    UID: patient.UID,
                                    FirstName: patient.FirstName,
                                    LastName: patient.LastName,
                                    DOB: patient.DOB,
                                    Address1: patient.Address1,
                                    Address2: patient.Address2,
                                    UserAccountUID: patient.UserAccountUID
                                };
                                return res.ok({
                                    status: 200,
                                    message: "success",
                                    data: info
                                });
                            // }
                        },function(err) {
                            patient.transaction.rollback();
                            res.serverError(ErrorWrap(err));
                        });
                    } else if(data.SiteIDRefer && data.SiteIDRefer != 0 && data.SiteIDRefer != "0") {
                        return CompanySite.findOne({
                            where:{
                                SiteIDRefer : data.SiteIDRefer
                            },
                            transaction: patient.transaction
                        })
                        .then(function(got_site) {
                            if(_.isEmpty(got_site)) {
                                // patient.transaction.rollback();
                                // var err = new Error('CreatePatient.error');
                                // err.pushError('Site.notFound');
                                // return res.serverError(ErrorWrap(err));
                                return got_site;
                            }
                            else {
                                return RelCompanyPatient.create({
                                    CompanyID : got_site.CompanyID,
                                    PatientID : patient.ID,
                                    Active    : 'Y',
                                },{transaction:patient.transaction});
                            }
                        },function(err) {
                            patient.transaction.rollback();
                            res.serverError(ErrorWrap(err));
                        })
                        .then(function(created_relcompanypatient) {
                            // if(_.isEmpty(created_relcompanypatient)) {
                            //     patient.transaction.rollback();
                            //     var err = new Error('CreatePatient.error');
                            //     err.pushError('AddCompany.queryerror');
                            //     return res.serverError(ErrorWrap(err));
                            // }
                            // else {
                                patient.transaction.commit();
                                var info = {
                                    UID: patient.UID,
                                    FirstName: patient.FirstName,
                                    LastName: patient.LastName,
                                    DOB: patient.DOB,
                                    Address1: patient.Address1,
                                    Address2: patient.Address2,
                                    UserAccountUID: patient.UserAccountUID
                                };
                                return res.ok({
                                    status: 200,
                                    message: "success",
                                    data: info
                                });
                            // }
                        },function(err) {
                            patient.transaction.rollback();
                            res.serverError(ErrorWrap(err));
                        });
                    } else {
                        if(data.RoleId){
                            return RelUserRole.create({
                                    RoleId: data.RoleId,
                                    SiteId: 1,
                                    UserAccountId: patient.UserAccountID,
                                    Enable: 'Y'
                                }, { transaction: patient.transaction })
                                .then(function(created_companyRole) {
                                    if (!created_companyRole) {
                                        patient.transaction.rollback();
                                        var err = new Error('CreatePatient.error');
                                        err.pushError('AddRole.queryerror');
                                        return res.serverError(ErrorWrap(err));
                                    } else {
                                        return RelCompanyPatient.create({
                                            CompanyID : data.compid,
                                            PatientID : patient.ID,
                                            Active    : 'Y'
                                        },{transaction: patient.transaction})
                                        .then(function(success) {
                                            patient.transaction.commit();
                                            var info = {
                                                UID: patient.UID,
                                                FirstName: patient.FirstName,
                                                LastName: patient.LastName,
                                                DOB: patient.DOB,
                                                Address1: patient.Address1,
                                                Address2: patient.Address2,
                                                UserAccountUID: patient.UserAccountUID
                                            };
                                            return res.ok({
                                                status: 200,
                                                message: "success",
                                                data: info
                                            });
                                        },function(err) {
                                            patient.transaction.rollback();
                                            res.serverError(ErrorWrap(err));
                                        })
                                    }
                                }, function(err) {
                                    patient.transaction.rollback();
                                    res.serverError(ErrorWrap(err));
                                })
                        }
                        else {
                            return RelCompanyPatient.create({
                                CompanyID : data.compid,
                                PatientID : patient.ID,
                                Active    : 'Y'
                            },{transaction: patient.transaction})
                            .then(function(success) {
                                patient.transaction.commit();
                                var info = {
                                    UID: patient.UID,
                                    FirstName: patient.FirstName,
                                    LastName: patient.LastName,
                                    DOB: patient.DOB,
                                    Address1: patient.Address1,
                                    Address2: patient.Address2,
                                    UserAccountUID: patient.UserAccountUID
                                };
                                return res.ok({
                                    status: 200,
                                    message: "success",
                                    data: info
                                });
                            },function(err) {
                                patient.transaction.rollback();
                                res.serverError(ErrorWrap(err));
                            })
                        }
                    }
                } else {
                    var err = new Error("SERVER ERROR");
                    err.pushError("No data result");
                    res.notFound({
                        status: 200,
                        message: ErrorWrap(err)
                    });
                }
            })
            .catch(function(err) {
                // if (err.transaction && err.configENV == 'debug') {
                //     if (err.err.message == 'Authentication Error - invalid username') {
                //         err.transaction.commit();
                //         var info = {
                //             UID: err.info.UID,
                //             FirstName: err.info.FirstName,
                //             LastName: err.info.LastName,
                //             DOB: err.info.DOB,
                //             Address1: err.info.Address1,
                //             Address2: err.info.Address2,
                //             UserAccountUID: err.info.UserAccountUID
                //         };
                //         res.ok({
                //             status: 200,
                //             message: "success",
                //             data: info
                //         });
                //     }
                // } else {
                //     err.transaction.rollback();
                //     res.serverError({
                //         status: 500,
                //         message: ErrorWrap(err)
                //     });
                // }
                err.transaction.rollback();
                res.serverError({
                    status: 500,
                    message: ErrorWrap(err.err)
                });
            });
    },

    RegisterPatient: function(req, res) {
        var data = req.body.data;
        for (var key in data) {
            if (data[key] == null || data[key] == '') {
                delete data[key];
            }
        }
        var otherData = req.body.otherData ? req.body.otherData : null;
        // var PatientPensionData = req.body.PatientPension?req.body.PatientPension:{};
        // var PatientDVA = req.body.PatientDVA?req.body.PatientDVA:{};
        // var PatientKin = req.body.PatientKin?req.body.PatientKin:{};
        // var PatientMedicare = req.body.PatientMedicare?req.body.PatientMedicare:{};
        Services.Patient.CreatePatient(data, otherData)
            .then(function(patient) {

                if (patient !== undefined && patient !== null && patient !== '' && patient.length !== 0) {
                    patient.transaction.commit();
                    var info = {
                        UID: patient.UID,
                        FirstName: patient.FirstName,
                        LastName: patient.LastName,
                        DOB: patient.DOB,
                        Address1: patient.Address1,
                        Address2: patient.Address2,
                        UserAccountUID: patient.UserAccountUID
                    };
                    res.ok({
                        status: 200,
                        message: "success",
                        data: info
                    });
                } else {
                    var err = new Error("SERVER ERROR");
                    err.pushError("No data result");
                    res.notFound({
                        status: 200,
                        message: ErrorWrap(err)
                    });
                }
            })
            .catch(function(err) {
                // if (err.transaction && err.configENV == 'debug') {
                //     if (err.err.message == 'Authentication Error - invalid username') {
                //         err.transaction.commit();
                //         var info = {
                //             UID: err.info.UID,
                //             FirstName: err.info.FirstName,
                //             LastName: err.info.LastName,
                //             DOB: err.info.DOB,
                //             Address1: err.info.Address1,
                //             Address2: err.info.Address2,
                //             UserAccountUID: err.info.UserAccountUID
                //         };
                //         res.ok({
                //             status: 200,
                //             message: "success",
                //             data: info
                //         });
                //     }
                // } else {
                //     err.transaction.rollback();
                //     res.serverError({
                //         status: 500,
                //         message: ErrorWrap(err)
                //     });
                // }

                err.transaction.rollback();
                res.serverError({
                    status: 500,
                    message: ErrorWrap(err.err)
                });

            });
    },
    /*
        SearchPatient : find patient with condition
        input: Patient's name or PhoneNumber
        output: get patient's list which was found in client
    */
    SearchPatient: function(req, res) {
        var data = req.body.data;
        var count = 0;
        var array = ['FirstName', 'LastName', 'DOB', 'Gender', 'PhoneNumber', 'Email1'];
        if (typeof data == 'object') {
            for (var i = 0; i < array.length; i++) {
                for (var key in data) {
                    if (key == array[i])
                        count++;
                }
            }
        } else {
            var err = new Error("Search.ERROR");
            err.pushError("invalid.Data");
            res.serverError(ErrorWrap(err));
        }
        if (count == 0) {
            var err = new Error("Search.ERROR");
            err.pushError("notFound.attribute");
            res.serverError(ErrorWrap(err));
        } else {
            Services.Patient.SearchPatient(data)
                .then(function(info) {
                    if (info !== undefined) {
                        if (info === null)
                            res.ok({
                                status: 200,
                                message: "success",
                                data: [],
                                count: 0
                            });
                        else
                            res.ok({
                                status: 200,
                                message: "success",
                                data: info,
                            });
                    } else {
                        var err = new Error("SERVER ERROR");
                        err.pushError("No data result");
                        res.notFound({
                            status: 200,
                            message: ErrorWrap(err)
                        });
                    }
                })
                .catch(function(err) {
                    res.serverError({
                        status: 500,
                        message: ErrorWrap(err)
                    });
                });
        }
    },


    /*
        UpdatePatient : update patient's information
        input: patient's information updated
        output: update patient'infomation into table Patient
    */
    UpdatePatient: function(req, res) {
        var data = req.body.data;
        if (typeof(data) == 'string') {
            data = JSON.parse(data);
        }
        if ('UserAccountUID' in req.body) {
            data.UserAccountUID = req.body.UserAccountUID;
        }

        var otherData = req.body.otherData ? req.body.otherData : {};
        Services.Patient.UpdatePatient(data, otherData)
            .then(function(result) {

                if (result != undefined && result != null && result != "" && result == "success")
                    res.ok({
                        status: 200,
                        message: "success"
                    });
                else {
                    var err = new Error("SERVER ERROR");
                    err.pushError("No data result");
                    res.ok({
                        message: ErrorWrap(err)
                    });
                }
            })
            .catch(function(err) {
                return res.serverError({
                    status: 500,
                    message: ErrorWrap(err)
                });
            });
    },

    /*
        GetPatient get a patient with condition
        input:  UserAccount's UID
        output: Patient's information of Patient's ID if patient has data.
    */
    GetPatient: function(req, res) {
        var data = req.body.data;
        Services.Patient.GetPatient(data)
            .then(function(info) {
                if (info != null && info != undefined && info != '') {
                    var responseData = [];
                    responseData.push(info.Patient);
                    responseData[0].dataValues.ProfileImage = null;
                    responseData[0].dataValues.Signature = null;

                    responseData[0].dataValues.PhoneNumber = info.PhoneNumber;
                    responseData[0].dataValues.Email = info.Email;
                    responseData[0].dataValues.CountryName = info.Patient.Country1.ShortName;
                    delete responseData[0].dataValues['Country1'];
                    for (var i = 0; i < info.dataValues.FileUploads.length; i++) {
                        // info[0].dataValues.ProfileImage = info[0].dataValues.UserAccount.FileUploads[i].FileType=='ProfileImage'?info[0].dataValues.UserAccount.FileUploads[i].UID:null;
                        // info[0].dataValues.Signature = info[0].dataValues.UserAccount.FileUploads[i].FileType=='Signature'?info[0].dataValues.UserAccount.FileUploads[i].UID:null;
                        if (responseData[0].dataValues.ProfileImage == null || responseData[0].dataValues.ProfileImage == '') {
                            responseData[0].dataValues.ProfileImage = info.dataValues.FileUploads[i].FileType == 'ProfileImage' ? info.dataValues.FileUploads[i].UID : null;
                        }
                        if (responseData[0].dataValues.Signature == null || responseData[0].dataValues.Signature == '') {
                            responseData[0].dataValues.Signature = info.dataValues.FileUploads[i].FileType == 'Signature' ? info.dataValues.FileUploads[i].UID : null;
                        }

                    }
                    // delete info[0].dataValues['UserAccount'];

                    res.ok({
                        status: 200,
                        message: "Success",
                        data: responseData
                    });
                } else {
                    var err = new Error("SERVER ERROR");
                    err.pushError("No data result");
                    res.serverError({
                        message: ErrorWrap(err)
                    });
                }
            })
            .catch(function(err) {
                res.serverError({
                    status: 500,
                    message: ErrorWrap(err)
                });
            });
    },

    /*
        DetailPatient: get detail patient with patient UID
        input: patient's UID
        output: Patient's information
    */
    DetailPatient: function(req, res) {
        var data = req.body.data;
        if (typeof(data) == 'string') {
            data = JSON.parse(data);
        }
        Services.Patient.DetailPatient(data)
            .then(function(info) {
                if (info != null && info != undefined && info != '' && info.length != 0) {
                    return FileUpload.findAll({
                            where: {
                                UserAccountID: info[0].UserAccountID,
                                FileType: { $in: ['ProfileImage', 'Signature'] },
                                Enable: 'Y'
                            }
                        })
                        .then(function(success) {
                            if (success !== undefined && success !== null && success !== '' && success.length !== 0) {
                                for (var i = 0; i < success.length; i++) {
                                     if(success[i].FileType == 'ProfileImage'){
                                        info[0].dataValues.ProfileImage = success[i].UID ? success[i].UID : null;
                                    }
                                   
                                    // if(info[0].dataValuesFileType == "Signature")
                                    if(success[i].FileType == 'Signature') {
                                        info[0].dataValues.Signature = success[i].UID ? success[i].UID : null;
                                    }
                                }
                                info[0].dataValues.CountryName = info[0].dataValues.Country1.ShortName;
                                delete info[0].dataValues['Country1'];
                                return res.ok({
                                    status: 200,
                                    message: "success",
                                    data: info
                                });
                            } else {

                                info[0].dataValues.Signature = null;
                                info[0].dataValues.ProfileImage = null;
                                info[0].dataValues.CountryName = info[0].dataValues.Country1.ShortName;
                                delete info[0].dataValues['Country1'];
                                return res.ok({
                                    status: 200,
                                    message: "success",
                                    data: info
                                });
                            }
                        }, function(err) {
                            var err = new Error("SERVER ERROR");
                            err.pushError("Server Error");
                            res.ok({
                                message: ErrorWrap(err)
                            });
                        });

                } else {
                    var err = new Error("SERVER ERROR");
                    err.pushError("No data result");
                    res.ok({
                        message: ErrorWrap(err)
                    });
                }
            })
            .catch(function(err) {
                res.serverError({
                    status: 500,
                    message: ErrorWrap(err)
                });
            });
    },

    /*
        DeletePatient : disable patient who was deleted.
        input: Patient's ID
        output: attribute Enable of Patient will receive value "N" in table Patient
    */
    DeletePatient: function(req, res) {
        var ID = req.body.data;
        var patientInfo = {
            ID: ID,
            Enable: "N"
        }
        Services.Patient.UpdatePatient(patientInfo)
            .then(function(result) {
                if (result === 0) {
                    var err = new Error("SERVER ERROR");
                    err.pushError("No data result");
                    res.ok({
                        message: ErrorWrap(err)
                    });
                } else
                    res.ok({
                        status: 200,
                        message: "success"
                    });
            })
            .catch(function(err) {
                res.serverError({
                    status: 500,
                    message: ErrorWrap(err)
                });
            });
    },

    /*
        LoadListPatient: load list patient
        input: amount patient
        output: get list patient from table Patient
    */
    LoadListPatient: function(req, res) {
        var data = req.body.data;
        if (typeof(data) == 'string') {
            data = JSON.parse(data);
            for (var key in data) {
                if (typeof(data[key]) == 'string')
                    data[key] = JSON.parse(data[key]);
            }
        }
        Services.Patient.LoadListPatient(data)
            .then(function(result) {
                if (result !== undefined && result !== null && result !== '')
                    res.ok({
                        status: 200,
                        message: "success",
                        data: result.rows,
                        count: result.count
                    });
                else {
                    var err = new Error("SERVER ERROR");
                    err.pushError("No data result");
                    res.ok({
                        message: ErrorWrap(err)
                    });
                }
            })
            .catch(function(err) {
                res.serverError({
                    status: 500,
                    message: ErrorWrap(err)
                });
            });
    },

    /*
        CheckPatient : check patient has created ?
        input : Patient's PhoneNumber
        output: true if patient has created and (false,data:{}) if patient hasn't created
    */
    CheckPatient: function(req, res) {
        var data = req.body.data;
        Services.Patient.CheckPatient(data)
            .then(function(result) {
                if (result !== undefined && result !== null) {
                    // res.ok({
                    //     status: 200,
                    //     message: "success",
                    //     data: result
                    // });
                    if(!data.UserName) {
                        res.ok({
                            status: 200,
                            message: "success",
                            data: result
                        });
                    }
                    else {
                        return UserAccount.findOne({
                            where:{
                                UserName: data.UserName
                            }
                        })
                        .then(function(got_user) {
                            if(got_user !== undefined && got_user !== null) {
                                if(result.isCreated == false) {
                                    result.isCreated = true;
                                    result.field = {};
                                    result.field.UserName = true;
                                    res.ok({
                                        status: 200,
                                        message:"success",
                                        data: result
                                    });
                                }
                                else {
                                    result.field.UserName = true;
                                    res.ok({
                                        status: 200,
                                        message:"success",
                                        data: result
                                    });
                                }
                            }
                            else {
                                res.ok({
                                    status: 200,
                                    message: "success",
                                    data: result
                                });
                            }
                        },function(err) {
                            res.serverError(ErrorWrap(err));
                        });
                    }
                } else {
                    var err = new Error("SERVER ERROR");
                    err.pushError("No data result");
                    res.ok({
                        message: ErrorWrap(err)
                    });
                }
            })
            .catch(function(err) {
                res.serverError({
                    status: 500,
                    message: ErrorWrap(err)
                });
            })
    },

    /*
        GetListCountry : load list country
        input  : (none)
        output : list country default to use
    */
    GetListCountry: function(req, res) {
        HelperService.getListCountry()
            .then(function(result) {
                if (result !== undefined && result !== null && result !== '' && result.length !== 0)
                    res.ok({
                        status: 200,
                        message: "success",
                        data: result
                    });
                else {
                    var err = new Error("SERVER ERROR");
                    err.pushError("No data result");
                    res.ok({
                        message: ErrorWrap(err)
                    });
                }
            })
            .catch(function(err) {
                res.serverError({
                    status: 500,
                    message: ErrorWrap(err)
                });
            })
    },

    /*
        getfileUID : get patient's fileUID
        input  : patient 's UserAccountID
        output : return file UID if patient had, else return error no data result
    */
    getfileUID: function(req, res) {
        var data = req.body.data;
        Services.Patient.getfileUID(data)
            .then(function(result) {
                if (result != undefined) {
                    res.ok({
                        status: 200,
                        message: "success",
                        data: result
                    });
                } else {
                    var err = new Error("SERVER ERROR");
                    err.pushError("No data result");
                    res.ok({
                        message: ErrorWrap(err)
                    });
                }

            })
            .catch(function(err) {
                res.serverError({
                    status: 500,
                    message: ErrorWrap(err)
                });
            })
    },

    AddChild: function(req, res) {
        var data = req.body.data;
        Services.Patient.AddChild(data)
            .then(function(result) {
                res.ok({ message: 'success', data: result });
            }, function(err) {
                res.serverError(ErrorWrap(err));
            });
    },

    ChangeStatusChild: function(req, res) {
        var data = req.body.data;
        Services.Patient.ChangeStatusChild(data)
            .then(function(result) {
                res.ok({ message: 'success', data: result });
            }, function(err) {
                res.serverError(ErrorWrap(err));
            });
    },

    DetailChild: function(req, res) {
        var data = req.body.data;
        Services.Patient.DetailChild(data)
            .then(function(result) {
                res.ok({ message: 'success', data: result });
            }, function(err) {
                res.serverError(ErrorWrap(err));
            });
    },

    SendEmailWhenLinked: function(req , res) {
        var data = req.body.data;
        Services.Patient.SendEmailWhenLinked(data)
        .then(function(result) {
            res.ok({message:'success',data : result});
        }, function(err) {
            res.serverError(ErrorWrap(err));
        })
    },

    UpdateSignature: function(req, res) {
        var data = req.body.data;
        Services.Patient.UpdateSignature(data)
        .then(function(result) {
            res.ok({message:'success',data:result});
        }, function(err) {
            res.serverError(ErrorWrap(err));
        })
    },

    UpdateEFormAppointment: function(req, res) {
        var data = req.body.data;
        Services.Patient.UpdateEFormAppointment(data)
        .then(function(result) {
            res.ok({message:'success',data:result});
        }, function(err) {
            res.serverError(ErrorWrap(err));
        })
    },

};
