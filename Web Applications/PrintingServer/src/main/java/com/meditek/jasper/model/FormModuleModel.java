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
public class FormModuleModel {
    String name;
    String templateFileName;
    Boolean isHeader;
    Boolean isFooter;

    public FormModuleModel(String name, String templateFileName, Boolean isHeader, Boolean isFooter) {
        this.name = name;
        this.templateFileName = templateFileName+".jasper";
        this.isHeader = isHeader;
        this.isFooter = isFooter;
    }
    
    public Boolean getIsFooter() {
        return isFooter;
    }

    public void setIsFooter(Boolean isFooter) {
        this.isFooter = isFooter;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getIsHeader() {
        return isHeader;
    }

    public void setIsHeader(Boolean isHeader) {
        this.isHeader = isHeader;
    }

    public String getTemplateFileName() {
        return templateFileName;
    }

    public void setTemplateFileName(String templateFileName) {
        this.templateFileName = templateFileName;
    }
    
    
}
