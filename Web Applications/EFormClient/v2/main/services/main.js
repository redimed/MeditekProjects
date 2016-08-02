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
                url: IP.EFormServer+'/seform/save',
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
    }
}

export default Services