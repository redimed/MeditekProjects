package com.redimed.telehealth.patient.models;

import com.google.gson.annotations.SerializedName;

/**
 * Created by Lam on 10/14/2015.
 */
public class Doctor {

    @SerializedName("UID")
    private String UID;

    @SerializedName("FirstName")
    private String FirstName;

    @SerializedName("MiddleName")
    private String MiddleName;

    @SerializedName("LastName")
    private String LastName;

    @SerializedName("DOB")
    private String DOB;

    @SerializedName("Email")
    private String Email;

    @SerializedName("HomePhoneNumber")
    private String HomePhoneNumber;

    @SerializedName("WorkPhoneNumber")
    private String WorkPhoneNumber;

    @SerializedName("RelDoctorAppointment")
    private RelDoctorAppointment RelDoctorAppointment;

    public String getUID() {
        return UID;
    }

    public void setUID(String UID) {
        this.UID = UID;
    }

    public String getFirstName() {
        return FirstName;
    }

    public void setFirstName(String firstName) {
        FirstName = firstName;
    }

    public String getMiddleName() {
        return MiddleName;
    }

    public void setMiddleName(String middleName) {
        MiddleName = middleName;
    }

    public String getLastName() {
        return LastName;
    }

    public void setLastName(String lastName) {
        LastName = lastName;
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

    public String getHomePhoneNumber() {
        return HomePhoneNumber;
    }

    public void setHomePhoneNumber(String homePhoneNumber) {
        HomePhoneNumber = homePhoneNumber;
    }

    public String getWorkPhoneNumber() {
        return WorkPhoneNumber;
    }

    public void setWorkPhoneNumber(String workPhoneNumber) {
        WorkPhoneNumber = workPhoneNumber;
    }

    public com.redimed.telehealth.patient.models.RelDoctorAppointment getRelDoctorAppointment() {
        return RelDoctorAppointment;
    }

    public void setRelDoctorAppointment(com.redimed.telehealth.patient.models.RelDoctorAppointment relDoctorAppointment) {
        RelDoctorAppointment = relDoctorAppointment;
    }
}
