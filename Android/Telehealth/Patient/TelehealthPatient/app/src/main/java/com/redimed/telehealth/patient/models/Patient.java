package com.redimed.telehealth.patient.models;

import com.google.gson.annotations.SerializedName;

/**
 * Created by Lam on 10/12/2015.
 */
public class Patient {

    @SerializedName("UID")
    private String UID;

    @SerializedName("UserAccountID")
    private int UserAccountID;

    @SerializedName("FirstName")
    private String FirstName;

    @SerializedName("MiddleName")
    private String MiddleName;

    @SerializedName("LastName")
    private String LastName;

    @SerializedName("DOB")
    private String DOB;

    @SerializedName("Gender")
    private String Gender;

    @SerializedName("Address1")
    private String Address1;

    @SerializedName("Address2")
    private String Address2;

    @SerializedName("Suburb")
    private String Suburb;

    @SerializedName("PostCode")
    private String PostCode;

    @SerializedName("State")
    private String State;

    @SerializedName("Email")
    private String Email;

    @SerializedName("HomePhoneNumber")
    private String HomePhoneNumber;

    @SerializedName("Enable")
    private String Enable;

    @SerializedName("PhoneNumber")
    private String PhoneNumber;

    @SerializedName("UserAccount")
    private UserAccount userAccount;

    private String Limit;

    public String getUID() {
        return UID;
    }

    public void setUID(String UID) {
        this.UID = UID;
    }

    public int getUserAccountID() {
        return UserAccountID;
    }

    public void setUserAccountID(int userAccountID) {
        UserAccountID = userAccountID;
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

    public String getGender() {
        return Gender;
    }

    public void setGender(String gender) {
        Gender = gender;
    }

    public String getAddress1() {
        return Address1;
    }

    public void setAddress1(String address1) {
        Address1 = address1;
    }

    public String getAddress2() {
        return Address2;
    }

    public void setAddress2(String address2) {
        Address2 = address2;
    }

    public String getSuburb() {
        return Suburb;
    }

    public void setSuburb(String suburb) {
        Suburb = suburb;
    }

    public String getPostCode() {
        return PostCode;
    }

    public void setPostCode(String postCode) {
        PostCode = postCode;
    }

    public String getState() {
        return State;
    }

    public void setState(String state) {
        State = state;
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

    public String getEnable() {
        return Enable;
    }

    public void setEnable(String enable) {
        Enable = enable;
    }

    public String getPhoneNumber() {
        return PhoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        PhoneNumber = phoneNumber;
    }

    public UserAccount getUserAccount() {
        return userAccount;
    }

    public void setUserAccount(UserAccount userAccount) {
        this.userAccount = userAccount;
    }

    public String getLimit() {
        return Limit;
    }

    public void setLimit(String limit) {
        Limit = limit;
    }
}
