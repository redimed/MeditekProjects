package com.redimed.telehealth.patient.models;

import com.google.gson.annotations.SerializedName;

/**
 * Created by Lam on 10/14/2015.
 */
public class RelPatientAppointment {

    @SerializedName("ID")
    private int ID;

    @SerializedName("PatientID")
    private int PatientID;

    @SerializedName("AppointmentID")
    private int AppointmentID;

    public int getID() {
        return ID;
    }

    public void setID(int ID) {
        this.ID = ID;
    }

    public int getPatientID() {
        return PatientID;
    }

    public void setPatientID(int patientID) {
        PatientID = patientID;
    }

    public int getAppointmentID() {
        return AppointmentID;
    }

    public void setAppointmentID(int appointmentID) {
        AppointmentID = appointmentID;
    }
}
