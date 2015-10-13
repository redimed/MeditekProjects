package com.redimed.telehealth.patient.models;

import com.google.gson.annotations.SerializedName;

/**
 * Created by Fox on 9/25/2015.
 */
public class TelehealthUser {

    @SerializedName("ID")
    private int ID;

    @SerializedName("UID")
    private String UID;

    @SerializedName("UserAccountID")
    private String UserAccountID;

    @SerializedName("FirstName")
    private String FirstName;

    @SerializedName("LastName")
    private String LastName;

    @SerializedName("DOB")
    private String DOB;

    @SerializedName("Address1")
    private String Address1;

    @SerializedName("Address2")
    private String Address2;

    @SerializedName("DeviceID")
    private String DeviceID;

    @SerializedName("DeviceType")
    private String DeviceType;

    private String Phone;

    private String Token;

    private String Code;

    public int getID() {
        return ID;
    }

    public void setID(int ID) {
        this.ID = ID;
    }

    public String getUID() {
        return UID;
    }

    public void setUID(String UID) {
        this.UID = UID;
    }

    public String getUserAccountID() {
        return UserAccountID;
    }

    public void setUserAccountID(String userAccountID) {
        UserAccountID = userAccountID;
    }

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

    public String getDOB() {
        return DOB;
    }

    public void setDOB(String DOB) {
        this.DOB = DOB;
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

    public String getDeviceID() {
        return DeviceID;
    }

    public void setDeviceID(String deviceID) {
        DeviceID = deviceID;
    }

    public String getDeviceType() {
        return DeviceType;
    }

    public void setDeviceType(String deviceType) {
        DeviceType = deviceType;
    }

    public String getPhone() {
        return Phone;
    }

    public void setPhone(String phone) {
        Phone = phone;
    }

    public String getToken() {
        return Token;
    }

    public void setToken(String token) {
        Token = token;
    }

    public String getCode() {
        return Code;
    }

    public void setCode(String code) {
        Code = code;
    }
}
