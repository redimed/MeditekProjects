import IP from '../config/ip'

var Services = {
    EFormTemplateSave: function(data){
        var p = new Promise(function(resolve, reject){
            $.ajax({
                type: 'POST',
                url: IP.EFormServer+'/eformtemplate/v1/save',
                data: data,
                success: resolve
            })
        })
        return p
    },
    EFormTemplateDetail: function(data){
        var p = new Promise(function(resolve, reject){
            $.ajax({
                type: 'POST',
                data: data,
                url: IP.EFormServer+'/eformtemplate/detail',
                success: resolve
            })
        })
        return p
    },
    EFormPreData: function(data){
        var p = new Promise(function(resolve, reject){
            $.ajax({
                type: 'GET',
                url: IP.EFormServer+'/api/appointment-wa-detail/'+data.UID+'/'+data.UserUID,
                success: resolve
            })
        })
        return p
    },
    EFormCheckData: function(data){
        var p = new Promise(function(resolve, reject){
            $.ajax({
                type: 'POST',
                data: data,
                headers: window.userAccess||{},
                url: IP.EFormServer+'/eform/checkDetail',
                success: resolve
            })
        })
        return p
    },
    EFormSave: function(data){
        var p = new Promise(function(resolve, reject){
            $.ajax({
                type: 'POST',
                data: data,
                headers: window.userAccess||{},
                url: IP.EFormServer+'/eform/save',
                success: resolve
            })
        })
        return p
    },
    EFormCreate: function(data){
        var p = new Promise(function(resolve, reject){
            $.ajax({
                type: 'POST',
                data: data,
                headers: window.userAccess||{},
                url: IP.EFormServer+'/eform/v1/save',
                success: resolve
            })
        })
        return p
    },
    EFormUpdate: function(data){
        var p = new Promise(function(resolve, reject){
            $.ajax({
                type: 'POST',
                data: data,
                headers: window.userAccess||{},
                url: IP.EFormServer+'/eform/update',
                success: resolve
            })
        })
        return p
    },
    uploadFile: function(formdata, meta){
        var p = new Promise(function(resolve, reject){
            $.ajax({
                url: IP.ApiServerUrl +'/api/uploadFileWithoutLogin',
                // url: IP.EFormServer +'/eform/test-upload-sign',
                xhrFields: {
                    withCredentials: true
                },
                headers:{
                    //Authorization: ('Bearer ' + $cookies.get("token")),
                    systemtype: 'WEB',
                    userUID: '2d0626f3-e741-11e5-8fab-0050569f3a15',
                    fileType: 'MedicalImage'
                },
                type: "POST",
                data: formdata,
                processData: false,
                contentType: false,
            }).done(function(response){
                resolve({response: response, meta: meta})
            }).fail(function(error) {
                reject(error);
            })
        })
        return p
    },
    EFormUploadSignImage: function (blob, meta) {
        // var formdata = data.formdata;
        var formdata = new FormData();
        var fileName = 'DEFAULTSIGN.png';
        var contentType = 'MedicalImage';
        formdata.append('userUID', '2d0626f3-e741-11e5-8fab-0050569f3a15')
        formdata.append('fileType', contentType);            
        formdata.append('uploadFile', blob, fileName);

        return this.uploadFile(formdata, meta)
    },

    EFormUploadDrawing: function(blob, meta){
        var formdata = new FormData();
        var contentType = 'MedicalImage';
        var fileName = "DEFAULTDRAWING.png";
        formdata.append('userUID', '2d0626f3-e741-11e5-8fab-0050569f3a15');
        formdata.append('fileType', contentType);
        formdata.append('uploadFile', blob, fileName);

        return this.uploadFile(formdata, meta)
    },
    EFormDownloadImage: function(fileUID){
        var p = new Promise(function(resolve, reject){
        var xhr = new XMLHttpRequest();
            xhr.responseType = 'arraybuffer';
            xhr.open('GET', IP.ApiServerUrl +'/api/downloadFileWithoutLogin/'+ fileUID, true);
            xhr.onload = function(e) {
                    var blob = new Blob([this.response],{type: 'image/png'});
                    var objectUrl = URL.createObjectURL(blob);
                    // var img = new Image;
                    // img.src = objectUrl;
                    resolve(objectUrl)
            };
            xhr.send();
        })
        return p
    },
    EFormDownloadSignImage: function(fileUID){
        return this.EFormDownloadImage(fileUID)
    }
}

export default Services