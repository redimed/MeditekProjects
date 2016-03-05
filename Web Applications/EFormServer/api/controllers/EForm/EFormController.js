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
                console.log(EFormTemplate);
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
        EFormTemplate.findOne({where: {UID: req.body.templateUID} })
        .then(function(EFormTemplate){
            if(EFormTemplate){
                EForm.findOne({
                    where: {EFormTemplateID: EFormTemplate.ID},
                    include: [
                        {model: EFormData, required: false, as: 'EFormData'}
                    ]
                })
                .then(function(EForm){
                    res.json({data: EForm});
                })
            }
        }, function(error){
            res.status(400).json({err: error});
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
    }
}