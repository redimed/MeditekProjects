package patient.telehealth.redimed.workinjury.model;

import java.util.List;
import patient.telehealth.redimed.workinjury.model.ModelAppointmentCompany.AppointmentsBean.PatientAppointmentBean;
import patient.telehealth.redimed.workinjury.model.ModelAppointmentCompany.AppointmentsBean.AppointmentDataBean;
import patient.telehealth.redimed.workinjury.model.ModelAppointmentCompany.AppointmentsBean.FileUploadsBean;

/**
 * Created by PhanQuocChien on 6/30/16.
 */
public class ModelAppointmentPatient {

    private String Type;
    private String Description;
    private PatientAppointmentBean PatientAppointment;
    private String RequestDate;

    private List<AppointmentDataBean> AppointmentData;
    private List<FileUploadsBean> FileUploads;

    public String getType() {
        return Type;
    }

    public void setType(String Type) {
        this.Type = Type;
    }

    public String getDescription() {
        return Description;
    }

    public void setDescription(String Description) {
        this.Description = Description;
    }

    public PatientAppointmentBean getPatientAppointment() {
        return PatientAppointment;
    }

    public void setPatientAppointment(PatientAppointmentBean PatientAppointment) {
        this.PatientAppointment = PatientAppointment;
    }

    public String getRequestDate() {
        return RequestDate;
    }

    public void setRequestDate(String RequestDate) {
        this.RequestDate = RequestDate;
    }

    public List<AppointmentDataBean> getAppointmentData() {
        return AppointmentData;
    }

    public void setAppointmentData(List<AppointmentDataBean> AppointmentData) {
        this.AppointmentData = AppointmentData;
    }

    public List<FileUploadsBean> getFileUploads() {
        return FileUploads;
    }

    public void setFileUploads(List<FileUploadsBean> FileUploads) {
        this.FileUploads = FileUploads;
    }
}
