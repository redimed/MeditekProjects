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
public class NewRequestDataModel {
        String printMethod;
        String templateUID;
        List<NewFormDataModel> data;

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

    public List<NewFormDataModel> getData() {
        return data;
    }

    public void setData(List<NewFormDataModel> data) {
        this.data = data;
    }
}
