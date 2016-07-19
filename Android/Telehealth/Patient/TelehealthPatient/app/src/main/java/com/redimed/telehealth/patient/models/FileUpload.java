package com.redimed.telehealth.patient.models;

import android.os.Parcel;
import android.os.Parcelable;

import com.google.gson.annotations.SerializedName;

/**
 * Created by Lam on 10/21/2015.
 */
public class FileUpload implements Parcelable {

    private String apptUID;

    @SerializedName("UID")
    private String UID;

    @SerializedName("fileUID")
    private String fileUID;

    public FileUpload() {}

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

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(UID);
        dest.writeString(fileUID);
    }

    public FileUpload(Parcel in){
        UID = in.readString();
        fileUID = in.readString();
    }

    public static final Parcelable.Creator<FileUpload> CREATOR = new Parcelable.Creator<FileUpload>(){
        @Override
        public FileUpload createFromParcel(Parcel source) {
            return new FileUpload(source);
        }

        @Override
        public FileUpload[] newArray(int size) {
            return new FileUpload[size];
        }
    };
}

