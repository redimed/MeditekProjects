/**
 * Created by tannguyen on 30/06/2016.
 */

var eformPolicies = {};
var myconf = require('../myconf').myconf;
var noEFormAuth = null;
if(process.argv.indexOf('--noEFormAuth') > -1)
{
    noEFormAuth = true;
} else {
    noEFormAuth = myconf.noEFormAuth;
}
if (!noEFormAuth) {
    console.log("|||||||||||||||||||||| REQUIRE EFORM AUTHENTICATION");
    eformPolicies = {
        'EForm/EFormController': {
            'PostUpdate': ['checkExternalToken', 'roleEformAutoSave'],
            'PostSaveInit': ['checkExternalToken'],
            'PostSaveStep': ['checkExternalToken'],
            'PostSave': ['checkExternalToken', 'roleEformAutoSave'],
            'PostDetail': ['checkExternalToken'],
            'PostHistoryDetail': ['checkExternalToken'],
            'PostCheckDetail': ['checkExternalToken']
        },
    }
} else {
    console.log("|||||||||||||||||||||| NO EFORM AUTHENTICATION");
    eformPolicies = {
        'EForm/EFormController': {
            'PostUpdate': ['roleEformAutoSave'],
            'PostSave': ['roleEformAutoSave']
        },
    }

}
module.exports = eformPolicies;