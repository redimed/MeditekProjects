module.exports = {
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
    PostSave: function(req, res){
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
                            FormData: req.body.content,
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
                    .then(function(data){
                        return res.json({data: data});
                    }, function(err){
                        res.status(400).json({err: err});
                        return t.rollback(); 
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
        EForm.find({ where: {UID: req.body.UID} })
        .then(function(EForm){
            if(EForm){
                EFormData.find({where: {EFormID: EForm.ID}})
                .then(function(EFormData){
                    if(EFormData){
                        EFormData.update({
                            FormData: req.body.content
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
        Patient.findOne({
            where: {UID: req.body.patientUID}
        })
        .then(function(patient){
            EFormTemplate.findOne({
                where: {UID: req.body.templateUID}
            })
            .then(function(eFormTemplate){
                EForm.find({
                    where: {EFormTemplateID: eFormTemplate.ID},
                    include: [
                        {model: EFormData, required: false, as: 'EFormData'},
                        {model: Patient,
                            required: true,
                            through: {
                                where: {PatientID: patient.ID}
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
                            attributes: ['ID'],
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
    }
}