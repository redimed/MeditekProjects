var versions={};
var _ = require('lodash');

//Begin Module User Account 
var userAccountVersions = require('./userAccountVersions');
_.extend(versions, userAccountVersions);

//Begin Module Authorization
var authorizationVersions = require('./authorizationVersions');
_.extend(versions, authorizationVersions);


module.exports=versions;