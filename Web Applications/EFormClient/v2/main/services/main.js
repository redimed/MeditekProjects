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

    EFormUploadSignImage: function (data) {
        var formdata = data.formdata;
        var p = new Promise(function(resolve, reject){
             $.ajax({
                url: IP.ApiServerUrl +'/api/uploadFileWithoutLogin',
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
            }).done(function(respond){
                resolve(respond)
            }).fail(function(error) {
                reject(error);
            })
        })
        return p
    }
}

export default Services