var $q = require('q');
var _ = require('lodash');
var gm = require('gm');
var fs = require('fs');
var mkdirp = require('mkdirp');
var HelperService  = require('../HelperService');
var rootPath = process.cwd();
var constFileType = HelperService.const.fileType;
var constImgExt = HelperService.const.imageExt;
module.exports = {
    DownloadFile: function(info, callback) {
        if (!info.output || !info.fileUID) {
            var err = new Error("DownloadFile.Error");
            err.pushError("Invalid Params!");
            return callback(err, undefined, undefined);
        }
        mkdirp(info.output, function(err) {
            if (err) return res.serverError(ErrorWrap(err));
            FileUpload.find({
                where: {
                    UID: info.fileUID,
                    Enable: 'Y'
                }
            }).then(function(file) {
                if (file) {
                    var input = rootPath + '/' + file.FileLocation;
                    var output = info.output + (info.output.substr(info.output.length - 1) == '/' ? '' : '/') + file.UID + '_' + Date.now() + '.' + file.FileExtension;
                    HelperService.DecryptFile({
                        inputFile: input,
                        outputFile: output,
                        password: file.UID
                    }, function(err) {
                        if (err) return callback(err, undefined, undefined);
                        if (_.contains(HelperService.const.imageExt, file.FileExtension) && info.size) {
                            gm(output).size(function(err, size) {
                                if (err) return callback(err, undefined, undefined);
                                gm(output).resizeExact(info.size, Math.round((size.height / size.width) * info.size)).write(output, function(err) {
                                    if (err) return callback(err, undefined, undefined);
                                    return callback(undefined, output, file.FileName);
                                })
                            })
                        } else {
                            return callback(undefined, output, file.FileName);
                        }
                    })
                } else {
                    var err = new Error("FileUpload.DownloadFile.Error");
                    err.pushError("File Not Exist!");
                    return callback(err, undefined, undefined);
                }
            }).catch(function(err) {
                return callback(err, undefined, undefined);
            })
        })
    },

    DisableAllFile: function(data) {
        if (data.FileType == null || data.FileType == "" || data.FileType.length == 0) {
            var err = new Error("DisableAllFile.Error");
            err.pushError("FileType.Null");
            throw err;
        } else {
            var whereClause = [];
            for (var i = 0; i < data.FileType.length; i++) {
                whereClause.push({ FileType: data.FileType[i] });
            }
            return sequelize.transaction()
                .then(function(t) {
                    return FileUpload.update({
                            Enable: data.Enable
                        }, {
                            where: {
                                $and: {
                                    UserAccountID: data.UserAccountID,
                                    $or: whereClause
                                }

                            },
                            transaction: t
                        })
                        .then(function(result) {
                            t.commit();
                            return result;
                        }, function(err) {
                            t.rollback();
                            throw err;
                        })
                }, function(err) {
                    throw err;
                });
        }
    },
    ChangeStatus: function(data) {
        if (data.fileType == null || data.fileType == "" || data.fileType.length == 0) {
            var err = new Error("DisableAllFile.Error");
            err.pushError("fileType.Null");
            throw err;
        } else {
            var whereClause = [];
            for (var i = 0; i < data.fileType.length; i++) {
                whereClause.push({ fileType: data.fileType[i] });
            }
            return sequelize.transaction()
                .then(function(t) {
                    return FileUpload.update({
                            Enable: data.enable
                        }, {
                            include: [{
                                model: UserAccount,
                                where: {
                                    UserAccountID: data.UserAccountUID
                                }
                            }],
                            where: {
                                $and: {
                                    UID: {
                                        $notIn: [data.fileUID]
                                    },
                                    $or: whereClause
                                }

                            },
                            transaction: t
                        })
                        .then(function(result) {
                            t.commit();
                            return result;
                        }, function(err) {
                            t.rollback();
                            throw err;
                        })
                }, function(err) {
                    throw err;
                });
        }
    },
    Upload: function(req) {
        var uploadDir = rootPath + '/upload_files/';
        var defer = $q.defer();
        try {
            mkdirp(uploadDir, function(err) {
                if (err) {
                    //defer.reject(err);
                    throw err;
                }
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
                    if (err) {
                        // defer.reject(err);
                        throw err;
                    }
                    if (uploadedFiles.length == 0) {
                        var err = new Error("FileUpload.UploadFile.Error");
                        err.pushError("No File Was Uploaded!");
                        // defer.reject(err);
                        throw err;
                    }
                    console.log("||||||||||||||||||||||||FILE UPLOAD FD:",uploadedFiles[0].fd);
                    if (!params.userUID || !params.fileType || !_.contains(constFileType, params.fileType)) {
                        fs.access(uploadedFiles[0].fd, function(err) {
                            if (!err) {
                                fs.unlink(uploadedFiles[0].fd);
                            } else {
                                throw err;
                            }
                        })
                        var err = new Error("FileUpload.UploadFile.Error");
                        err.pushError("Invalid Params!");
                        // defer.reject(err);
                        throw err;
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
                                    if (!err)
                                    {
                                        fs.unlink(uploadedFiles[0].fd);
                                    } else {
                                        throw err;
                                    }
                                })
                                if (err){
                                    // defer.reject(err);
                                    throw err;
                                }
                                return sequelize.transaction().then(function(t) {
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
                                        defer.resolve({
                                            status: 'success',
                                            fileUID: fileUID,
                                            fileInfo: fileInfo,
                                        });
                                    }).catch(function(err) {
                                        t.rollback();
                                        fs.access(uploadDir + fileUID, function(err) {
                                            if (!err)
                                            {
                                                fs.unlink(uploadDir + fileUID);
                                            } else {
                                                throw  err;
                                            }
                                        })
                                        // defer.reject(err);
                                        throw err;
                                    })
                                })
                            })
                        } else {
                            fs.access(uploadedFiles[0].fd, function(err) {
                                if (!err) {
                                    fs.unlink(uploadedFiles[0].fd);
                                } else {
                                    throw err;
                                }
                            })
                            var err = new Error("FileUpload.UploadFile.Error");
                            err.pushError("User Not Exist!");
                            // defer.reject(err);
                            throw err;
                        }
                    }).catch(function(err) {
                        fs.access(uploadedFiles[0].fd, function(err) {
                            if (!err) {
                                fs.unlink(uploadedFiles[0].fd);
                            } else {
                                throw err;
                            }
                        })
                        // defer.reject(err);
                        throw err;
                    })
                })
            })
        } catch (catchError) {
            defer.reject(catchError);
        }

        return defer.promise;
    }
}
