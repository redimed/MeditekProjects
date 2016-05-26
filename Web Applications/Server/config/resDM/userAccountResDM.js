/**
 * Created by tannguyen on 5/19/16.
 */
var userAccountTestPayload = require('../../api/services/resDM/payload/TestPayload');
var userAccountTestSendto = require('../../api/services/resDM/sendto/TestSendto');
var dmUtils = require('../../api/services/resDM/dmUtils');
module.exports = {
    'UserAccount/v0_1/UserAccountController': {
        'Test': {
            eventName: 'testDM',
            method: dmUtils.method.broadcast, //blast, broadcast
            payload: userAccountTestPayload,
            sendto: userAccountTestSendto
        }
    }
}