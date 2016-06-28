module.exports = function() {
    var $q = require('q');
    var defer = $q.defer();
    Language.findAll({
            attributes: {
                exclude: ['CreateDate', 'CreatedBy', 'ModifiedDate', 'ModifiedBy']
            },
            raw: true
        })
        .then(function(listState) {
            defer.resolve(listState);
        }, function(err) {
            defer.reject({ error: err });
        });
        return defer.promise;
};
