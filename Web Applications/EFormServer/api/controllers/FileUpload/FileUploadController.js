var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');
var gm = require('gm');
var rootPath = process.cwd();
var constFileType = HelperService.const.fileType;
var constImgExt = HelperService.const.imageExt;
module.exports = {
    UploadFile: function(req, res) {
        var uploadDir = rootPath + '/upload_files/';
        mkdirp(uploadDir, function(err) {
            if (err) return res.serverError(ErrorWrap(err));
            var params = req.params.all();
            if (!params.userUID || !params.fileType) {
                params.userUID = req.headers.useruid;
                params.fileType = req.headers.filetype;
            };
            var maxFileSize = 15 * 1000 * 1000; //in MB
            req.file('uploadFile').upload({
                maxBytes: maxFileSize,
                dirname: uploadDir
            }, function whenDone(err, uploadedFiles) {
                if (err) return res.serverError(ErrorWrap(err));
                if (uploadedFiles.length == 0) {
                    var err = new Error("FileUpload.UploadFile.Error");
                    err.pushError("No File Was Uploaded!");
                    return res.serverError(ErrorWrap(err));
                }
                if (!params.userUID || !params.fileType || !_.contains(constFileType, params.fileType)) {
                    fs.access(uploadedFiles[0].fd, function(err) {
                        if (!err) fs.unlink(uploadedFiles[0].fd);
                    })
                    var err = new Error("FileUpload.UploadFile.Error");
                    err.pushError("Invalid Params!");
                    return res.serverError(ErrorWrap(err));
                }
                Services.UserAccount.GetUserAccountDetails({
                    UID: params.userUID
                }).then(function(data) {
                    if (data) {
                        var fileUID = UUIDService.Create();
                        var fileName = decodeURIComponent(uploadedFiles[0].filename);
                        var fileExt = uploadedFiles[0].filename.split('.')[uploadedFiles[0].filename.split('.').length - 1].toLowerCase();
                        var fileType = params.fileType;
                        if (!_.contains(constImgExt, fileExt)) fileType = constFileType.document;
                        if (_.contains(constImgExt, fileExt) && fileType == constFileType.document) fileType = constFileType.image;
                        HelperService.EncryptFile({
                            inputFile: uploadedFiles[0].fd,
                            outputFile: uploadDir + fileUID,
                            password: fileUID
                        }, function(err) {
                            fs.access(uploadedFiles[0].fd, function(err) {
                                if (!err) fs.unlink(uploadedFiles[0].fd);
                            })
                            if (err) return res.serverError(ErrorWrap(err));
                            sequelize.transaction().then(function(t) {
                                function medicalImageCheck(bodyPart, fileID) {
                                    return MedicalImage.create({
                                        FileUploadID: fileID,
                                        BodyPart: bodyPart
                                    }, {
                                        transaction: t
                                    })
                                }

                                function documentCheck(docType, fileID) {
                                    return DocumentFile.create({
                                        FileUploadID: fileID,
                                        DocType: docType
                                    }, {
                                        transaction: t
                                    })
                                }
                                var fileInfo = null;

                                function startTransaction() {
                                    return FileUpload.create({
                                        UID: fileUID,
                                        UserAccountID: data.ID,
                                        Description: !params.description ? null : params.description,
                                        FileName: fileName,
                                        FileLocation: 'upload_files/' + fileUID,
                                        FileType: fileType,
                                        FileExtension: fileExt,
                                        Enable: 'Y'
                                    }, {
                                        transaction: t
                                    }).then(function(file) {
                                        fileInfo = file;
                                        if (fileType == constFileType.image) return medicalImageCheck(!params.bodyPart ? null : params.bodyPart, file.ID);
                                        else if (fileType == constFileType.document) return documentCheck(!params.docType ? null : params.docType, file.ID);
                                    })
                                }
                                return startTransaction().then(function(data) {
                                    t.commit();
                                    return res.ok({
                                        status: 'success',
                                        fileUID: fileUID,
                                        fileInfo: fileInfo,
                                    })
                                }).catch(function(err) {
                                    t.rollback();
                                    fs.access(uploadDir + fileUID, function(err) {
                                        if (!err) fs.unlink(uploadDir + fileUID);
                                    })
                                    return res.serverError(ErrorWrap(err));
                                })
                            })
                        })
                    } else {
                        fs.access(uploadedFiles[0].fd, function(err) {
                            if (!err) fs.unlink(uploadedFiles[0].fd);
                        })
                        var err = new Error("FileUpload.UploadFile.Error");
                        err.pushError("User Not Exist!");
                        return res.serverError(ErrorWrap(err));
                    }
                }).catch(function(err) {
                    fs.access(uploadedFiles[0].fd, function(err) {
                        if (!err) fs.unlink(uploadedFiles[0].fd);
                    })
                    return res.serverError(ErrorWrap(err))
                })
            })
        })
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
                        mesage: "success"
                    });
                else
                    res.ok({
                        mesage: "DisableAllFile.Error.NotFoundUserAccountID"
                    });
            })
            .catch(function(err) {
                // console.log(err);
                res.serverError(ErrorWrap(err));
            });
    },
    
}
