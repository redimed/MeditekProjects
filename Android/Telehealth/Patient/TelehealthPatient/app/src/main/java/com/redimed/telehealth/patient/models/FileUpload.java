package com.redimed.telehealth.patient.models;

import android.widget.ProgressBar;

import com.google.gson.annotations.SerializedName;

/**
 * Created by Lam on 10/21/2015.
 */
public class FileUpload {

    @SerializedName("ID")
    private int ID;

    @SerializedName("fileUID")
    private String fileUID;

    @SerializedName("UID")
    private String UID;

    private String apptUID;

    public FileUpload(String uid) {
        this.UID = uid;
    }

    public FileUpload() {
    }

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

    public String getFileUID() {
        return fileUID;
    }

    public void setFileUID(String fileUID) {
        this.fileUID = fileUID;
    }

    public String getApptUID() {
        return apptUID;
    }

    public void setApptUID(String apptUID) {
        this.apptUID = apptUID;
    }
}

