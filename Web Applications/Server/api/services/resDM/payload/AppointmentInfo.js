/**
 * Created by tannguyen on 5/30/16.
 */
module.exports = function (req, res) {
    var error = new Error ('AppointmentInfo.Error');
    var dmObj = req.dmObj;
    var whereClause = {
        Appointment: {}
    }
    if(dmObj.apptUID) {
        whereClause.Appointment.UID = dmObj.apptUID;
    }

    if(_.isEmpty(whereClause.Appointment)) {
        error.pushError('whereClause.null');
        throw error;
    }
    return Appointment.findOne({
        where: whereClause.Appointment
    })
    .then(function(result){
        if(result) {
            return result.dataValues;
        } else {
            error.pushError('query.notFound');
            throw error;
        }
    },function(err){
        throw err;
    })
}
