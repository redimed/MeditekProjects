//OVERIDE ERROR
Error.prototype.pushErrors = function(errors) {
    this.errors = errors;
}
Error.prototype.pushError = function(err) {
    if (this.errors) {
        this.errors.push(err);
    } else {
        this.errors = [];
        this.errors.push(err);
    }
}
Error.prototype.getErrors = function() {
    if (this.errors)
        return this.errors;
    else
        return [];
}


//BEGIN CONFIG ULOAD URL
var _apiUpload = "/api/uploadFile";
var _uploadURL = _fileBaseURL + _apiUpload;
//END CONFIG UPLOAD URL



var o = {

    const: {
        restBaseUrl: _restBaseURL,

        fileBaseUrl: _fileBaseURL,

        uploadFileUrl: _uploadURL,

        authBaseUrl:_authBaseURL,
        
        telehealthBaseURL:_telehealthBaseURL,

        configStateBlank:_configStateBlank,

        eFormBaseUrl: _eFormBaseURL,

        ncBaseUrl:_ncBaseURL,
    },

    checkData: function(value) {
        var result = true;
        if (value === undefined || value === null || value === '') {
            result = false;
        } else if (_.isObject(value) && _.isEmpty(value)) {
            result = false;
        }
        return result;
    },
    checkListData: function() {
        var result = true;
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i] === undefined || arguments[i] === null || arguments[i] === '') {
                result = false;
            } else if (_.isObject(arguments[i]) && _.isEmpty(arguments[i])) {
                result = false;
            }
            if (result === false) {
                console.log(">>>>>>>> Vi tri data truyen den bi loi:", i);
                break;
            }
        }
        return result;
    },
    loadingPage: function(value) {
        if (value === true) {
            angular.element('.loading-page').css("display", "block");
        } else {
            angular.element('.loading-page').css("display", "none");
        };
    },
}
