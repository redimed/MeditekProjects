module.exports = {
    Create: function(id) {
        var Hashids = require('hashids');
        var hashids = new Hashids('6d181e30-4bf5-48ad-bc37-fc8c9375fdaf', 0, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        return hashids.encode(id);
    }
};
