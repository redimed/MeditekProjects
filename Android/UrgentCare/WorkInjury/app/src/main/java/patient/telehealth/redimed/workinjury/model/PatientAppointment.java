package patient.telehealth.redimed.workinjury.model;

import com.google.gson.annotations.SerializedName;

/**
 * Created by Fox on 1/27/2016.
 */
public class PatientAppointment {
    @SerializedName("Title")
    private String Title;

    @SerializedName("FirstName")
    private String FirstName;

    @SerializedName("LastName")
    private String LastName;

    @SerializedName("PhoneNumber")
    private String PhoneNumber;

    @SerializedName("HomePhoneNumber")
    private String HomePhoneNumber;

    @SerializedName("WorkPhoneNumber")
    private String WorkPhoneNumber;

    @SerializedName("Postcode")
    private String Postcode;

    @SerializedName("PatientKinMobilePhoneNumber")
    private String PatientKinMobilePhoneNumber;

    @SerializedName("PatientKinFirstName")
    private String PatientKinFirstName;

    @SerializedName("PatientKinLastName")
    private String PatientKinLastName;

    @SerializedName("Address1")
    private String Address1;

    @SerializedName("Suburb")
    private String Suburb;

    @SerializedName("DOB")
    private String DOB;

    @SerializedName("Email1")
    private String Email;

    public String getFirstName() {
        return FirstName;
    }

    public void setFirstName(String firstName) {
        FirstName = firstName;
    }

    public String getLastName() {
        return LastName;
    }

    public void setLastName(String lastName) {
        LastName = lastName;
    }

    public String getPhoneNumber() {
        return PhoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        PhoneNumber = phoneNumber;
    }

    public String getHomePhoneNumber() {
        return HomePhoneNumber;
    }

    public void setHomePhoneNumber(String homePhoneNumber) {
        HomePhoneNumber = homePhoneNumber;
    }

    public String getTitle() {
        return Title;
    }

    public void setTitle(String title) {
        Title = title;
    }

    public String getWorkPhoneNumber() {
        return WorkPhoneNumber;
    }

    public void setWorkPhoneNumber(String workPhoneNumber) {
        WorkPhoneNumber = workPhoneNumber;
    }

    public String getPostcode() {
        return Postcode;
    }

    public void setPostcode(String postcode) {
        Postcode = postcode;
    }

    public String getPatientKinMobilePhoneNumber() {
        return PatientKinMobilePhoneNumber;
    }

    public void setPatientKinMobilePhoneNumber(String patientKinMobilePhoneNumber) {
        PatientKinMobilePhoneNumber = patientKinMobilePhoneNumber;
    }

    public String getPatientKinFirstName() {
        return PatientKinFirstName;
    }

    public void setPatientKinFirstName(String patientKinFirstName) {
        PatientKinFirstName = patientKinFirstName;
    }

    public String getPatientKinLastName() {
        return PatientKinLastName;
    }

    public void setPatientKinLastName(String patientKinLastName) {
        PatientKinLastName = patientKinLastName;
    }

    public String getAddress1() {
        return Address1;
    }

    public void setAddress1(String address1) {
        Address1 = address1;
    }

    public String getSuburb() {
        return Suburb;
    }

    public void setSuburb(String suburb) {
        Suburb = suburb;
    }

    public String getDOB() {
        return DOB;
    }

    public void setDOB(String DOB) {
        this.DOB = DOB;
    }

    public String getEmail() {
        return Email;
    }

    public void setEmail(String email) {
        Email = email;
    }
}
