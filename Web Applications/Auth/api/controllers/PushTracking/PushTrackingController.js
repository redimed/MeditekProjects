/**
 * Created by tannguyen on 19/08/2016.
 */
module.exports = {
    pushTrack: function (req, res) {
        console.log(">>>>>>>>>>>>>>>>", req.body);
        Services.PushTracking.pushTrack(req.body)
        .then(function(data){
            if(data) {
                res.ok(data);
            } else {
                res.ok("postDataEmpty");
            }
        }, function(err){
            res.ok(ErrorWrap(err));
        })
    }
}