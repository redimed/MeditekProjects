/**
 * Created by tannguyen on 5/19/16.
 */
var $q = require('q');
var dmUtils = require('./resDM/dmUtils');
dmLog = dmUtils.dmLog;
module.exports = {
    loadDMConfig: function(req) {
        var ctrReq = req.options.controller;
        var actReq = req.options.action;
        dmLog('controllerName from Request:', ctrReq);
        dmLog('actionName from Request:', actReq);
        for (var ctrKey in sails.config.resDM) {
            var ctrKeyConf = ctrKey.substring(0, ctrKey.length - 10).toLowerCase(); //10 ~ "Controller"

            if (ctrKeyConf == ctrReq) {
                dmLog("controllerName from Request have matched");
                for (var actKey in sails.config.resDM[ctrKey]) {
                    var actKeyConf = actKey.toLowerCase();
                    if (actKeyConf == actReq) {
                        dmLog("actionName from Request have matched");
                        return sails.config.resDM[ctrKey][actKey];
                    } else {
                        //dmLog("actionName from Request haven't matched");
                    }
                }
            } else {
                //dmLog("controllerName from Request haven't matched");
            }
        }
        return null;
    },

    sendDM: function(dmConfig, req, res) {
        var error = new Error("resDMService.Error");
        if (dmConfig.sendto == null)
            dmConfig.sendto = senderNull;
        return $q.all([dmConfig.payload(req, res), dmConfig.sendto(req, res)])
            .spread(function(payload, sendto) {
                dmLog('payload:', payload);
                dmLog('sendto:', sendto);
                if (dmConfig.method === dmUtils.method.broadcast) {
                    if (sendto) {
                        if (dmConfig.eventName) {
                            /*for( var i = 0 ;i< sendto.length; i++) {
                                sails.sockets.broadcast(sendto[i], dmConfig.eventName, payload);
                            }*/
                            sails.sockets.broadcast(sendto, dmConfig.eventName, payload);
                        } else {
                            error.pushError('broadcast.eventName.null');
                        }
                    } else {
                        error.pushError('broadcast.sendto.empty');
                    }
                } else if (dmConfig.method === dmUtils.method.blast) {
                    if (dmConfig.eventName) {
                        sails.sockets.blast(dmConfig.eventName, payload);
                    } else {
                        error.pushError("blast.eventName.null");
                    }
                } else if (dmConfig.method === dmUtils.method.nc) {
                    console.log("||||||||||||||||||||||||||||||||||||||||NC:");
                    for (var i = 0; i < payload.length; i++) {
                        var item = payload[i];
                        switch (item.Queue) {
                            case dmUtils.ncQueue.EMAIL:
                                NcService.pushEmail(item);
                                break;
                            case dmUtils.ncQueue.SMS:
                                NcService.pushSMS(item);
                                break;
                            case dmUtils.ncQueue.NOTIFY:
                                NcService.pushNotify(item)
                                break;
                        }
                    }
                } else {
                    error.pushError('dmMethod.invalid');
                }
                if (error.getErrors().length > 0) {
                    throw error;
                } else {
                    return { status: 'success' };
                }
            })
            .fail(function(err) {
                throw err;
            })
    }
}
