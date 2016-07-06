/**
 * Created by tannguyen on 30/06/2016.
 */

var eformPolicies = {};
if (process.argv.indexOf('--noEFormAuth') >=0) {
    console.log("|||||||||||||||||||||| NO EFORM AUTHENTICATION");
    eformPolicies = {
        'EForm/EFormController': {
            'PostUpdate': true
        }
    }
}
module.exports = eformPolicies;