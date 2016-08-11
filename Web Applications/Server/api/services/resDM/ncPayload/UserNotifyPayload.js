var $q = require('q');
var dmUtils = require('../dmUtils.js');
module.exports = function(req, res) {
    var error = new Error("UserNotifyPayload.Error");
    var q = $q.defer();
    var dmObj = req.dmObj;

    console.log(" ||||||||||||| dmObj", dmObj);

    var payloads = [];
    var Note = '';
    var Queue = '';
    var EventName = '';
    var ReceiverType = '';

    if (dmObj.MsgKind === 'Global') {
        Note = 'NotifyMessage';
        Queue = 'GLOBALNOTIFY';
        EventName = 'globalnotify';
    } else if (dmObj.MsgKind === 'Private') {
        Note = 'NotifyMessage';
        Queue = 'NOTIFY';
        EventName = 'privatenotify';
        ReceiverType = 'USER_ACCOUNT';
    } else if (dmObj.MsgKind === 'ToDo') {
        Note = 'TodoMessage';
        Queue = 'NOTIFY';
        EventName = 'privatenotify';
        ReceiverType = 'USER_ACCOUNT';
    } else if (dmObj.MsgKind === 'Request') {
        Note = 'RequestMessage';
        Queue = 'NOTIFY';
        EventName = 'privatenotify';
        ReceiverType = 'USER_ACCOUNT';
    };

    if (dmObj) {
        for (var i = 0; i < dmObj.lsUser.length; i++) {
            if (dmObj.MsgKind === 'Global') {
                ReceiverType = dmObj.lsUser[i];
            };

            var payload = {
                Subject: dmObj.Subject,
                Receiver: dmObj.lsUser[i],
                ReceiverType: ReceiverType,
                ReceiverUID: dmObj.MsgKind != 'Global' ? dmObj.lsUser[i] : null,
                Queue: Queue,
                Read: 'N',
                Enable: 'Y',
                MsgContentType: 'JSON',
                MsgContent: {
                    Display: {
                        FirstName: '',
                        LastName: '',
                        Subject: dmObj.UserName,
                        Action: dmObj.MsgContent
                    },
                    Command: {
                        Note: Note,
                        Url_State: '',
                        Url_Redirect: '',
                    }
                },
                MsgKind: dmObj.MsgKind,
                MsgState: dmObj.MsgState ? dmObj.MsgState : null,
                FirstDelay: dmObj.FirstDelay,
                SenderUID: dmObj.UID,
                EventName: EventName,
                EndTime: dmObj.EndTime ? dmObj.EndTime : null,
                SendFromServer: '3016',
            };
            payloads.push(payload);
        };

        if (payloads.length > 0) {
            return payloads;
        } else {
            error.pushError("User.Null");
            throw error;
        };
    };
}
