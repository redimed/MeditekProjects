package com.redimed.telehealth.patient.models;

import com.google.gson.annotations.SerializedName;

/**
 * Created by Lam on 10/14/2015.
 */
public class TelehealthAppointment {

    @SerializedName("UID")
    private String UID;

    @SerializedName("RefName")
    private String RefName;

    @SerializedName("RefDate")
    private String RefDate;

    @SerializedName("PatientAppointment")
    private PatientAppointment PatientAppointment;

    @SerializedName("ClinicalDetails")
    private ClinicalDetail[] ClinicalDetails;

    public String getUID() {
        return UID;
    }

    public void setUID(String UID) {
        this.UID = UID;
    }

    public String getRefName() {
        return RefName;
    }

    public void setRefName(String refName) {
        RefName = refName;
    }

    public String getRefDate() {
        return RefDate;
    }

    public void setRefDate(String refDate) {
        RefDate = refDate;
    }

    public PatientAppointment getPatientAppointment() {
        return PatientAppointment;
    }

    public void setPatientAppointment(PatientAppointment patientAppointment) {
        PatientAppointment = patientAppointment;
    }

    public ClinicalDetail[] getClinicalDetails() {
        return ClinicalDetails;
    }

    public void setClinicalDetails(ClinicalDetail[] clinicalDetails) {
        ClinicalDetails = clinicalDetails;
    }
}
