package patient.telehealth.redimed.workinjury.model;

import java.util.List;

/**
 * Created by macos on 7/18/16.
 */
public class ModelGeneral {

    private String patientUID;
    private String templateUID;
    private String appointmentUID;
    private String userUID;
    private String name;

    private String tempData;

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

    public String getTempData() {
        return tempData;
    }

    public void setTempData(String tempData) {
        this.tempData = tempData;
    }

    public static class TempDataBean {
        private String name;
        private String refRow;
        private String value;
        private int moduleID;
        private String checked;
        private String ref;
        private String type;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getRefRow() {
            return refRow;
        }

        public void setRefRow(String refRow) {
            this.refRow = refRow;
        }

        public String getValue() {
            return value;
        }

        public void setValue(String value) {
            this.value = value;
        }

        public int getModuleID() {
            return moduleID;
        }

        public void setModuleID(int moduleID) {
            this.moduleID = moduleID;
        }

        public String getChecked() {
            return checked;
        }

        public void setChecked(String checked) {
            this.checked = checked;
        }

        public String getRef() {
            return ref;
        }

        public void setRef(String ref) {
            this.ref = ref;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }
    }
}
