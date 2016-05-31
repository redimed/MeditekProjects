/**
 * Created by tannguyen on 5/30/16.
 */
module.exports = function (req, res) {
    var error = new Error ('DoctorRoomsFromAppointment.Error');
    var dmObj = req.dmObj;
    var whereClause = {
        Appointment: {}
    };
    if(dmObj.apptUID) {
        whereClause.Appointment.UID = dmObj.apptUID;
    }
    if(_.isEmpty(whereClause.Appointment))
    {
        error.pushError('whereClause.null');
        throw error;
    }
    return Appointment.findOne({
        where: whereClause.Appointment,
        attributes: ['ID', 'UID'],
        include: [
            {
                model: Doctor,
                attributes: ['ID', 'UID'],
                include: [
                    {
                        model: UserAccount,
                        attributes: ['ID', 'UID']
                    }

                ]
            }
        ]
    })
    .then(function (result) {
        var listUserUID = [];
        if(result && result.Doctors) {
            result.Doctors.forEach(function(doctor, index){
                if(doctor.UserAccount) {
                    listUserUID.push(doctor.UserAccount.UID);
                }
            })
            if (listUserUID.length >0) {
                return listUserUID;
            } else {
                error.pushError('listUser.null');
                throw error;
            }
        } else {
            error.pushError('query.notFound');
            throw error;
        }
    })
}