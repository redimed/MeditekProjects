/**
 * Created by tannguyen on 5/19/16.
 */
var userAccountTestPayload = require('../../api/services/resDM/payload/TestPayload');
var userAccountTestSendto = require('../../api/services/resDM/sendto/TestSendto');

var doctorRoomsFromAppointmentSendto = require('../../api/services/resDM/sendto/DoctorRoomsFromAppointment');
var appointmentInfoPayload = require('../../api/services/resDM/payload/AppointmentInfo');

var testPostNcPayload = require('../../api/services/resDM/ncPayload/TestPostNcPayload');
var nullPayLoad = require('../../api/services/resDM/payload/NullPayLoad');

var UserNotify = require('../../api/services/resDM/ncPayload/UserNotifyPayload');
var getDoctorInAppt = require('../../api/services/resDM/ncPayload/GetDoctorAppt');
var userByRolePayload = require('../../api/services/resDM/ncPayload/GetUserByRolePayload');
var ncSendto = require('../../api/services/resDM/sendto/NCSendto');
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
        },
        'LinkAppointmentPatient': {
            eventName: 'nc',
            method: dmUtils.method.nc,
            payload: userByRolePayload,
            sendto: ncSendto
        },
        'LinkAppointmentPatient': {
            eventName: 'nc',
            method: dmUtils.method.nc,
            payload: getDoctorInAppt,
            sendto: ncSendto
        },
        'RequestWAAppointmentPatientNew': {
            eventName: 'nc',
            method: dmUtils.method.nc,
            payload: userByRolePayload,
            sendto: ncSendto
        },
        'RequestWAAppointment': {
            eventName: 'nc',
            method: dmUtils.method.nc,
            payload: userByRolePayload,
            sendto: ncSendto
        },
        'RequestWAAppointmentPatient': {
            eventName: 'nc',
            method: dmUtils.method.nc,
            payload: userByRolePayload,
            sendto: ncSendto
        },
        'RequestWAAppointmentPatientOnlineBooking': {
            eventName: 'nc',
            method: dmUtils.method.nc,
            payload: userByRolePayload,
            sendto: ncSendto
        },
        'RequestAppointmentCompany': {
            eventName: 'nc',
            method: dmUtils.method.nc,
            payload: userByRolePayload,
            sendto: ncSendto
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

    'Notification/NotificationController': {
        'CreatePrivateNotify': {
            eventName: 'nc',
            method: dmUtils.method.nc,
            payload: UserNotify,
            sendto: ncSendto
        },
        'CreateGlobalNotify': {
            eventName: 'nc',
            method: dmUtils.method.nc,
            payload: UserNotify,
            sendto: ncSendto
        }
    },
}
