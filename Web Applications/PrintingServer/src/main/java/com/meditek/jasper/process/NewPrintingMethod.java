/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.meditek.jasper.process;

import com.meditek.jasper.model.NewFormDataModel;

import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.InputStream;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import net.sf.jasperreports.engine.JREmptyDataSource;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;

/**
 *
 * @author rockmanexe1994
 */
public final class NewPrintingMethod {

    public NewPrintingMethod() {
    
    }
    
    public static ByteArrayOutputStream printJasper(List<NewFormDataModel> formData, String templateUID, String baseUrl, String printMethod){
        try{
            Hashtable parsedData = NewDataParse.dataParse(formData, baseUrl, printMethod);

            for(Enumeration data = parsedData.keys(); data.hasMoreElements();){
                String key= (String)data.nextElement();
                System.out.println("Key: "+key+"                    Value: "+ parsedData.get(key));
            }

            String realPath = "reportTemplate/jasper/";
            InputStream templateFile = new FileInputStream(realPath+templateUID+".jasper");
            HashMap params = new HashMap();
            params.put("data", parsedData);
            params.put("realPath", realPath);
            //Fill pdf
            JasperPrint print = JasperFillManager.fillReport(templateFile, params, new JREmptyDataSource());
            //Export to ByteArrayOutputStream
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            JasperExportManager.exportReportToPdfStream(print, baos);
            return baos;
        }
        catch (Exception ex) {
            Logger.getLogger(PrintingProcess.class.getName()).log(Level.SEVERE, null, ex);
            return null;
        } 
    }
}
