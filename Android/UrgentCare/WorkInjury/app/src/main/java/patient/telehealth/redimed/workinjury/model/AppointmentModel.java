package patient.telehealth.redimed.workinjury.model;

/**
 * Created by phanq on 04/15/2016.
 */
public class AppointmentModel {
    private String Type;
    private String Description;
    private String PatientAppointment;
    private String AppointmentData;
    private String RequestDate;
    private String FileUploads;

    public String getRequestDate() {
        return RequestDate;
    }

    public void setRequestDate(String requestDate) {
        RequestDate = requestDate;
    }

    public String getFileUploads() {
        return FileUploads;
    }

    public void setFileUploads(String fileUploads) {
        FileUploads = fileUploads;
    }

    public String getType() {
        return Type;
    }

    public void setType(String type) {
        Type = type;
    }

    public String getDescription() {
        return Description;
    }

    public void setDescription(String description) {
        Description = description;
    }

    public String getPatientAppointment() {
        return PatientAppointment;
    }

    public void setPatientAppointment(String patientAppointment) {
        PatientAppointment = patientAppointment;
    }

    public String getAppointmentData() {
        return AppointmentData;
    }

    public void setAppointmentData(String appointmentData) {
        AppointmentData = appointmentData;
    }
}
