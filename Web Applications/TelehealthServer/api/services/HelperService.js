var meditek_library = require("meditek_library");
var helper = meditek_library.HelperService;
helper.toJson = function(str) {
    var obj;
    try {
        obj = JSON.parse(str);
    } catch (e) {
        obj = str;
    }
    var key, keys = Object.keys(obj);
    var n = keys.length;
    var newobj = {}
    while (n--) {
        key = keys[n];
        newobj[key.toLowerCase()] = obj[key];
    }
    return newobj;
}
module.exports = helper;