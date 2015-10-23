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

//Begin module UserAccount
var userAccountPolicies = require('./policies/userAccountPolicies');
_.extend(policies, userAccountPolicies);
//End module UserAccount

//Begin module Test
var testPolicies = require('./policies/testPolicies');
_.extend(policies, testPolicies);
//End module Test

//Begin module Authorization
var authorizationPolicies = require('./policies/authorizationPolicies');
_.extend(policies, authorizationPolicies);
//End module Authorization

//Begin module Appointment
var appointmentPolicies = require('./policies/AppointmentPolicies');
_.extend(policies, appointmentPolicies);
//End module Appointment
module.exports.policies = policies;
//
