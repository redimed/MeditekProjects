module.exports = function(objectRelAppointmentFileUpload) {
    return objectRelAppointmentFileUpload.appointmentCreated.addFileUploads(objectRelAppointmentFileUpload.IDFileUploads, {
        transaction: objectRelAppointmentFileUpload.t
    });
};
