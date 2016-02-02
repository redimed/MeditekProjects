/*
check data request
input: request from client
output: false: if data miss or parse failed
        data: if exist data and parse success
*/
/**
 * Kiem tra xem bien hop le hay khong 
 * 
 */
function checkData(value) {
    var result = true;
    if (value === undefined || value === null || value === '') {
        result = false;
    } else if (_.isObject(value) && _.isEmpty(value)) {
        result = false;
    }
    return result;
}
/**
 * Kiem tra danh sach data truyen vao hop le hay kkhong
 */
function checkListData() {
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
}

function exlog() {
    console.log("\n\nBEGIN REDIMED LOG-------------------------------");
    for (var i = 0; i < arguments.length; i++) {
        console.log(arguments[i]);
    }
    console.log("END REDIMED LOG---------------------------------\n\n");
}


module.exports={
    regexPattern:{
        email:  /^\w+([a-zA-Z0-9\.-]?\w+)*@\w+([a-z][\.-]?\w+)*([a-z]\.\w{2,4})+$/,
        fullPhoneNumber: /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i,
    },

	checkData:checkData,

	checkListData:checkListData,

	exlog:exlog,

	const:{

		queue:{
			'SMS':'SMS',
			'EMAIL':'EMAIL',
			'NOTIFY':'NOTIFY',
			'SERVERMSG':'SERVERMSG',
			'FEEDBACK':'FEEDBACK'
		},

        jobStatus:{
            'NEW':'NEW',
            'READY':'READY',
            'DELAY':'DELAY',
            'HANDLED':'HANDLED',
            'BURIED':'BURIED'
        }
	},

	/**
     * rationalizeObject:
     * Hợp lệ hóa source object bằng checker object
     * Nếu source có attributes mà checker không có thì xóa attributes đó của source
     */
	rationalizeObject:function(source, checker)
	{
		if (_.isObject(source)) {
            if (_.isObject(checker) && !_.isEmpty(checker)) {
                for (var key in source) {
                    if (!checker.hasOwnProperty(key)) {
                        delete source[key];
                    }
                }
            }
        } else {
            source = {};
        }
        return source;
	},

	validateRequireFields:function(source,checker)
	{
		var listMissingFields=[];
		if(!_.isObject(source) || _.isEmpty(source))
			source={};

		if(_.isObject(checker) && !_.isEmpty(checker))
		{
			for(var key in checker){
				if(!source.hasOwnProperty(key))
				{
					listMissingFields.push(key);
				}
                else
                {
                    if(!checkData(source[key]))
                    {
                        listMissingFields.push(key);
                    }
                }
			}
		}
		
		return listMissingFields;
	},

    isValidEmail: function(Email) {
        if (!checkData(Email)) return false;
        var emailPattern = new RegExp(this.regexPattern.email);
        if (emailPattern.test(Email)) {
            return true;
        } else {
            return false;
        }
    },

    isValidPhoneNumber:function(PhoneNumber)
    {
        if(!checkData(PhoneNumber)) return false;
        var phoneNumberPattern=new RegExp(this.regexPattern.fullPhoneNumber);
        if(phoneNumberPattern.test(PhoneNumber))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

}