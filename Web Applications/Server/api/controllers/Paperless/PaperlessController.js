module.exports = {

    postData: function(req, res) {
        var postData = req.body.data;
        var check="";
        var modelName =[];
        Services.Paperless.Check(postData,check,modelName);
        for(var i = 0; i < modelName.length; i++) {
            modelName[i].ModelName = modelName[i].ModelName.substr(1,modelName[i].ModelName.length);
        }
        var objparse = {};
        for(var i = 0; i < modelName.length; i++) {
            objparse = Services.Paperless.parseObj(objparse,modelName[i].ModelName);
        }
        res.ok(objparse);
        
    },

    insertTemplate : function(req, res) {
        var data = req.body.data;
        console.log(data);
        // res.ok({data:data});
        Services.Paperless.insertTemplate(data)
        .then(function(success){
            res.ok({message:"success"});
        })
        .catch(function(err){
            res.serverError(ErrorWrap(err));
        });
    },

    getTemplate : function(req, res) {
        var data = req.body.data;
        Services.Paperless.getTemplate(data)
        .then(function(result){
            // res.ok(result);
            var objparse = {};
            for(var i = 0; i < result.EFormLineTemplate.length; i++) {
                objparse = Services.Paperless.parseObj(objparse,result.EFormLineTemplate[i].Name, result.EFormLineTemplate[i].Value);
            }
            for(var i = 0; i < result.EFormQuestionTemplate.length; i++) {
                for(var j = 0; j < result.EFormSectionTemplate.length; j++) {
                    if(result.EFormQuestionTemplate[i].EFormSectionTemplateID == result.EFormSectionTemplate[j].ID)
                        result.EFormQuestionTemplate[i].dataValues.SectionName = result.EFormSectionTemplate[j].Name;
                }
            }
            // res.ok({data:result.EFormQuestionTemplate});
            res.ok({data:{
                Name           : result.EFormTemplate[0].Name,
                EFormUID       : result.EFormID,
                DetailTemplate : objparse,
                ListQuestion   : result.EFormQuestionTemplate
            },message:"success"});
        })
        .catch(function(err){
            res.serverError(ErrorWrap(err));
        })
    },

    insertData : function(req, res) {
        var data = req.body.data;
        var tempstring="";
        var modelName =[];
        Services.Paperless.Check(data.data,tempstring,modelName);
        return sequelize.transaction()
        .then(function(t){
            return EForm.create({
                UID : UUIDService.Create(),
                EFormTemplateID: data.EFormUID,
                Name : data.Name,
                // Name: chua co
                CreatedBy : data.PatientDetails.ID
            },{transaction:t})
            .then(function(created_EForm){
                for(var i = 0; i < modelName.length; i++) {
                    modelName[i].Name = modelName[i].Name.substr(1,modelName[i].Name.length);
                    modelName[i].UID = UUIDService.Create();
                    modelName[i].EFormID = created_EForm.ID;
                }
                return EFormData.bulkCreate(modelName,{transaction:t,individualHooks:true});
            },function(err){
                t.rollback();
                return res.serverError(ErrorWrap(err));
            })
            .then(function(success){
                t.commit();
                return res.ok({message:"success"});
            },function(err) {
                t.rollback();
                return res.serverError(ErrorWrap(err));
            });
        },function(err){
            return res.serverError(ErrorWrap(err));
        });
    },

    getData : function(req, res) {
        var data = req.body.data;
        if(!('UID' in data) || data.UID == null || data.UID == ""){
            var err = new Error("getData.Error");
            err.pushError("Params.Required");
            res.serverError(ErrorWrap(err));
        }
        else {
            return sequelize.transaction()
            .then(function(t){
                return EForm.findAll({
                    where:{
                        UID : data.UID
                    },
                    transaction : t
                })
                .then(function(got_EForm){
                    if(got_EForm == null || got_EForm == "" || got_EForm.length == 0){
                        var err = new Error("getData.Error");
                        err.pushError("EForm.NotFound");
                        return res.serverError(ErrorWrap(err));
                    }
                    else {
                        if(!('ID' in got_EForm[0])){
                            return got_EForm;
                        }
                        else{
                            return EFormData.findAll({
                                where : {
                                    EFormID : got_EForm[0].ID
                                },
                                transaction : t
                            });
                        }
                    }
                },function(err){
                    t.rollback();
                    return res.serverError(ErrorWrap(err));
                })
                .then(function(success){
                    if(success == null || success == "" || success.length == 0){
                        t.commit();
                        return res.ok({data:[],message:"success"});
                    }
                    else {
                        if(!('ID' in success[0])){
                            t.rollback();
                            return res.serverError(ErrorWrap(err));
                        }
                        else{
                            t.commit();
                            var objparse = {};
                            for(var i = 0; i < success.length; i++) {
                                objparse = Services.Paperless.parseObj(objparse,success[i].Name, success[i].Value);
                            }
                            return res.ok({data:objparse,message:"success"});
                        }
                    }
                    
                },function(err){
                    t.rollback();
                    return res.serverError(ErrorWrap(err));
                })
            });
        }
    },

    listEFormsAppointment : function(req, res) {
        var data = req.body.data;
        if(data == null || data == "" || data.UID == null || data.UID == ""){
            var err = new Error("listEFormsAppointment.Error");
            err.pushError("invalid.Params");
            res.serverError(ErrorWrap(err));
        }
        else {
            Services.Paperless.listEFormsAppointment(data)
            .then(function(result){
                res.ok({data:result.data,count:result.count,message:"success"});
            })
            .catch(function(err){
                res.serverError(ErrorWrap(err));
            });
        }

    },

    listTemplate : function(req, res) {
        var data = req.body.data;
        Services.Paperless.listTemplate(data)
        .then(function(result){
            if(result == null || result == "" || result.length == 0){
                var err = new Error("listTemplate.Error");
                err.pushError("notFound.Template");
                res.serverError(ErrorWrap(err));
            }
            else {
                res.ok({data:result,message:"success"});
            }
        })
        .catch(function(err) {
            res.serverError(ErrorWrap(err));
        })
    },

    getUIDTemplate : function(req, res) {
        var data = req.body.data;
        if(data == null || data == "" || data.EFormTemplateID == null || data.EFormTemplateID == "") {
            var err = new Error("getUIDTemplate.Error");
            err.pushError("invalid.Params");
            res.serverError(ErrorWrap(err));
        }
        else {
            return EFormTemplate.findAll({
                where:{
                    ID : data.EFormTemplateID
                }
            })
            .then(function(result) {
                if(result == undefined || result == null || result =="" || result.length ==0){
                    var err = new Error("getUIDTemplate.Error");
                    err.pushError("notFound.Template");
                    res.serverError(ErrorWrap(err));
                }
                else {
                    res.ok({data:result,message:"success"});
                }
            },function(err) {
                res.serverError(ErrorWrap(err));
            });
        }
    },

    updateData : function(req, res) {
        var data = req.body.data;
        return sequelize.transaction()
        .then(function(t){
            return EForm.findAll({
                where:{
                    UID : data.uid
                },
                transaction : t
            })
            .then(function(got_EForm){
                if(got_EForm != null && got_EForm != "" && got_EForm.length != 0) {
                    var string="";
                    var modelName =[];
                    Services.Paperless.Check(data.info,string,modelName);
                    for(var i = 0; i < modelName.length; i++) {
                        modelName[i].Name = modelName[i].Name.substr(1,modelName[i].Name.length);
                    }
                    var size = 0;
                    return Services.Paperless.updateData(modelName, got_EForm[0].ID, t, size);
                    
                }
                else {
                    t.rollback();
                    var err = new Error("updateData.Error");
                    err.pushError("notFound.EForm");
                    return res.serverError(ErrorWrap(err));
                }
            },function(err){
                t.rollback();
                return res.serverError(ErrorWrap(err));
            })
            .then(function(result){
                t.commit();
                if(result.message != undefined && result.message != null && result.message != "")
                    return res.ok({message:"success"});
            },
            function(err){
                t.rollback();
                return res.serverError(err);
            })
        },function(err){
            return res.serverError(ErrorWrap(err));
        });
    }

    //func : nhan du lieu duoc gui len tu client sau do goi APIs
    //tu server report de truyen du lieu do ra in report
    // getDataFromPDF : function(req, res) {
       
    // }

};
