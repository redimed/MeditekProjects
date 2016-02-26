module.exports = {
    GetListEFormTemplate: function(req, res){
        EFormTemplate.findAll({
            where: {Active: 'Y'},
            include: [{
                model: EFormTemplateData,
                required: false,
                as: 'EFormTemplateData'
            }]
        })
        .then(function(data){
            res.json({data: data});
        })
    },
    PostCreateEFormTemplate: function(req, res){
        return sequelize.transaction(function(t){
            return EFormTemplate.create({
                Name: req.body.name 
            }, {transaction: t})
            .then(function(EFormTemplate){
                return EFormTemplateData.create({
                    EFormTemplateID: EFormTemplate.ID,
                    TemplateData: '[]'
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
                EFormTemplate.update({
                    Name: req.body.name
                })
                .then(function(){
                    res.json({data: EFormTemplate});
                })
            }
        })
    },
    PostDetailEFormTemplate: function(req, res){
        EFormTemplate.find({ where: {ID: req.body.id}, 
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
        EFormTemplateData.find({where: {EFormTemplateID: req.body.id}})
        .then(function(EFormTemplateData){
            if(EFormTemplateData){
                EFormTemplateData.update({
                    TemplateData: req.body.content
                })
                .then(function(){
                    res.json({data: EFormTemplateData});    
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
            }]
        })
        .then(function(data){
            res.json({data: data});
        })
    },
    PostSave: function(req, res){
        var eform = null;
        EFormTemplate.find({where:  {ID: req.body.id}})
        .then(function(EFormTemplate){
            if(EFormTemplate){
                return sequelize.transaction(function(t){
                    return EForm.create({
                        Name: req.body.name,
                        EFormTemplateID: req.body.id 
                    }, {transaction: t})
                    .then(function(EForm){
                        eform = EForm;
                        return EFormData.create({
                            EFormID: EForm.ID,
                            FormData: req.body.content
                        }, {transaction: t})
                    }, function(error){
                        res.status(400).json({err: err});
                        return t.rollback();
                    })
                    .then(function(EFormData){
                        return Patient.find(
                            {
                                attributes: ['ID'],
                                where: {UID: req.body.patientId},
                                transaction: t
                            }
                        )
                    }, function(error){
                        res.status(400).json({err: err});
                        return t.rollback();
                    })
                    .then(function(patient){
                        return eform.addPatient(patient.ID,{
                                transaction: t
                        })
                    }, function(error){
                    })
                    .then(function(data){
                        res.json({data: data});
                        return t.commit();
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
        EFormData.find({ where: {EFormID: req.body.id} })
        .then(function(EFormData){
            if(EFormData){
                EFormData.update({
                    FormData: req.body.content
                })
                .then(function(){
                    res.json({data: EFormData});
                })
            }
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