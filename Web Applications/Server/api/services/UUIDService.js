var uuid = require('node-uuid');

var UUID = {
    Create: function() {
        return uuid.v4();
    }
};
module.exports = UUID;
