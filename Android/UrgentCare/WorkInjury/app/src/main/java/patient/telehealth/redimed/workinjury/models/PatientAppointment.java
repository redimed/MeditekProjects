package patient.telehealth.redimed.workinjury.models;

import com.google.gson.annotations.SerializedName;

/**
 * Created by Fox on 1/27/2016.
 */
public class PatientAppointment {

    @SerializedName("FirstName")
    public String FirstName;

    @SerializedName("LastName")
    public String LastName;

    @SerializedName("PhoneNumber")
    public String PhoneNumber;

    @SerializedName("HomePhoneNumber")
    public String HomePhoneNumber;

    @SerializedName("Suburb")
    public String Suburb;

    @SerializedName("DOB")
    public String DOB;

    @SerializedName("Email1")
    public String Email;

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
