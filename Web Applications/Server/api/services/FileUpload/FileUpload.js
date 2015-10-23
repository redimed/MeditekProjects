var $q = require('q');
var _ = require('lodash');
var gm = require('gm');
var mkdirp = require('mkdirp');
var rootPath = process.cwd();

module.exports = {
	 DownloadFile: function(info, callback){
        if(!info.output || !info.fileUID){
            var err = new Error("DownloadFile.Error");
            err.pushError("Invalid Params!");
            return callback(err,undefined);
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
                    var output = info.output + (info.output.substr(info.output.length-1) == '/'?'':'/') + file.FileName;
                    HelperService.DecryptFile({
                        inputFile: input,
                        outputFile: output,
                        password: file.UID
                    }, function(err) {
                        if (err) return callback(err,undefined);
                        if (_.contains(HelperService.const.imageExt, file.FileExtension) && info.size) {
                            gm(output).size(function(err, size) {
                                if (err) return callback(err,undefined);
                                gm(output).resizeExact(info.size, Math.round((size.height / size.width) * info.size)).write(output, function(err) {
                                    if (err) return callback(err,undefined);
                                    return callback(undefined,output);
                                })
                            })
                        } else {
                            return callback(undefined,output);
                        }
                    })
                } else {
                    var err = new Error("FileUpload.DownloadFile.Error");
                    err.pushError("File Not Exist!");
                    return callback(err,undefined);
                }
            }).catch(function(err) {
                return callback(err,undefined);
            })
        })
    }
}