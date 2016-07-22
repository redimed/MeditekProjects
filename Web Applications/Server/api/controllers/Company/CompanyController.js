module.exports = {

    CreateCompany: function(req, res) {
        // var data = req.body.data;
        // res.ok({message:data});
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            var err = new Error("create.Error");
            err.pushError("required.data");
            res.serverError(ErrorWrap(err));
        } else {
            Services.Company.CreateCompany(data)
                .then(function(success) {
                    res.ok({message:'success',data:success});
                }, function(err) {
                    res.serverError(ErrorWrap(err));
                });
        }
    },

    getList: function(req, res) {
        var data = req.body.data;
        Services.Company.getList(data)
        .then(function(result) {
            res.ok({message:"success",data:result});
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
                res.ok({message:"empty"});
            else {
                res.ok({
                    message:"success",
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
        if (typeof(data) == 'string') {
            data = JSON.parse(data);
        }
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
        Services.Company.loadDetail({model:data.model,whereClause:{UID:data.UID}})
        .then(function(result) {
            res.ok({message:"success",data:result});
        },function(err) {
            res.serverError(ErrorWrap(err));
        });
    },

    Create : function(req, res) {
        var data = req.body.data;
        Services.Company.Create(data)
        .then(function(result) {
            res.ok({message:'success',data:result});
        },function(err) {
            res.serverError(ErrorWrap(err));
        });
    },

    Update : function(req, res) {
        var data = req.body.data;
        Services.Company.Update(data)
        .then(function(result) {
            res.ok({message:'success',data:result});
        },function(err) {
            res.serverError(ErrorWrap(err));
        });
    },

    ChangeStatus : function(req, res) {
        var data = req.body.data;
        Services.Company.ChangeStatus(data)
        .then(function(result) {
            res.ok({message:'success',data:result});
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
            res.ok({message:"success",data:result});
        },function(err) {
            res.serverError(ErrorWrap(err));
        });
    },

    CreateUser : function(req, res) {
        var data = req.body.data;
        if(!data.CompanyUID){
            var err = new Error("CreateUser.Error");
            err.pushError("CompanyUID.invalidParams");
            res.serverError(ErrorWrap(err));
        }
        if(!data.patientUID){
            var err = new Error("CreateUser.Error");
            err.pushError("patientUID.invalidParams");
            res.serverError(ErrorWrap(err));
        }
        Services.Company.CreateUser(data)
        .then(function(result) {
            res.ok({message:"success",data:result});
        },function(err) {
            res.serverError(ErrorWrap(err));
        });
    },

    GetListFund : function(req, res) {
        var data = req.body.data;
        return Fund.findAndCountAll({
            // attributes : attributes,
            limit      : data.limit,
            offset     : data.offset
        })
        .then(function(result){
            res.ok({message:"success",data:result.rows,count:result.count});
        },function(err) {
            res.serverError(ErrorWrap(err));
        })
    },

    CreateFund : function(req, res) {
        var data = req.body.data;
        if(!data.FundUID || data.FundUID == null || data.FundUID == '') {
            var err = new Error("CreateFund.Error");
            err.pushError("FundUID.invalid.params");
            throw err;
        }
        if(!data.CompanyUID || data.CompanyUID == null || data.CompanyUID == '') {
            var err = new Error("CreateFund.Error");
            err.pushError("CompanyUID.invalid.params");
            throw err;
        }
        data.whereClause = {
            Company: { UID: data.CompanyUID},
            Fund : {UID: data.FundUID}
        };
        sequelize.transaction()
        .then(function(t) {
            Services.Company.CreateFund(data, t)
            .then(function(result) {
                t.commit();
                res.ok({message:"success",data:result});
            },function(err) {
                t.rollback();
                res.serverError(ErrorWrap(err));
            });
        }, function(err) {
            res.serverError(ErrorWrap(err));
        })
    },

    DetailCompanyByUser : function(req, res) {
        var data = req.params;
        Services.Company.DetailCompanyByUser(data)
        .then(function(result) {
            res.ok({message:"success",data:result});
        },function(err) {
            res.serverError(ErrorWrap(err));
        });
    },

    GetListStaff: function(req, res) {
        var data = req.params;
        Services.Company.GetListStaff(data)
        .then(function(result){
            res.ok({message:"success",data:result});
        },function(err) {
            res.serverError(ErrorWrap(err));
        });
    },

    GetListSite : function(req, res) {
        var data = req.params;
        Services.Company.GetListSite(data)
        .then(function(result){
            res.ok({message:"success",data:result});
        },function(err) {
            res.serverError(ErrorWrap(err));
        });
    },

    GetDetailChild : function(req, res) {
        var data = req.body.data;
        Services.Company.GetDetailChild(data)
        .then(function(result) {
            if(data.model == 'CompanySites'){
                console.log("tra o dayu");
                res.ok({message:"success",data:result.rows,count:result.count});
            }
            else{
                console.log("tra o dayu12312312131");
                res.ok({message:"success",data:result,count:result.count});
            }
        },function(err) {
            res.serverError(ErrorWrap(err));
        });
    },

    CreateCompanyForOnlineBooking : function(req, res) {
        var data = req.body;
        Services.Company.CreateCompanyForOnlineBooking(data)
        .then(function(result) {
            res.ok({message:'success',data:result});
        },function(err) {
            res.serverError(ErrorWrap(err));
        });
    },

    GetDetailSiteBySiteIdRefer : function(req, res) {
        var data = req.body.data;
        if(!data) {
            var err = new Error('GetDetailSiteBySiteIdRefer.error');
            err.pushError('invalid.params');
            res.serverError(ErrorWrap(err));
        }

        if(!data.model) {
            var err = new Error('GetDetailSiteBySiteIdRefer.error');
            err.pushError('invalid.model');
            res.serverError(ErrorWrap(err));
        }

        if(!data.whereClause) {
            var err = new Error('GetDetailSiteBySiteIdRefer.error');
            err.pushError('invalid.whereClause');
            res.serverError(ErrorWrap(err));
        }

        data.whereClause.Enable = 'Y';

        Services.Company.loadDetail({model:data.model,whereClause:data.whereClause})
        .then(function(result) {
            if(!result) {
                var err = new Error('GetDetailSiteBySiteIdRefer.error');
                err.pushError('Site.notFound');
                res.serverError(ErrorWrap(err));
            }
            else {
                if(data.getCompany == false){
                    res.ok({message:"success",data:result});
                }
                else {
                    Services.Company.loadDetail({model: 'Company',whereClause:{ID:result.CompanyID,Enable:'Y',Active:'Y'}})
                    .then(function(got_company) {
                        res.ok({message:"success",data:result,company:got_company});
                    },function(err) {
                        res.serverError(ErrorWrap(err));
                    });
                }
            }
        },function(err) {
            res.serverError(ErrorWrap(err));
        });
    },

    GetHistoryCompanyList: function(req, res) {
        var data = req.body.data;
        Services.Company.GetHistoryCompanyList(data)
        .then(function(result) {
            if(!result) {
                var err = new Error('GetHistoryCompanyList.error');
                err.pushError('noData');
                res.serverError(ErrorWrap(err));
            }
            else {
                res.ok({message:"success",data:result});
            }
        }, function(err) {
            res.serverError(ErrorWrap(err));
        });
    },

    TransferData: function(req, res) {
        var data = req.body.data;
        Services.transferData(data)
        .then(function(result) {
            res.ok(result);
        }, function(err) {
            res.serverError(err);
        })
    },

    TransferUser: function(req, res) {
        var data = req.body.data;
        Services.transferUser(data)
        .then(function(result) {
            res.ok(result);
        }, function(err) {
            res.serverError(err);
        })
    },


    Test: function(req, res) {
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
