package patient.telehealth.redimed.workinjury.model;

import java.util.List;

/**
 * Created by PhanQuocChien on 6/29/16.
 */
public class ModelAppointmentCompany {

    private List<AppointmentsBean> Appointments;

    public List<AppointmentsBean> getAppointments() {
        return Appointments;
    }

    public void setAppointments(List<AppointmentsBean> Appointments) {
        this.Appointments = Appointments;
    }

    public static class AppointmentsBean {
        private String FromTime;
        private String ToTime;
        private String Type;
        private String RequestDate;
        private String Description;

        private PatientAppointmentBean PatientAppointment;

        private List<AppointmentDataBean> AppointmentData;

        private List<PatientsBean> Patients;

        private List<DoctorsBean> Doctors;

        private List<FileUploadsBean> FileUploads;

        public String getRequestDate() {
            return RequestDate;
        }

        public void setRequestDate(String RequestDate) {
            this.RequestDate = RequestDate;
        }

        public String getDescription() {
            return Description;
        }

        public void setDescription(String Description) {
            this.Description = Description;
        }

        public String getFromTime() {
            return FromTime;
        }

        public void setFromTime(String FromTime) {
            this.FromTime = FromTime;
        }

        public String getToTime() {
            return ToTime;
        }

        public void setToTime(String ToTime) {
            this.ToTime = ToTime;
        }

        public String getType() {
            return Type;
        }

        public void setType(String Type) {
            this.Type = Type;
        }

        public PatientAppointmentBean getPatientAppointment() {
            return PatientAppointment;
        }

        public void setPatientAppointment(PatientAppointmentBean PatientAppointment) {
            this.PatientAppointment = PatientAppointment;
        }

        public List<AppointmentDataBean> getAppointmentData() {
            return AppointmentData;
        }

        public void setAppointmentData(List<AppointmentDataBean> AppointmentData) {
            this.AppointmentData = AppointmentData;
        }

        public List<PatientsBean> getPatients() {
            return Patients;
        }

        public void setPatients(List<PatientsBean> Patients) {
            this.Patients = Patients;
        }

        public List<DoctorsBean> getDoctors() {
            return Doctors;
        }

        public void setDoctors(List<DoctorsBean> Doctors) {
            this.Doctors = Doctors;
        }

        public List<FileUploadsBean> getFileUploads() {
            return FileUploads;
        }

        public void setFileUploads(List<FileUploadsBean> FileUploads) {
            this.FileUploads = FileUploads;
        }

        public static class PatientAppointmentBean {
            private String FirstName;
            private String LastName;
            private String PhoneNumber;
            private String DOB;
            private String Email1;
            private String HomePhoneNumber;
            private String Suburb;

            public String getFirstName() {
                return FirstName;
            }

            public void setFirstName(String FirstName) {
                this.FirstName = FirstName;
            }

            public String getLastName() {
                return LastName;
            }

            public void setLastName(String LastName) {
                this.LastName = LastName;
            }
            public String getPhoneNumber() {
                return PhoneNumber;
            }

            public void setPhoneNumber(String PhoneNumber) {
                this.PhoneNumber = PhoneNumber;
            }
            public String getDOB() {
                return DOB;
            }

            public void setDOB(String DOB) {
                this.DOB = DOB;
            }
            public String getEmail1() {
                return Email1;
            }

            public void setEmail1(String Email1) {
                this.Email1 = Email1;
            }
            public String getHomePhoneNumber() {
                return HomePhoneNumber;
            }

            public void setHomePhoneNumber(String HomePhoneNumber) {
                this.HomePhoneNumber = HomePhoneNumber;
            }
            public String getSuburb() {
                return Suburb;
            }

            public void setSuburb(String Suburb) {
                this.Suburb = Suburb;
            }
        }

        public static class AppointmentDataBean {
            private String Category;
            private String Name;
            private String Section;
            private String Type;
            private String Value;

            public String getCategory() {
                return Category;
            }

            public void setCategory(String Category) {
                this.Category = Category;
            }

            public String getName() {
                return Name;
            }

            public void setName(String Name) {
                this.Name = Name;
            }

            public String getSection() {
                return Section;
            }

            public void setSection(String Section) {
                this.Section = Section;
            }

            public String getType() {
                return Type;
            }

            public void setType(String Type) {
                this.Type = Type;
            }

            public String getValue() {
                return Value;
            }

            public void setValue(String Value) {
                this.Value = Value;
            }
        }

        public static class PatientsBean {
            private String UID;

            public String getUID() {
                return UID;
            }

            public void setUID(String UID) {
                this.UID = UID;
            }
        }

        public static class DoctorsBean {
            private String UID;

            public String getUID() {
                return UID;
            }

            public void setUID(String UID) {
                this.UID = UID;
            }
        }

        public static class FileUploadsBean {
            private String UID;

            public String getUID() {
                return UID;
            }

            public void setUID(String UID) {
                this.UID = UID;
            }
        }
    }
}
