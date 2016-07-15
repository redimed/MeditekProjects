package patient.telehealth.redimed.workinjury.models;

/**
 * Created by phanq on 04/15/2016.
 */
public class PatientAppointmentModel {
    private String PhoneNumber;
    private String DOB;
    private String Email1;
    private String FirstName;
    private String HomePhoneNumber;
    private String LastName;
    private String Suburb;

    public String getPhoneNumber() {
        return PhoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        PhoneNumber = phoneNumber;
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

    public void setEmail1(String email1) {
        Email1 = email1;
    }

    public String getFirstName() {
        return FirstName;
    }

    public void setFirstName(String firstName) {
        FirstName = firstName;
    }

    public String getHomePhoneNumber() {
        return HomePhoneNumber;
    }

    public void setHomePhoneNumber(String homePhoneNumber) {
        HomePhoneNumber = homePhoneNumber;
    }

    public String getLastName() {
        return LastName;
    }

    public void setLastName(String lastName) {
        LastName = lastName;
    }

    public String getSuburb() {
        return Suburb;
    }

    public void setSuburb(String suburb) {
        Suburb = suburb;
    }
}
