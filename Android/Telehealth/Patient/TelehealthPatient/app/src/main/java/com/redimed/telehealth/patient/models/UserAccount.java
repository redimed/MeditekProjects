package com.redimed.telehealth.patient.models;

import com.google.gson.annotations.SerializedName;

/**
 * Created by Lam on 9/28/2015.
 */
public class UserAccount {

    @SerializedName("UID")
    private String UID;

    @SerializedName("UserName")
    private String UserName;

    @SerializedName("Email")
    private String Email;

    @SerializedName("PhoneNumber")
    private String PhoneNumber;

    @SerializedName("Password")
    private String Password;

    @SerializedName("PasswordSalt")
    private String PasswordSalt;

    @SerializedName("PasswordHashAlgorithm")
    private String PasswordHashAlgorithm;

    @SerializedName("Activated")
    private String Activated;

    @SerializedName("Enable")
    private String Enable;

    @SerializedName("UserType")
    private String UserType;

    @SerializedName("Token")
    private String Token;

    @SerializedName("TokenExpired")
    private String TokenExpired;

    @SerializedName("CreationDate")
    private String CreationDate;

    @SerializedName("CreatedBy")
    private int CreatedBy;

    @SerializedName("ModifiedDate")
    private String ModifiedDate;

    @SerializedName("ModifiedBy")
    private int ModifiedBy;

    public String getUID() {
        return UID;
    }

    public void setUID(String UID) {
        this.UID = UID;
    }

    public String getUserName() {
        return UserName;
    }

    public void setUserName(String userName) {
        UserName = userName;
    }

    public String getEmail() {
        return Email;
    }

    public void setEmail(String email) {
        Email = email;
    }

    public String getPhoneNumber() {
        return PhoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        PhoneNumber = phoneNumber;
    }

    public String getPassword() {
        return Password;
    }

    public void setPassword(String password) {
        Password = password;
    }

    public String getPasswordSalt() {
        return PasswordSalt;
    }

    public void setPasswordSalt(String passwordSalt) {
        PasswordSalt = passwordSalt;
    }

    public String getPasswordHashAlgorithm() {
        return PasswordHashAlgorithm;
    }

    public void setPasswordHashAlgorithm(String passwordHashAlgorithm) {
        PasswordHashAlgorithm = passwordHashAlgorithm;
    }

    public String getActivated() {
        return Activated;
    }

    public void setActivated(String activated) {
        Activated = activated;
    }

    public String getEnable() {
        return Enable;
    }

    public void setEnable(String enable) {
        Enable = enable;
    }

    public String getUserType() {
        return UserType;
    }

    public void setUserType(String userType) {
        UserType = userType;
    }

    public String getToken() {
        return Token;
    }

    public void setToken(String token) {
        Token = token;
    }

    public String getTokenExpired() {
        return TokenExpired;
    }

    public void setTokenExpired(String tokenExpired) {
        TokenExpired = tokenExpired;
    }

    public String getCreationDate() {
        return CreationDate;
    }

    public void setCreationDate(String creationDate) {
        CreationDate = creationDate;
    }

    public int getCreatedBy() {
        return CreatedBy;
    }

    public void setCreatedBy(int createdBy) {
        CreatedBy = createdBy;
    }

    public String getModifiedDate() {
        return ModifiedDate;
    }

    public void setModifiedDate(String modifiedDate) {
        ModifiedDate = modifiedDate;
    }

    public int getModifiedBy() {
        return ModifiedBy;
    }

    public void setModifiedBy(int modifiedBy) {
        ModifiedBy = modifiedBy;
    }
}
