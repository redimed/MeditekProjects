package com.redimed.telehealth.patient.models;

import com.google.gson.annotations.SerializedName;

/**
 * Created by Lam on 10/14/2015.
 */
public class Appointment {

    @SerializedName("UID")
    private String UID;

    @SerializedName("FromTime")
    private String FromTime;

    @SerializedName("ToTime")
    private String ToTime;

    @SerializedName("RequestDate")
    private String RequestDate;

    @SerializedName("ApprovalDate")
    private String ApprovalDate;

    @SerializedName("Status")
    private String Status;

    @SerializedName("Enable")
    private String Enable;

    @SerializedName("Doctors")
    private Doctor[] Doctors;

    @SerializedName("Patients")
    private Patient[] Patients;

    public String getUID() {
        return UID;
    }

    public void setUID(String UID) {
        this.UID = UID;
    }

    public String getFromTime() {
        return FromTime;
    }

    public void setFromTime(String fromTime) {
        FromTime = fromTime;
    }

    public String getToTime() {
        return ToTime;
    }

    public void setToTime(String toTime) {
        ToTime = toTime;
    }

    public String getRequestDate() {
        return RequestDate;
    }

    public void setRequestDate(String requestDate) {
        RequestDate = requestDate;
    }

    public String getApprovalDate() {
        return ApprovalDate;
    }

    public void setApprovalDate(String approvalDate) {
        ApprovalDate = approvalDate;
    }

    public String getStatus() {
        return Status;
    }

    public void setStatus(String status) {
        Status = status;
    }

    public String getEnable() {
        return Enable;
    }

    public void setEnable(String enable) {
        Enable = enable;
    }

    public Doctor[] getDoctor() {
        return Doctors;
    }

    public void setDoctor(Doctor[] doctors) {
        Doctors = doctors;
    }

    public Patient[] getPatient() {
        return Patients;
    }

    public void setPatient(Patient[] patients) {
        Patients = patients;
    }
}
