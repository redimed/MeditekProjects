package com.redimed.telehealth.patient.models;

import com.google.gson.annotations.SerializedName;

/**
 * Created by Lam on 10/14/2015.
 */
public class ClinicalDetail {

    @SerializedName("UID")
    private String UID;

    @SerializedName("Section")
    private String Section;

    @SerializedName("Category")
    private String Category;

    @SerializedName("Type")
    private String Type;

    @SerializedName("Name")
    private String Name;

    @SerializedName("Value")
    private String Value;

    @SerializedName("ClinicalNote")
    private String ClinicalNote;

    @SerializedName("Description")
    private String Description;

    public String getUID() {
        return UID;
    }

    public void setUID(String UID) {
        this.UID = UID;
    }

    public String getSection() {
        return Section;
    }

    public void setSection(String section) {
        Section = section;
    }

    public String getCategory() {
        return Category;
    }

    public void setCategory(String category) {
        Category = category;
    }

    public String getType() {
        return Type;
    }

    public void setType(String type) {
        Type = type;
    }

    public String getName() {
        return Name;
    }

    public void setName(String name) {
        Name = name;
    }

    public String getValue() {
        return Value;
    }

    public void setValue(String value) {
        Value = value;
    }

    public String getClinicalNote() {
        return ClinicalNote;
    }

    public void setClinicalNote(String clinicalNote) {
        ClinicalNote = clinicalNote;
    }

    public String getDescription() {
        return Description;
    }

    public void setDescription(String description) {
        Description = description;
    }
}
