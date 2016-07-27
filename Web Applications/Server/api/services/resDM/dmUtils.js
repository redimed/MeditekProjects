/**
 * Created by tannguyen on 5/20/16.
 */
module.exports = {
    dmLog: function() {
        var resDMSeparate = '||||||ResDM||||||:';
        var args = Array.prototype.slice.call(arguments);
        args.unshift(resDMSeparate);
        if (console) {
            console.log.apply(console, args);
        }
    },
    method: {
        blast: 'blast',
        broadcast: 'broadcast',
        nc: 'nc'
    },
    currentServer: '3006', //3005, 3006, 3009
    ncSenderType: {
        USER_ACCOUNT: 'USER_ACCOUNT',
        DOCTOR: 'DOCTOR',
        ADMIN: 'ADMIN',
        PATIENT: 'PATIENT',
        SERVER: 'SERVER'
    },
    ncQueue: {
        EMAIL: 'EMAIL',
        SMS: 'SMS',
        NOTIFY: 'NOTIFY',
        GLOBALNOTIFY: 'GLOBALNOTIFY'
    }
}
