var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');
var gm = require('gm');
var rootPath = process.cwd();
var constFileType = HelperService.const.fileType;
var constImgExt = HelperService.const.imageExt;
module.exports = {
    UploadFile: function(req, res) {
        Services.FileUpload.Upload(req).then(function(data) {
            return res.ok(data);
        }, function(err) {
            res.serverError(ErrorWrap(err));
        });
    },
    UploadFileWithoutLogin: function(req, res) {
        Services.FileUpload.Upload(req).then(function(data) {
            return res.ok(data);
        }, function(err) {
            res.serverError(ErrorWrap(err));
        });
    },
    DownloadFile: function(req, res) {

        var params = req.params.all();
        Services.FileUpload.DownloadFile({
            output: rootPath + '/temp/',
            fileUID: params.fileUID,
            size: params.size
        }, function(err, output, fileName) {
            res.set('filename', fileName);
            // res.set('testtesttesttest',true);
            res.header('Access-Control-Expose-Headers', HelperService.const.exposeHeaders);
            // console.log("====Response====: ",res);
            if (err) return res.serverError(ErrorWrap(err));
            res.attachment(fileName);
            var file = fs.createReadStream(output);
            file.on('end', function() {
                if (fs.statSync(output).isFile()) fs.unlinkSync(output);
            })
            file.pipe(res);
        })
    },
    EnableFile: function(req, res) {
        var params = req.params.all();
        if (params.isEnable != 'true' && params.isEnable != 'false') {
            var err = new Error("FileUpload.EnableFile.Error");
            err.pushError("Invalid Params!");
            return res.serverError(ErrorWrap(err));
        }
        var isEnable = (params.isEnable === "true");
        FileUpload.find({
            where: {
                UID: params.fileUID
            }
        }).then(function(file) {
            if (file) {
                file.update({
                    Enable: isEnable ? 'Y' : 'N'
                }).then(function() {
                    return res.ok({
                        status: 'success'
                    })
                })
            } else {
                var err = new Error("FileUpload.DownloadFile.Error");
                err.pushError("File Not Exist!");
                return res.serverError(ErrorWrap(err));
            }
        }).catch(function(err) {
            return res.serverError(ErrorWrap(err));
        })
    },
    DisableAllFile: function(req, res) {
        var data = req.body.data;
        Services.FileUpload.DisableAllFile(data)
            .then(function(result) {
                if (result != null && result != "" && result.length != 0)
                    res.ok({
                        message: "success"
                    });
                else
                    res.ok({
                        message: "DisableAllFile.Error.NotFoundUserAccountID"
                    });
            })
            .catch(function(err) {
                // console.log(err);
                res.serverError(ErrorWrap(err));
            });
    },
    ChangeStatus: function(req, res) {
        var data = req.body.data;
        if (typeof(data) == 'string') {
            data = JSON.parse(data);
        }
        if ('UserAccountUID' in req.body) {
            data.UserAccountUID = req.body.UserAccountUID;
        }
        Services.FileUpload.ChangeStatus(data)
            .then(function(result) {
                if (result != null && result != "" && result.length != 0)
                    res.ok({
                        message: "success"
                    });
                else
                    res.ok({
                        message: "ChangeStatus.Error.NotFoundUserAccountID"
                    });
            })
            .catch(function(err) {
                // console.log(err);
                res.serverError(ErrorWrap(err));
            });
    }
}
