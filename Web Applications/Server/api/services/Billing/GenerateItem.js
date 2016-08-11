module.exports = {
    Create: function(data) {
        var result = {};
        if (!_.isEmpty(data) &&
            data.Type) {
            switch (data.Type) {
                case 'Medicare':
                    console.log('Medicare');
                    break;
                case 'Company':
                    console.log('Company');
                    break;
                case 'Private':
                    console.log('Private');
                    break;
                default:
                    sails.log.info('-----import item billing without type-----', data.Type);
                    break;
            }
        }
        return result;
    },
    Update: function(dataAdd, dataOrigin) {

    }
};
