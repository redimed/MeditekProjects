/**
 * Created by tannguyen on 5/19/16.
 */
var config = {};
var _ = require('lodash');

//Begin Module User Account
var userAccountResDM = require('./resDM/userAccountResDM');
_.extend(config, userAccountResDM);
//End Module User Account

module.exports.resDM = config;