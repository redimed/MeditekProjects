package com.redimed.telehealth.patient.models;

import com.google.gson.annotations.SerializedName;

/**
 * Created by LamNguyen on 11/13/2015.
 */
public class TelehealthAppointment {

    @SerializedName("RefName")
    private String RefName;

    public String getRefName() {
        return RefName;
    }

    public void setRefName(String refName) {
        RefName = refName;
    }
}
