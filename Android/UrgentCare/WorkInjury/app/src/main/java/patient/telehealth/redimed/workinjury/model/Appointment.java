package patient.telehealth.redimed.workinjury.model;

import com.google.gson.annotations.SerializedName;

import java.util.ArrayList;


/**
 * Created by Lam on 10/14/2015.
 */
public class Appointment {

    @SerializedName("UID")
    private String UID;

    @SerializedName("FromTime")
    private String FromTime;

    @SerializedName("ToTime")
    private String ToTime;

    @SerializedName("RequestDate")
    private String RequestDate;

    @SerializedName("CreatedDate")
    private String CreatedDate;

    @SerializedName("ApprovalDate")
    private String ApprovalDate;

    @SerializedName("Status")
    private String Status;

    @SerializedName("Type")
    private String Type;

    @SerializedName("Code")
    private String Code;

    @SerializedName("Doctors")
    private Doctor[] Doctors;

    @SerializedName("Patients")
    private Patient[] Patients;

    @SerializedName("FileUploads")
    private FileUpload[] FileUploads;

    @SerializedName("AppointmentData")
    private ArrayList<AppointmentData> AppointmentDatas;

    @SerializedName("PatientAppointment")
    private PatientAppointment PatientAppointment;

    @SerializedName("TelehealthAppointment")
    private TelehealthAppointment TelehealthAppointment;

    public String getUID() {
        return UID;
    }

    public void setUID(String UID) {
        this.UID = UID;
    }

    public String getFromTime() {
        return FromTime;
    }

    public void setFromTime(String fromTime) {
        FromTime = fromTime;
    }

    public String getToTime() {
        return ToTime;
    }

    public void setToTime(String toTime) {
        ToTime = toTime;
    }

    public String getRequestDate() {
        return RequestDate;
    }

    public void setRequestDate(String requestDate) {
        RequestDate = requestDate;
    }

    public String getCreatedDate() {
        return CreatedDate;
    }

    public void setCreatedDate(String createdDate) {
        CreatedDate = createdDate;
    }

    public String getApprovalDate() {
        return ApprovalDate;
    }

    public void setApprovalDate(String approvalDate) {
        ApprovalDate = approvalDate;
    }

    public String getStatus() {
        return Status;
    }

    public void setStatus(String status) {
        Status = status;
    }

    public String getType() {
        return Type;
    }

    public void setType(String type) {
        Type = type;
    }

    public String getCode() {
        return Code;
    }

    public void setCode(String code) {
        Code = code;
    }

    public Doctor[] getDoctor() {
        return Doctors;
    }

    public void setDoctor(Doctor[] doctors) {
        Doctors = doctors;
    }

    public Patient[] getPatient() {
        return Patients;
    }

    public void setPatient(Patient[] patients) {
        Patients = patients;
    }

    public ArrayList<AppointmentData> getAppointmentDatas() {
        return AppointmentDatas;
    }

    public void setAppointmentDatas(ArrayList<AppointmentData> appointmentDatas) {
        AppointmentDatas = appointmentDatas;
    }

    public PatientAppointment getPatientAppointment() {
        return PatientAppointment;
    }

    public void setPatientAppointment(PatientAppointment patientAppointment) {
        PatientAppointment = patientAppointment;
    }

    public Patient[] getPatients() {
        return Patients;
    }

    public void setPatients(Patient[] patients) {
        Patients = patients;
    }

    public FileUpload[] getFileUploads() {
        return FileUploads;
    }

    public void setFileUploads(FileUpload[] fileUploads) {
        FileUploads = fileUploads;
    }

    public TelehealthAppointment getTelehealthAppointment() {
        return TelehealthAppointment;
    }

    public void setTelehealthAppointment(TelehealthAppointment telehealthAppointment) {
        TelehealthAppointment = telehealthAppointment;
    }
}
