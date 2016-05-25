/**
 * Created by tannguyen on 5/20/16.
 */
module.exports = {
    dmLog: function () {
        var resDMSeparate = '||||||ResDM||||||:';
        var args = Array.from(arguments);
        args.unshift(resDMSeparate);
        if(console) {
            console.log.apply(console, args);
        }
    },
    method: {
        blast: 'blast',
        broadcast: 'broadcast'
    }
}