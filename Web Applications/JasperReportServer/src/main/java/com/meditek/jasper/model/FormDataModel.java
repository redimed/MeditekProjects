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
    String type;
    Boolean checked;
    String ref;
    String refChild;
    String refRow;
    int columns;
    int rows;

    public String getRefRow() {
        return (refRow==null)?"":refRow;
    }

    public void setRefRow(String refRow) {
        this.refRow = (refRow==null)?"":refRow;
    }
    
    public String getRef() {
        return (ref==null)?"":ref;
    }

    public void setRef(String ref) {
        this.ref = (ref==null)?"":ref;
    }

    public String getRefChild() {
        return (refChild==null)?"":refChild;
    }

    public void setRefChild(String refChild) {
        this.refChild = (refChild==null)?"":refChild;
    }

    public String getType() {
        return (type==null)?"":type;
    }

    public void setType(String type) {
        this.type = (type==null)?"":type;
    }

    public String getName() {
        return (name==null)?"":name;
    }

    public void setName(String name) {
        this.name = (name==null)?"":name;
    }

    public String getValue() {
        return (value==null)?"":value;
    }

    public void setValue(String value) {
        this.value = (value==null)?"":value;
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

    public int getRows() {
        return rows;
    }

    public void setRows(int rows) {
        this.rows = rows;
    }
    
    
    
    
}
