/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */

var _ = require('lodash');
var policies = {
    '*': 'hasToken',//bật lên khi ở chế độ develop không cần login phân quyền
    // '*': true, //bật lên khi ở chế độ develop không cần login phân quyền
    // '*': "hasToken", //bật lên khi relase, hầu hết tất cả api đều phải có token
};

// Begin module Telehealth
var telehealthPolicies = require('./policies/TelehealthPolicies');
_.extend(policies, telehealthPolicies);
//End module Telehealth

//Begin module Socket
var socketPolicies = require('./policies/SocketPolicies');
_.extend(policies, socketPolicies);
// End module Socket

//Begin module Appointment
var appointmentPolicies = require('./policies/AppointmentPolicies');
_.extend(policies, appointmentPolicies);
//End module Appointment

//Begin module Doctor
var doctorPolicies = require('./policies/DoctorPolicies');
_.extend(policies, doctorPolicies);
//End module Doctor

//Begin module WorkInjury
var workInjuryPolicies = require('./policies/WorkInjuryPolicies');
_.extend(policies, workInjuryPolicies);
//End module WorkInjury

module.exports.policies = policies;
//
