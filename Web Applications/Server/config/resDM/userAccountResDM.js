/**
 * Created by tannguyen on 5/19/16.
 */
var userAccountTestPayload = require('../../api/services/resDM/payload/TestPayload');
var userAccountTestSendto = require('../../api/services/resDM/sendto/TestSendto');
var doctorRoomsFromAppointmentSendto = require('../../api/services/resDM/sendto/DoctorRoomsFromAppointment');
var userByRolePayload = require('../../api/services/resDM/ncPayload/GetUserByRolePayload');
var appointmentInfoPayload = require('../../api/services/resDM/payload/AppointmentInfo');
var ncSendto = require('../../api/services/resDM/sendto/NCSendto');
var testPostNcPayload = require('../../api/services/resDM/ncPayload/TestPostNcPayload');
var nullPayLoad = require('../../api/services/resDM/payload/NullPayLoad');
var dmUtils = require('../../api/services/resDM/dmUtils');
module.exports = {
    'UserAccount/v0_1/UserAccountController': {
        'Test': {
            eventName: 'testDM',
            method: dmUtils.method.broadcast, //blast, broadcast
            payload: appointmentInfoPayload,
            sendto: doctorRoomsFromAppointmentSendto
        }
    },

    'Appointment/WAAppointmentController': {
        'UpdateRequestWAAppointmentCompany': {
            eventName: 'UpdateRequestWAAppointmentCompany_DM',
            method: dmUtils.method.broadcast,
            payload: appointmentInfoPayload,
            sendto: doctorRoomsFromAppointmentSendto
        }
    },

    'UserAccount/v0_1/UserAccountController': {
        'TestPost': {
            eventName: 'nc',
            method: dmUtils.method.nc, //blast, broadcast
            payload: testPostNcPayload,
            sendto: ncSendto
        }
    },

    'Appointment/WAAppointmentController': {
        'LinkAppointmentPatient': {
            eventName: 'nc',
            method: dmUtils.method.nc, //blast, broadcast, nc
            payload: userByRolePayload,
            sendto: ncSendto
        }
    }
}
