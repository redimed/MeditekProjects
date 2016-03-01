/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.meditek.jasper.model;

/**
 *
 * @author rockmanexe1994
 */
public class FormDataModel {
    String name;
    String value;
    Boolean checked;
    String ref;
    String refChild;
    int columns;

    public String getRef() {
        return ref;
    }

    public void setRef(String ref) {
        this.ref = ref;
    }

    public String getRefChild() {
        return refChild;
    }

    public void setRefChild(String refChild) {
        this.refChild = refChild;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
    String type;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public Boolean getChecked() {
        return checked;
    }

    public void setChecked(Boolean checked) {
        this.checked = checked;
    }

    public int getColumns() {
        return columns;
    }

    public void setColumns(int columns) {
        this.columns = columns;
    }
    
    
    
    
}
