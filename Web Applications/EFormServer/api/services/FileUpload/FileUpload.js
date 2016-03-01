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
            return callback(err,undefined,undefined);
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
                    var output = info.output + (info.output.substr(info.output.length-1) == '/'?'':'/') + file.UID + '_' + Date.now() + '.' + file.FileExtension;
                    HelperService.DecryptFile({
                        inputFile: input,
                        outputFile: output,
                        password: file.UID
                    }, function(err) {
                        if (err) return callback(err,undefined,undefined);
                        if (_.contains(HelperService.const.imageExt, file.FileExtension) && info.size) {
                            gm(output).size(function(err, size) {
                                if (err) return callback(err,undefined,undefined);
                                gm(output).resizeExact(info.size, Math.round((size.height / size.width) * info.size)).write(output, function(err) {
                                    if (err) return callback(err,undefined,undefined);
                                    return callback(undefined,output,file.FileName);
                                })
                            })
                        } else {
                            return callback(undefined,output,file.FileName);
                        }
                    })
                } else {
                    var err = new Error("FileUpload.DownloadFile.Error");
                    err.pushError("File Not Exist!");
                    return callback(err,undefined,undefined);
                }
            }).catch(function(err) {
                return callback(err,undefined,undefined);
            })
        })
    },

    DisableAllFile: function(data) {
        if(data.FileType == null || data.FileType == "" || data.FileType.length == 0) {
            var err = new Error("DisableAllFile.Error");
            err.pushError("FileType.Null");
            throw err;
        }
        else {
            var whereClause = [];
            for(var i = 0; i < data.FileType.length; i++) {
                whereClause.push({FileType : data.FileType[i]});
            }
            return sequelize.transaction()
            .then(function(t) {
                return FileUpload.update({
                    Enable : data.Enable
                },{
                    where:{
                        $and:{
                            UserAccountID : data.UserAccountID,
                            $or: whereClause
                        }
                        
                    },
                    transaction: t
                })
                .then(function(result){
                    t.commit();
                    return result;
                },function(err){
                    t.rollback();
                    throw err;
                })
            },function(err){
                throw err;
            });
        }
    }
}