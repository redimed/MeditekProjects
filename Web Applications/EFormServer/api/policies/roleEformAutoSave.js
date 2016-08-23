/**
 * Created by khank 
 */
var o = require("../services/HelperService");
var ErrorWrap = require("../services/ErrorWrap");


module.exports = function(req, res, next){
	var error = new Error('Policies.roleEformAutoSave.Error');
	// GET IN BODY 
    var userUID = req.body && req.body.userUID ? req.body.userUID : null
    // GET IN HEADERS
    if(!userUID) {
    	var userUID = req.headers.userUID ? req.headers.userUID : null
    }

    if(!userUID) {
    	error.pushError("MissingParameter.UserUID");
        return res.badRequest(ErrorWrap(error));
 	}
    Services.UserRole.GetRolesOfUser({UID: userUID}).then(function(data){
        // DO SOMETHING HERE 
        if(data.roles && data.roles.length > 0) { // HAS ROLE  
            var roleArr = [] 
            // PARSE TO NEW ARRAY TO USE HELPER FUNCTION
            for (var i = data.roles.length - 1; i >= 0; i--) {
                roleArr.push( data.roles[i].Role )
            }

            var role_obj =  o.GetRole(roleArr) 
            // console.log(role_obj)
            if(role_obj.isAdmin || role_obj.isInternalPractitioner){
                return next() // PASSED
            }

            /*
                role_obj = {
                    isAdmin: false,
                    isAssistant: false,
                    isInternalPractitioner: false,
                    isExternalPractitioner: false,
                    isPatient: false,
                    isOrganization:false
                };
            */
        } else {
        	error.pushError("UserHasNoRole");
        	return res.badRequest(ErrorWrap(error));
        }
    }, function(error){
    	error.pushError("Services.UserRole.GetRolesOfUser");
        return res.badRequest(ErrorWrap(error));
    })
   
}