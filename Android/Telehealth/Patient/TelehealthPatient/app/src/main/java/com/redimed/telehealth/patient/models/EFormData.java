package com.redimed.telehealth.patient.models;

import com.google.gson.annotations.SerializedName;

/**
 * Created by MeditekMini on 6/20/16.
 */
public class EFormData {

    @SerializedName("value")
    private String value;

    @SerializedName("name")
    private String name;

    @SerializedName("ref")
    private String ref;

    @SerializedName("type")
    private String type;

    @SerializedName("checked")
    private boolean checked;

    @SerializedName("refRow")
    private String refRow;

    @SerializedName("moduleID")
    private int moduleID;

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRef() {
        return ref;
    }

    public void setRef(String ref) {
        this.ref = ref;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public boolean isChecked() {
        return checked;
    }

    public void setChecked(boolean checked) {
        this.checked = checked;
    }

    public String getRefRow() {
        return refRow;
    }

    public void setRefRow(String refRow) {
        this.refRow = refRow;
    }

    public int getModuleID() {
        return moduleID;
    }

    public void setModuleID(int moduleID) {
        this.moduleID = moduleID;
    }

    public EFormData(String value, String name, String ref, String type, boolean checked, String refRow, int moduleID) {
        this.value = value;
        this.name = name;
        this.ref = ref;
        this.type = type;
        this.checked = checked;
        this.refRow = refRow;
        this.moduleID = moduleID;
    }

    public EFormData(String value, String name, String ref, String type, String refRow, int moduleID) {
        this.value = value;
        this.name = name;
        this.ref = ref;
        this.type = type;
        this.refRow = refRow;
        this.moduleID = moduleID;
    }

    public EFormData() {
    }
}
