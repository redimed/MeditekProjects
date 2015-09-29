module.exports = {
    /*
    RequestAppointment: save information patient, create new appointment, create telehealth appointment,
    link telehealth appointment with appointment created, send email and notification for admin system
    input: information patient
    outout: -success: request apppointment success
            -failed: request appointment error
    */
    RequestAppointment: function(req, res) {
        // var data = CheckDataService(req);
        // if (data === false) {
        //     res.badRequest('Data failed');
        // } else {
        //     //
        // }
        Appointment.create({
            FromTime: new Date(),
            SiteID: 111,
            PatientID: 111,
            DoctorID: 111,
            UID: '111111'
        })
        .then(function(scc){
            console.log(scc);
        });
    }
};
