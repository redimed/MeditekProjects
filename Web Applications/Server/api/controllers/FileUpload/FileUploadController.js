var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');
var rootPath = process.cwd();
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr';
var zlib = require('zlib');

function encryptFile(info, callback) {
    var inputStream = fs.createReadStream(info.inputFile);
    var outputStream = fs.createWriteStream(info.outputFile);
    var encrypt = crypto.createCipher(algorithm, info.password);
    inputStream.on('data', function(data) {
        var buf = new Buffer(encrypt.update(data), 'binary');
        outputStream.write(buf);
    }).on('end', function() {
        var buf = new Buffer(encrypt.final('binary'), 'binary');
        zlib.gzip(buf, {
            level: 9
        }, function(err, result) {
            if (err) throw err;
            outputStream.write(buf);
            outputStream.end();
            outputStream.on('close', function() {
                callback();
            })
        });
    });
}

function decryptFile(info, callback) {
    var inputStream = fs.createReadStream(info.inputFile);
    var outputStream = fs.createWriteStream(info.outputFile);
    var decrypt = crypto.createDecipher(algorithm, info.password)
    inputStream.on('data', function(data) {
        var buf = new Buffer(decrypt.update(data), 'binary');
        outputStream.write(buf);
    }).on('end', function() {
        var buf = new Buffer(decrypt.final('binary'), 'binary');
        zlib.gunzip(buf, function(err, result) {
            if (err) throw err;
            outputStream.write(buf);
            outputStream.end();
            outputStream.on('close', function() {
                callback();
            });
        });
    });
}
module.exports = {
    UploadFile: function(req, res) {
        mkdirp(rootPath + '/upload_files', function(err) {
            if (err) return res.serverError(ErrorWrap(err));
            var params = req.params.all();
            var maxFileSize = 15 * 1000 * 1000; //in MB
            req.file('uploadFile').upload({
                maxBytes: maxFileSize,
                dirname: rootPath + '/upload_files'
            }, function whenDone(err, uploadedFiles) {
                if (err) return res.serverError(ErrorWrap(err));
                if (uploadedFiles.length == 0) {
                    var err = new Error("FileUpload.UploadFile.Error");
                    err.pushError("No File Was Uploaded!");
                    return res.serverError(ErrorWrap(err));
                }
                if (!params.patientUID) {
                    fs.unlink(uploadedFiles[0].fd);
                    var err = new Error("FileUpload.UploadFile.Error");
                    err.pushError("Invalid Params!");
                    return res.serverError(ErrorWrap(err));
                }
                Services.Patient.DetailPatient({
                    UID: params.patientUID
                }).then(function(data) {
                    if (data.length > 0) {
                        var fileUID = UUIDService.Create();
                        encryptFile({
                            inputFile: uploadedFiles[0].fd,
                            outputFile: rootPath + '/upload_files/' + fileUID,
                            password: fileUID
                        }, function(err) {
                            fs.unlink(uploadedFiles[0].fd);
                            if (err) return res.serverError(ErrorWrap(err));
                            return sequelize.transaction().then(function(t) {
                                return FileUpload.create({
                                    UID: fileUID,
                                    UserAccountID: data[0].UserAccount.ID,
                                    FileName: decodeURIComponent(uploadedFiles[0].filename),
                                    FileLocation: 'upload_files/' + fileUID,
                                    FileType: !params.fileType ? null : params.fileType,
                                    FileExtension: uploadedFiles[0].filename.split('.')[1],
                                    Enable: 'Y'
                                }, {
                                    transaction: t
                                }).then(function(file) {
                                    if (params.apptUID) {
                                        return Appointment.find({
                                            where: {
                                                UID: params.apptUID
                                            }
                                        }).then(function(appt) {
                                            if (appt) {
                                                return RelAppointmentFileUpload.create({
                                                    FileUploadID: file.ID,
                                                    AppointmentID: appt.ID
                                                }, {
                                                    transaction: t
                                                }).then(function() {
                                                    t.commit();
                                                    return res.ok({
                                                        status: 'success'
                                                    })
                                                })
                                            } else {
                                                t.rollback();
                                                fs.unlink(rootPath + '/upload_files/' + fileUID);
                                                var err = new Error("FileUpload.UploadFile.Error");
                                                err.pushError("Appointment Not Valid!");
                                                return res.serverError(ErrorWrap(err));
                                            }
                                        }).catch(function(err) {
                                            t.rollback();
                                            fs.unlink(rootPath + '/upload_files/' + fileUID);
                                            return res.serverError(ErrorWrap(err));
                                        })
                                    } else {
                                        t.commit();
                                        return res.ok({
                                            status: 'success'
                                        })
                                    }
                                }).catch(function(err) {
                                    t.rollback();
                                    fs.unlink(rootPath + '/upload_files/' + fileUID);
                                    return res.serverError(ErrorWrap(err));
                                })
                            })
                        });
                    } else {
                        fs.unlink(uploadedFiles[0].fd);
                        var err = new Error("FileUpload.UploadFile.Error");
                        err.pushError("User Not Exist!");
                        return res.serverError(ErrorWrap(err));
                    }
                })
            })
        })
    },
    DownloadFile: function(req, res) {
        var params = req.params.all();
        if (!params.fileUID) {
            var err = new Error("FileUpload.DownloadFile.Error");
            err.pushError("Invalid Params");
            return res.serverError(ErrorWrap(err));
        }
        mkdirp(rootPath + '/temp', function(err) {
            if (err) return res.serverError(ErrorWrap(err));
            FileUpload.find({
                where: {
                    UID: params.fileUID
                }
            }).then(function(file) {
                if (file) {
                    fs.access(rootPath + '/' + file.FileLocation, function(err) {
                        if (err) return res.serverError(ErrorWrap(err));
                        decryptFile({
                            inputFile: rootPath + '/' + file.FileLocation,
                            outputFile: rootPath + '/temp/' + file.FileName,
                            password: file.UID
                        }, function(err) {
                            if (err) return res.serverError(ErrorWrap(err));
                            res.download(rootPath + '/temp/' + file.FileName, function(err) {
                                if (err) res.serverError(ErrorWrap(err));
                                fs.unlink(rootPath + '/temp/' + file.FileName);
                            });
                        })
                    })
                } else {
                    var err = new Error("FileUpload.DownloadFile.Error");
                    err.pushError("File Is Not Exist!");
                    return res.serverError(ErrorWrap(err));
                }
            }).catch(function(err) {
                return res.serverError(ErrorWrap(err));
            })
        })
    }
}