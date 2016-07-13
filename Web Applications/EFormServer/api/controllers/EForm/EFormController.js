var o = require("../../services/HelperService");
module.exports = {
    GetStatus: function(req, res){
        EForm.findOne({
            UID: req.body.EFormUID
        })
        .then(function(eForm){
            res.json(eForm)
        })
    },
    PostEFormPrint: function(req, res){
        EForm.findOne({
            where: {Enable: 'Y', UID: req.body.EFormUID},
            include: [{
                model: EFormTemplate,
                required: false,
                as: 'EFormTemplate'
            },{
                model: EFormData,
                required: false,
                as: 'EFormData'
            }]
        })
        .then(function(data){
            var data_value = JSON.parse(data.EFormData.FormData);
            var result = {
                printMethod:data.EFormTemplate.PrintType,
                templateUID: data.EFormTemplate.UID,
                data: data_value
            }
            res.json(result);
        })
    },
    GetEFormUserRoles: function(req, res){
        Role.findAll({
        })
        .then(function(data){
            res.json({data: data});
        })
    },
    GetListEFormGroup: function(req, res){
        var data = null
        if(!_.isEmpty(req) &&
            !_.isEmpty(req.body)) {
            data = req.body.data
        }
        Services.GetListEFormGroup(data, req.user)
            .then(function(success) {
                res.ok(success);
            }, function(err) {
                if (HelperService.CheckExistData(err) &&
                    HelperService.CheckExistData(err.transaction) &&
                    HelperService.CheckExistData(err.error)) {
                    err.transaction.rollback();
                    res.serverError(ErrorWrap(err.error));
                } else {
                    res.serverError(ErrorWrap(err));
                }
            });

    },
    PostSaveRolesEFormTemplate: function(req, res){
        RelEFormTemplateRole.findOne({
            EFormTemplateID: req.body.data[0].EFormTemplateID
        })
        .then(function(rowOne){
            if(rowOne){
                return sequelize.transaction(function(t){
                    return RelEFormTemplateRole.destroy({
                        where: {EFormTemplateID: req.body.data[0].EFormTemplateID}
                    }, {transaction: t})
                    .then(function(){
                        return RelEFormTemplateRole.bulkCreate(req.body.data, {transaction: t})
                    })
                    .then(function(){

                    })
                })
                .then(function(){
                    res.json({status: 'success'})
                })
            }
        })
    },
    PostCreateEFormGroup: function(req, res){
        var userAccount = null;
        return sequelize.transaction(function(t){
            return UserAccount.findOne({
                where: {UID: req.body.userUID},
                attributes: ['ID'],
                transaction: t
            })
            .then(function(UserAccount){
                userAccount = UserAccount;
                return EFormGroup.create({
                    Name: req.body.name,
                    CreatedBy: UserAccount.ID,
                    ModifiedBy: UserAccount.ID
                }, {transaction: t})
            })
            .then(function(data){
                res.json({data: data});
                return t.commit();
            })
            .catch(function(err){
                return t.rollback();
            })
        })
    },
    PostUpdateEFormGroup: function(req, res){
        UserAccount.findOne({
            where: {UID: req.body.userUID},
            attributes: ['ID'],
        })
        .then(function(UserAccount){
            EFormGroup.update({
                Name: req.body.name,
                ModifiedBy: UserAccount.ID
            }, {where: {id: req.body.id} })
            .then(function(eFormGroup){
                res.json({data: eFormGroup});
            })
        })
    },
    PostRemoveEFormGroup: function(req, res){
        EFormGroup.update({
            Enable: 'N'
        }, {where: {id: req.body.id} })
        .then(function(EFormGroup){
            res.json({data: EFormGroup});
        })
    },
    GetListEFormTemplate: function(req, res){
        EFormTemplate.findAll({
            where: {Active: 'Y'},
            include: [
                {
                    model: EFormTemplateData,
                    required: false,
                    as: 'EFormTemplateData'
                },
                {
                    model: Role,
                    required: false
                },
                {
                    model: UserAccount,
                    required: false
                }
            ]
        })
        .then(function(data){
            res.json({data: data});
        })
    },
    PostCreateEFormTemplate: function(req, res){
        var userAccount = null;
        return sequelize.transaction(function(t){
            return UserAccount.findOne({
                where: {UID: req.body.userUID},
                attributes: ['ID'],
                transaction: t
            })
            .then(function(UserAccount){
                userAccount = UserAccount;
                return EFormTemplate.create({
                    Name: req.body.name,
                    CreatedBy: UserAccount.ID,
                    ModifiedBy: UserAccount.ID
                }, {transaction: t})
            })
            .then(function(EFormTemplate){
                return EFormTemplateData.create({
                    EFormTemplateID: EFormTemplate.ID,
                    TemplateData: '[]',
                    CreatedBy: userAccount.ID,
                    ModifiedBy: userAccount.ID
                }, {transaction: t})
            })
            .then(function(data){
                res.json({data: data});
                return t.commit();
            })
            .catch(function(err){
                return t.rollback();
            })
        })
    },
    PostUpdateEFormTemplate: function(req, res){
        EFormTemplate.find({ where: {ID: req.body.id} })
        .then(function(EFormTemplate){
            if(EFormTemplate){
                UserAccount.findOne({
                    where: {UID: req.body.userUID},
                    attributes: ['ID'],
                })
                .then(function(UserAccount){
                    EFormTemplate.update({
                        Name: req.body.name,
                        ModifiedBy: UserAccount.ID
                    })
                    .then(function(){
                        res.json({data: EFormTemplate});
                    })
                })
            }
        })
    },
    PostUpdatePrintTypeEFormTemplate: function(req, res){
        EFormTemplate.find({ where: {ID: req.body.id} })
        .then(function(EFormTemplate){
            if(EFormTemplate){
                UserAccount.findOne({
                    where: {UID: req.body.userUID},
                    attributes: ['ID'],
                })
                .then(function(UserAccount){
                    EFormTemplate.update({
                        PrintType: req.body.printType,
                        ModifiedBy: UserAccount.ID
                    })
                    .then(function(){
                        res.json({data: EFormTemplate});
                    })
                })
            }
        })
    },
    PostDetailEFormTemplate: function(req, res){
        EFormTemplate.find({ where: {UID: req.body.uid},
            include: [{
                model: EFormTemplateData,
                required: false,
                as: 'EFormTemplateData'
            }] }
        )
        .then(function(EFormTemplate){
            res.json({data: EFormTemplate});
        })
    },
    PostRemoveEFormTemplate: function(req, res){
        EFormTemplate.find({ where: {ID: req.body.id} })
        .then(function(EFormTemplate){
            if(EFormTemplate){
                EFormTemplate.update({
                    Active: 'N',
                    Enable: 'N'
                })
                .then(function(){
                    res.json({data: EFormTemplate});
                })
            }
        })
    },
    PostSaveEFormTemplate: function(req, res){
        EFormTemplate.findOne({ where: {UID: req.body.uid}, attributes: ['ID'] })
        .then(function(EFormTemplate){
            if(EFormTemplate){
                EFormTemplateData.find({where: {EFormTemplateID: EFormTemplate.ID}})
                .then(function(EFormTemplateData){
                    if(EFormTemplateData){
                        UserAccount.findOne({
                            where: {UID: req.body.userUID},
                            attributes: ['ID'],
                        })
                        .then(function(UserAccount){
                            EFormTemplateData.update({
                                TemplateData: req.body.content
                            })
                            .then(function(){
                                res.json({data: EFormTemplateData});
                            })
                        })
                    }
                })
            }
        })
    },
    PostList: function(req, res){
        EForm.findAll({
            where: {Enable: 'Y'},
            include: [{
                model: EFormData,
                required: false,
                as: 'EFormData'
            },{
                model: Patient,
                where: {UID: req.body.patientId}
            },{
                    model: UserAccount,
                    required: false
                }]
        })
        .then(function(data){
            res.json({data: data});
        })
    },
    PostSaveStep: function(req, res){
        EFormData.find({ where: {EFormID: req.body.id} })
        .then(function(EFormData){
            if(EFormData){
                EFormData.update({
                    TempData: req.body.tempData
                })
                .then(function(data){
                    res.json({data: data});
                })
            }
        })
    },
    /*PARAMS
        templateUID
        userUID
        name - name of Template
        tempData - Data Template
        patientUID
        appointmentUID
    */
    PostSaveWithData: function(req, res){
        var eform = null;
        var userAccount = null;
        var eformTemplate = null;
        EFormTemplate.find({where:  {UID: req.body.templateUID}})
        .then(function(EFormTemplate){
            eformTemplate = EFormTemplate;
            if(EFormTemplate){
                return sequelize.transaction(function(t){
                    return UserAccount.findOne({
                        where: {UID: req.body.userUID},
                        attributes: ['ID'],
                        transaction: t
                    })
                    .then(function(UserAccount){
                        userAccount = UserAccount;
                        return EForm.create({
                            Name: req.body.name,
                            Status: 'saved',
                            EFormTemplateID: eformTemplate.ID,
                            CreatedBy: UserAccount.ID,
                            ModifiedBy: UserAccount.ID
                        }, {transaction: t})
                    }, function(err){
                        res.status(400).json({err: err});
                        return t.rollback();
                    })
                    .then(function(EForm){
                        eform = EForm;
                        return EFormData.create({
                            EFormID: EForm.ID,
                            FormData: req.body.tempData,
                            TempData: req.body.tempData,
                            CreatedBy: userAccount.ID,
                            ModifiedBy: userAccount.ID
                        }, {transaction: t})
                    }, function(err){
                        res.status(400).json({err: err});
                        return t.rollback();
                    })
                    .then(function(EFormData){
                        return Patient.find(
                            {
                                attributes: ['ID'],
                                where: {UID: req.body.patientUID},
                                transaction: t
                            }
                        )
                    }, function(err){
                        res.status(400).json({err: err});
                        return t.rollback();
                    })
                    .then(function(patient){
                        return eform.addPatient(patient.ID,{
                                transaction: t
                        })
                    }, function(err){
                       res.status(400).json({err: err});
                        return t.rollback();
                    })
                    .then(function(){
                        return Appointment.find(
                            {
                                attributes: ['ID'],
                                where: {UID: req.body.appointmentUID},
                                transaction: t
                            }
                        )
                    }, function(err){
                        res.status(400).json({err: err});
                        return t.rollback();
                    })
                    .then(function(appointment){
                        return eform.addAppointment(appointment.ID,{
                                transaction: t
                        })
                    }, function(err){
                        res.status(400).json({err: err});
                        return t.rollback();
                    })
                    .then(function(){
                        EForm.findOne({
                            order: 'ID DESC'
                        })
                        .then(function(data){
                            return res.json({data: data});
                        })
                    }, function(err){
                        res.status(400).json({err: err});
                        return t.rollback();
                    })
                })
            }
        })
    },
    PostSaveInit: function(req, res){
        var eform = null;
        var userAccount = null;
        var eformTemplate = null;
        EFormTemplate.find({where:  {UID: req.body.templateUID}})
        .then(function(EFormTemplate){
            eformTemplate = EFormTemplate;
            if(EFormTemplate){
                return sequelize.transaction(function(t){
                    return UserAccount.findOne({
                        where: {UID: req.body.userUID},
                        attributes: ['ID'],
                        transaction: t
                    })
                    .then(function(UserAccount){
                        userAccount = UserAccount;
                        return EForm.create({
                            Name: req.body.name,
                            Status: 'unsaved',
                            EFormTemplateID: eformTemplate.ID,
                            CreatedBy: UserAccount.ID,
                            ModifiedBy: UserAccount.ID
                        }, {transaction: t})
                    }, function(err){
                        res.status(400).json({err: err});
                        return t.rollback();
                    })
                    .then(function(EForm){
                        eform = EForm;
                        return EFormData.create({
                            EFormID: EForm.ID,
                            FormData: '[]',
                            TempData: req.body.tempData,
                            CreatedBy: userAccount.ID,
                            ModifiedBy: userAccount.ID
                        }, {transaction: t})
                    }, function(err){
                        res.status(400).json({err: err});
                        return t.rollback();
                    })
                    .then(function(EFormData){
                        return Patient.find(
                            {
                                attributes: ['ID'],
                                where: {UID: req.body.patientUID},
                                transaction: t
                            }
                        )
                    }, function(err){
                        res.status(400).json({err: err});
                        return t.rollback();
                    })
                    .then(function(patient){
                        return eform.addPatient(patient.ID,{
                                transaction: t
                        })
                    }, function(err){
                       res.status(400).json({err: err});
                        return t.rollback();
                    })
                    .then(function(){
                        return Appointment.find(
                            {
                                attributes: ['ID'],
                                where: {UID: req.body.appointmentUID},
                                transaction: t
                            }
                        )
                    }, function(err){
                        res.status(400).json({err: err});
                        return t.rollback();
                    })
                    .then(function(appointment){
                        return eform.addAppointment(appointment.ID,{
                                transaction: t
                        })
                    }, function(err){
                        res.status(400).json({err: err});
                        return t.rollback();
                    })
                    .then(function(){
                        EForm.findOne({
                            order: 'ID DESC'
                        })
                        .then(function(data){
                            return res.json({data: data});
                        })
                    }, function(err){
                        res.status(400).json({err: err});
                        return t.rollback();
                    })
                })
            }
        })
    },
    PostSave: function(req, res){
        EForm.find({where: {ID: req.body.id}})
        .then(function(EForm){
            if(EForm){
                return sequelize.transaction(function(t){
                    return EForm.update({
                        Status: 'saved'
                    })
                    .then(function(){
                        EFormData.find({ where: {EFormID: req.body.id} })
                        .then(function(EFormData){
                            if(EFormData){
                                EFormData.update({
                                    FormData: req.body.FormData,
                                    TempData: req.body.FormData
                                })
                                .then(function(data){
                                    res.json({data: data});
                                })
                            }
                        })
                    })
                })
            }
        })
    },
    PostRemove: function(req, res){
        EForm.find({ where: {ID: req.body.id} })
        .then(function(EForm){
            if(EForm){
                EForm.update({
                    Enable: 'N'
                })
                .then(function(data){
                    res.json({data: data});
                })
            }
        })
    },
    PostUpdate: function(req, res){
        var eForm = null;
        EForm.find({ where: {UID: req.body.UID} })
        .then(function(EForm){
            if(EForm){
                EFormData.find({where: {EFormID: EForm.ID}})
                .then(function(EFormData){
                    if(EFormData){
                        EFormData.update({
                            FormData: req.body.content,
                            TempData: req.body.content
                        })
                        .then(function(EFormData){
                            res.json({data: EFormData});
                        })
                    }
                })
            }
        }, function(error){
            res.status(400).json({err: error});
        })
    },
    PostCheckDetail: function(req, res){
        var whereClause = {
            appointment: {},
            eformTemplate: {}
        };
        if (req.body.appointmentUID) {
            whereClause.appointment.UID = req.body.appointmentUID;
        };
        if (req.body.appointmentCode) {
            whereClause.appointment.Code = req.body.appointmentCode;
        };
        if (req.body.templateUID) {
            whereClause.eformTemplate.UID = req.body.templateUID;
        };
        if (req.body.templateName) {
            whereClause.eformTemplate.Name = req.body.templateName;
        };

        Appointment.findOne({
            where: o.sqlParam(whereClause.appointment)
        })
        .then(function(appointment){
            EFormTemplate.findOne({
                where: o.sqlParam(whereClause.eformTemplate)
            })
            .then(function(eFormTemplate){
                EForm.find({
                    where: {EFormTemplateID: eFormTemplate.ID},
                    include: [
                        {model: EFormData, required: false, as: 'EFormData'},
                        {model: Appointment,
                            required: true,
                            through: {
                                where: {AppointmentID: appointment.ID}
                            }
                        }
                    ]
                })
                .then(function(EForm){
                    res.json({data: EForm});
                })
            })
        })
    },

    PostDetail: function(req, res){
        EForm.find({ where: {ID: req.body.id},
            include: [{
                model: EFormData,
                required: false,
                as: 'EFormData'
            }] }
        )
        .then(function(EForm){
            res.json({data: EForm});
        })
    },
    PostCreateEFormTemplateModule: function(req, res){
        var userAccount = null;
        return sequelize.transaction(function(t){
            return UserAccount.findOne({
                where: {UID: req.body.userUID},
                attributes: ['ID'],
                transaction: t
            })
            .then(function(UserAccount){
                userAccount = UserAccount;
                return EFormTemplateModule.create({
                    Name: req.body.name,
                    CreatedBy: UserAccount.ID,
                    ModifiedBy: UserAccount.ID
                }, {transaction: t})
            })
            .then(function(EFormTemplateModule){
                return EFormTemplateModuleData.create({
                    EFormTemplateModuleID: EFormTemplateModule.ID,
                    TemplateModuleData: '[]',
                    CreatedBy: userAccount.ID,
                    ModifiedBy: userAccount.ID
                }, {transaction: t})
            })
            .then(function(data){
                res.json({data: data});
                return t.commit();
            })
            .catch(function(err){
                return t.rollback();
            })
        })
    },
    GetListEFormTemplateModule: function(req, res){
        EFormTemplateModule.findAll({
            where: {Active: 'Y'},
            include: [
                {
                    model: EFormTemplateModuleData,
                    required: false,
                    as: 'EFormTemplateModuleData'
                },
                {
                    model: UserAccount,
                    required: false
                }
            ]
        })
        .then(function(data){
            res.json({data: data});
        })
    },
    PostUpdateEFormTemplateModule: function(req, res){
        EFormTemplateModule.find({ where: {ID: req.body.id} })
        .then(function(EFormTemplateModule){
            if(EFormTemplateModule){
                UserAccount.findOne({
                    where: {UID: req.body.userUID},
                    attributes: ['ID'],
                })
                .then(function(UserAccount){
                    EFormTemplateModule.update({
                        Name: req.body.name,
                        ModifiedBy: UserAccount.ID
                    })
                    .then(function(){
                        res.json({data: EFormTemplateModule});
                    })
                })
            }
        })
    },
    PostRemoveEFormTemplateModule: function(req, res){
        EFormTemplateModule.find({ where: {ID: req.body.id} })
        .then(function(EFormTemplateModule){
            if(EFormTemplateModule){
                EFormTemplateModule.update({
                    Active: 'N',
                    Enable: 'N'
                })
                .then(function(){
                    res.json({data: EFormTemplateModule});
                })
            }
        })
    },
    PostDetailEFormTemplateModule: function(req, res){
        EFormTemplateModule.find({ where: {UID: req.body.uid},
            include: [{
                model: EFormTemplateModuleData,
                required: false,
                as: 'EFormTemplateModuleData'
            }] }
        )
        .then(function(EFormTemplateModule){
            res.json({data: EFormTemplateModule});
        })
    },
    PostSaveEFormTemplateModule: function(req, res){
        EFormTemplateModule.findOne({ where: {UID: req.body.uid}, attributes: ['ID'] })
        .then(function(EFormTemplateModule){
            if(EFormTemplateModule){
                EFormTemplateModuleData.find({where: {EFormTemplateModuleID: EFormTemplateModule.ID}})
                .then(function(EFormTemplateModuleData){
                    if(EFormTemplateModuleData){
                        UserAccount.findOne({
                            where: {UID: req.body.userUID},
                            attributes: ['ID']
                        })
                        .then(function(UserAccount){
                            EFormTemplateModuleData.update({
                                TemplateModuleData: req.body.content
                            })
                            .then(function(){
                                res.json({data: EFormTemplateModuleData});
                            })
                        })
                    }
                })
            }
        })
    },
    PostHistoryDetail: function(req, res){
        EForm.findAndCountAll({
            where: {Status: 'saved'},
            include: [
                {
                    model: Patient,
                    where: {UID: req.body.PatientUID}
                },
                {
                    model: EFormTemplate,
                    where: {UID: req.body.EFormTemplateUID}
                },
                {
                    model: Appointment,
                    required: false
                }
            ]
        })
        .then(function(result){
            res.json({data: result});
        })
    },
    GetListEFormTemplateFilter: function(req, res){
        var data = null
        if(!_.isEmpty(req) &&
            !_.isEmpty(req.body)) {
            data = req.body.data
        }
        Services.GetListEFormTemplateFilter(data, req.user)
            .then(function(success) {
                res.ok(success);
            }, function(err) {
                if (HelperService.CheckExistData(err) &&
                    HelperService.CheckExistData(err.transaction) &&
                    HelperService.CheckExistData(err.error)) {
                    err.transaction.rollback();
                    res.serverError(ErrorWrap(err.error));
                } else {
                    res.serverError(ErrorWrap(err));
                }
            });

    },
    GetListEFormTemplateByPatient: function(req, res) {
        var data = req.body;
        if (typeof(data) == 'string') {
            data = JSON.parse(data);
        }
        Services.GetListEFormTemplateByPatient(data)
        .then(function(result) {
            res.ok(result);
        }, function(err) {
            res.serverError(ErrorWrap(err));
        })
    }
}
