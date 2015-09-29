/*
check data request
input: request from client
output: false: if data miss or parse failed
        data: if exist data and parse success
*/
module.exports = function(request) {
    var data;
    if (!_.isUndefined(request) &&
        !_.isUndefined(request.body) &&
        !_.isUndefined(request.body.data)) {
        if (!_.isObject(request.body.data)) {
            try {
                data = JSON.parse(request.body.data);
            } catch (err) {
                console.log(err);
                return false;
            }
        }
        return data;
    } else {
        return false;
    }
};
