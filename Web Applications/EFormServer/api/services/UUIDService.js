var uuid = require('node-uuid');
/*
Create: create new string UID v4
input:
output: string UID v4
*/
var UUID = {
    Create: function() {
        return uuid.v4();
    }
};
module.exports = UUID;
