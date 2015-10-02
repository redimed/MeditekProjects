/*
check data request
input: request from client
output: false: if data miss or parse failed
        data: if exist data and parse success
*/

/**
 * Kiem tra xem bien hop le hay khong
 */
function checkData(value)
{
    return (value!==undefined && value!==null && value!=='' && value!={});
}

/**
 * Kiem tra danh sach data truyen vao hop le hay kkhong
 */
function checkListData()
{
    for (var i = 0; i < arguments.length; i++) 
    {
        if(arguments[i]===undefined || arguments[i]===null || arguments[i]==='' ||arguments[i]=={})
        {
            console.log(">>>>>>>> Vi tri data truyen den bi loi:",i);
            return false;
        }
    }
    return true;
}

module.exports = {
    CheckPostRequest:function(request) {
        var data;
        if (!_.isUndefined(request) &&
            !_.isUndefined(request.body) &&
            !_.isUndefined(request.body.data)) {
            if (!_.isObject(request.body.data)) {
                try {
                    data = JSON.parse(request.body.data);
                } catch (err) {
                    console.log(err);
                    return false;
                }
            }
            return data;
        } else {
            return false;
        }
    },

    //define regex pattern
    regexPattern:{
        //emailPattern example :
        //  mysite@ourearth.com
        //  my.ownsite@ourearth.org
        //  mysite@you.me.net
        //reference from: http://www.w3resource.com/javascript/form/email-validation.php
        email:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,

        //fullPhonePattern example:
        //  (+351) 282 43 50 50
        //  90191919908
        //  555-8909
        //  001 6867684
        //  001 6867684x1
        //  1 (234) 567-8901
        //  1-234-567-8901 x1234
        //  1-234-567-8901 ext1234
        //  1-234 567.89/01 ext.1234
        //  1(234)5678901x1234
        //  (123)8575973
        //  (0055)(123)8575973
        //reference from: http://stackoverflow.com/questions/14639973/javascript-regex-what-to-use-to-validate-a-phone-number
        
        //international phone number
        fullPhoneNumber:/^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i,

        //autralian phone number
        auPhoneNumber:/^(\+61|0061|0)?4[0-9]{8}$/,

        //except (,),whitespace,- in phone number
        phoneExceptChars:/[\(\)\s\-]/g,
    },
    
    checkData:checkData,

    checkListData:checkListData,

    const:{
        systemType:{
            ios:'IOS',
            website:'WEB',
            android:'ARD'
        }
    }
    
}