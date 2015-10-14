var versions={};
var _ = require('lodash');

//Begin Module User Account 
var userAccountVersions = require('./userAccountVersions');
_.extend(versions, userAccountVersions);

module.exports=versions;