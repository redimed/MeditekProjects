module.exports = function(request) {
    if (HelperService.CheckExistData(request) &&
        HelperService.CheckExistData(request.options)) {
        var data = null;
        var IP = request.headers['X-Client-IP'] ||
            request.headers['X-Forwarded-For'] ||
            request.headers['X-Real-IP'] ||
            request.headers['X-Cluster-Client-IP'] ||
            request.headers['X-Forwared'] ||
            request.headers['X-Forwared-For'] ||
            request.headers['X-Forwared'] ||
            request.connection.remoteAddress ||
            request.socket.remoteAddress ||
            request.connection.socket.remoteAddress;
        if (request.method === 'POST' &&
            HelperService.CheckExistData(request.body)) {
            data = request.body.data;
        } else if (request.method === 'GET') {
            data = request.allParams();
        }
        sails.log.info('-------------Start Logging-------------');
        sails.log.info('Receive request from client:', new Date());
        sails.log.info('IP address client request:', IP);
        sails.log.info('API request:', request.url);
        sails.log.info('Method request:', request.method);
        sails.log.info('Action request:', request.options.action);
        sails.log.info('Data request:', data);
        sails.log.info('-------------End Logging-------------');
    }
};
