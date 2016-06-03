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
    '*': 'isAuthenticated', //bật lên khi ở chế độ develop không cần login phân quyền
    // '*': true, //bật lên khi ở chế độ develop không cần login phân quyền
    // '*': "hasToken", //bật lên khi relase, hầu hết tất cả api đều phải có token
};

//Begin module UserAccount
var userAccountPolicies = require('./policies/userAccountPolicies');
_.extend(policies, userAccountPolicies);
//End module UserAccount

//Begin module Authorization
var authorizationPolicies = require('./policies/authorizationPolicies');
_.extend(policies, authorizationPolicies);
//End module Authorization

//Begin module Appointment
var appointmentPolicies = require('./policies/AppointmentPolicies');
_.extend(policies, appointmentPolicies);
//End module Appointment

//Begin module FileUpload
var fileUploadPolicies = require('./policies/fileUploadPolicies');
_.extend(policies, fileUploadPolicies);
//End module FileUpload

//Begin module Common
var commonPolicies = require('./policies/commonPolicies');
_.extend(policies, commonPolicies);
//End module Common
//Begin module Register
var registerPolicies = require('./policies/RegisterPolicies');
_.extend(policies, registerPolicies);
//End module Register
//Begin module Doctor
var doctorPolicies = require('./policies/doctorPolicies');
_.extend(policies, doctorPolicies);
// End module Doctor
//Begin module Patient
var patientPolicies = require('./policies/patientPolicies');
_.extend(policies, patientPolicies);
// End module Patient
//Begin module Consultation
var consultationPolicies = require('./policies/consultationPolicies');
_.extend(policies, consultationPolicies);
//End module Consultation
//Begin module Company
var companyPolicies = require('./policies/companyPolicies');
_.extend(policies,companyPolicies);
//End module Company
module.exports.policies = policies;
