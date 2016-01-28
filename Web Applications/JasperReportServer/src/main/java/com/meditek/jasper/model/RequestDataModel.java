/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.meditek.jasper.model;

import java.util.List;

/**
 *
 * @author rockmanexe1994
 */
public class RequestDataModel{
    String printMethod;
    String templateUID;
    List<FormDataModel> data;

    public List<FormDataModel> getData() {
        return data;
    }

    public void setData(List<FormDataModel> data) {
        this.data = data;
    }

    public String getPrintMethod() {
        return printMethod;
    }

    public void setPrintMethod(String printMethod) {
        this.printMethod = printMethod;
    }

    public String getTemplateUID() {
        return templateUID;
    }

    public void setTemplateUID(String templateUID) {
        this.templateUID = templateUID;
    }


    
}