var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');
var gm = require('gm');
var rootPath = process.cwd();
var uploadDir = rootPath + '/upload_files/';

function resizeImage(filePath, fileName, fileExt) {
    var arrSize = [200, 400, 600];
    gm(filePath).size(function(err, size) {
        if (err) throw err;
        _.each(arrSize, function(w, i) {
            var dest = uploadDir + '/' + fileName + '_' + w + '.' + fileExt;
            gm(filePath).resizeExact(w, Math.round((size.height / size.width) * w)).write(dest, function(err) {
                if (err) throw err;
                HelperService.EncryptFile({
                    inputFile: dest,
                    outputFile: uploadDir + fileName + '_' + w,
                    password: fileName
                }, function(err) {
                    if (err) throw err;
                    fs.access(dest, function(err) {
                        if (!err) fs.unlink(dest);
                    })
                    if (i == (arrSize.length - 1)) {
                        fs.access(filePath, function(err) {
                            if (!err) fs.unlink(filePath);
                        })
                    }
                })
            })
        })
    })
}
module.exports = {
    UploadFile: function(req, res) {
        mkdirp(uploadDir, function(err) {
            if (err) return res.serverError(ErrorWrap(err));
            var params = req.params.all();
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
                if (!params.userUID || !params.fileType || !_.contains(HelperService.const.fileType, params.fileType)) {
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
                        var fileExt = uploadedFiles[0].filename.split('.')[1];
                        var fileType = params.fileType;
                        if (!_.contains(HelperService.const.imageExt, fileExt)) fileType = HelperService.const.fileType.document;
                        if (_.contains(HelperService.const.imageExt, fileExt) && fileType == HelperService.const.fileType.document) fileType = HelperService.const.fileType.image;
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
                                        if (fileType == HelperService.const.fileType.image) return medicalImageCheck(!params.bodyPart ? null : params.bodyPart, file.ID);
                                        else if (fileType == HelperService.const.fileType.document) return documentCheck(!params.docType ? null : params.docType, file.ID);
                                    })
                                }
                                return startTransaction().then(function(data) {
                                    t.commit();
                                    if (_.contains(HelperService.const.imageExt, fileExt)) {
                                        mkdirp(rootPath + '/temp', function(err) {
                                            if (err) throw err;
                                            HelperService.DecryptFile({
                                                inputFile: uploadDir + fileUID,
                                                outputFile: rootPath + '/temp/' + fileUID + '.' + fileExt,
                                                password: fileUID
                                            }, function(err) {
                                                if (err) throw err;
                                                fs.access(rootPath + '/temp/' + fileUID + '.' + fileExt, function(err) {
                                                    if (err) throw err
                                                    resizeImage(rootPath + '/temp/' + fileUID + '.' + fileExt, fileUID, fileExt);
                                                })
                                            })
                                        })
                                    }
                                    return res.ok({
                                        status: 'success',
                                        fileUID: fileUID
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
        mkdirp(rootPath + '/temp', function(err) {
            if (err) return res.serverError(ErrorWrap(err));
            FileUpload.find({
                where: {
                    UID: params.fileUID,
                    Enable: 'Y'
                }
            }).then(function(file) {
                if (file) {
                    var dest = rootPath + '/' + file.FileLocation;
                    if (_.contains(HelperService.const.imageExt, file.FileExtension)) dest = !params.size ? rootPath + '/' + file.FileLocation : rootPath + '/' + file.FileLocation + '_' + params.size
                    if (err) return res.serverError(ErrorWrap(err));
                    HelperService.DecryptFile({
                        inputFile: dest,
                        outputFile: rootPath + '/temp/' + file.FileName,
                        password: file.UID
                    }, function(err) {
                        if (err) return res.serverError(ErrorWrap(err));
                        res.download(rootPath + '/temp/' + file.FileName, function(err) {
                            if (err) return res.serverError(ErrorWrap(err));
                            fs.access(rootPath + '/temp/' + file.FileName, file.FileName, function(err) {
                                if (!err) fs.unlink(rootPath + '/temp/' + file.FileName);
                            })
                        });
                    })
                } else {
                    var err = new Error("FileUpload.DownloadFile.Error");
                    err.pushError("File Not Exist!");
                    return res.serverError(ErrorWrap(err));
                }
            }).catch(function(err) {
                return res.serverError(ErrorWrap(err));
            })
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
    }
}