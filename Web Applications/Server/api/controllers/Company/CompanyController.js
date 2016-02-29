module.exports = {

    CreateCompany: function(req, res) {
        // var data = req.body.data;
        // res.ok({mesage:data});
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            var err = new Error("create.Error");
            err.pushError("required.data");
            res.serverError(ErrorWrap(err));
        } else {
            Services.Company.CreateCompany(data)
                .then(function(success) {
                    res.ok({mesage:'success',data:success});
                }, function(err) {
                    res.serverError(ErrorWrap(err));
                });
        }
    },

    getList: function(req, res) {
        var data = req.body.data;
        Services.Company.getList(data)
        .then(function(result) {
            res.ok({mesage:"success",data:result});
        })
        .catch(function(err) {
            res.serverError(ErrorWrap(err));
        });
    },

    detailCompany: function(req, res) {
        var data = req.body.data;
        Services.Company.detailCompany(data)
        .then(function(result) {
            if(result== null || result == '')
                res.ok({mesage:"empty"});
            else {
                res.ok({
                    mesage:"success",
                    data: result
                });
            }
        })
        .catch(function(err) {
            res.serverError(ErrorWrap(err));
        });
    },

    loadDetail: function(req, res) {
        var data = req.body.data;
        if(!data.model || data.model == null || data.model == ''){
            var err = new Error("loadDetail.error");
            err.pushError("model.invalidParams");
            res.serverError(ErrorWrap(err));
        }
        if(!data.UID || data.UID == null || data.UID == ''){
            var err = new Error("loadDetail.error");
            err.pushError("UID.invalidParams");
            res.serverError(ErrorWrap(err));
        }
        Services.Company.loadDetail(data)
        .then(function(result) {
            res.ok({mesage:"success",data:result});
        },function(err) {
            res.serverError(ErrorWrap(err));
        });
    },

    Create : function(req, res) {
        var data = req.body.data;
        Services.Company.Create(data)
        .then(function(result) {
            res.ok({mesage:'success',data:result});
        },function(err) {
            res.serverError(ErrorWrap(err));
        });
    },

    Update : function(req, res) {
        var data = req.body.data;
        Services.Company.Update(data)
        .then(function(result) {
            res.ok({mesage:'success',data:result});
        },function(err) {
            res.serverError(ErrorWrap(err));
        });
    },

    ChangeStatus : function(req, res) {
        var data = req.body.data;
        Services.Company.ChangeStatus(data)
        .then(function(result) {
            res.ok({mesage:'success',data:result});
        },function(err) {
            res.serverError(ErrorWrap(err));
        });
    },

    CreateStaff : function(req, res) {
        var data = req.body.data;
        if(!data.CompanyUID){
            var err = new Error("CreateStaff.Error");
            err.pushError("CompanyUID.invalidParams");
            res.serverError(ErrorWrap(err));
        }
        if(!data.patientUID){
            var err = new Error("CreateStaff.Error");
            err.pushError("patientUID.invalidParams");
            res.serverError(ErrorWrap(err));
        }
        Services.Company.CreateStaff(data)
        .then(function(result) {
            res.ok({mesage:"success",data:result});
        },function(err) {
            res.serverError(ErrorWrap(err));
        });
    },

    Test: function(req, res ) {
        return UserAccount.findAll({
            include: [{
                model: Company,
                attributes:['UID','ID'],
                where: {Enable: 'Y'}
          }]
        })
        .then(function(result) {
            res.ok(result);
        },function(err) {
            res.serverError(err);
        });
    }

};
