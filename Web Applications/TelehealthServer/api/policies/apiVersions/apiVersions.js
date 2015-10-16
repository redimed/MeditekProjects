var versions={};
var _ = require('lodash');

//Begin Module User Account 
var telehealthVersions = require('./telehealthVersions');
_.extend(versions, telehealthVersions);

module.exports=versions;