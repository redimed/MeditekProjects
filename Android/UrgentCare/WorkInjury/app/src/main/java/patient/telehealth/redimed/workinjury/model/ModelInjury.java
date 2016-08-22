package patient.telehealth.redimed.workinjury.model;


import java.util.List;
import patient.telehealth.redimed.workinjury.model.ModelGeneral.TempDataBean;


/**
 * Created by macos on 7/18/16.
 */
public class ModelInjury {

    private String patientUID;
    private String templateUID;
    private String appointmentUID;
    private String userUID;
    private String name;

    private List<TempDataBean> tempData;

    public String getPatientUID() {
        return patientUID;
    }

    public void setPatientUID(String patientUID) {
        this.patientUID = patientUID;
    }

    public String getTemplateUID() {
        return templateUID;
    }

    public void setTemplateUID(String templateUID) {
        this.templateUID = templateUID;
    }

    public String getAppointmentUID() {
        return appointmentUID;
    }

    public void setAppointmentUID(String appointmentUID) {
        this.appointmentUID = appointmentUID;
    }

    public String getUserUID() {
        return userUID;
    }

    public void setUserUID(String userUID) {
        this.userUID = userUID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<TempDataBean> getTempData() {
        return tempData;
    }

    public void setTempData(List<TempDataBean> tempData) {
        this.tempData = tempData;
    }

}
