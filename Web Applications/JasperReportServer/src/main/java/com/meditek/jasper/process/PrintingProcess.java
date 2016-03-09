/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.meditek.jasper.process;

import com.itextpdf.text.DocumentException;
import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.PdfStamper;
import com.meditek.jasper.model.FormDataModel;
import com.meditek.jasper.model.ReportDataWrapperModel;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Dictionary;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import net.sf.jasperreports.engine.JREmptyDataSource;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.data.JRBeanArrayDataSource;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

/**
 *
 * @author rockmanexe1994
 */
public class PrintingProcess {
    
    DataProcess dataParsing = new DataProcess();
    
    public PrintingProcess() {
    }
    
    public ByteArrayOutputStream iTextPrinting(List<FormDataModel> formData, String formUID){
        try {
            // Get populated data
            Hashtable data = dataParsing.iTextDataParse(formData);
            for (Enumeration data1 = data.keys(); data1.hasMoreElements();){
                String key= (String)data1.nextElement();
                System.out.println("Key: "+key+" Value: "+ data.get(key));
            }
            //Get correct pdf template
            String pdfTemplateFile = "/com/meditek/itexttemplate/"+formUID+".pdf";
            PdfReader pdfTemplate = new PdfReader(pdfTemplateFile);
            // Fill pdf
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfStamper stamper = new PdfStamper(pdfTemplate, out);
            stamper.setFormFlattening(true);
            for(Enumeration d = data.keys(); d.hasMoreElements();){
                String key = (String)d.nextElement();
                stamper.getAcroFields().setField(key, data.get(key).toString());
            }
            stamper.close();
            pdfTemplate.close();
            return out;
        } catch (IOException ex) {
            Logger.getLogger(PrintingProcess.class.getName()).log(Level.SEVERE, null, ex);
            return null;
        } catch (DocumentException ex) {
            Logger.getLogger(PrintingProcess.class.getName()).log(Level.SEVERE, null, ex);
            return null;
        }
    }
    
    public ByteArrayOutputStream jasperPrinting(List<FormDataModel> formData, String formUID){
        try {
            Hashtable parsedData = dataParsing.jasperDataParse(formData);
            for (Enumeration data = parsedData.keys(); data.hasMoreElements();){
                String key= (String)data.nextElement();
                System.out.println("Key: "+key+"                    Value: "+ parsedData.get(key));
            }
            String realPath = "com/meditek/jaspertemplate/";
            InputStream templateFile = this.getClass().getResourceAsStream("/"+realPath+formUID+".jasper");
            
            HashMap params = new HashMap();
            params.put("data", parsedData);
            params.put("realPath", realPath);
            //Fill pdf
            JasperPrint print = JasperFillManager.fillReport(templateFile, params, new JREmptyDataSource());
            //Export to ByteArrayOutputStream
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            JasperExportManager.exportReportToPdfStream(print, baos);
            return baos;
        } catch (JRException ex) {
            Logger.getLogger(PrintingProcess.class.getName()).log(Level.SEVERE, null, ex);
            return null;
        }
    }

    		
//    public ByteArrayOutputStream jasperPrinting(Dictionary data){
//        try {
//            ReportDataWrapperModel fillData = dataParsing.DataParse(data);
//            HashMap params = new HashMap();
//            params.put("patientInfo", fillData.getPatient());
//            params.put("patientKin", fillData.getPatientKin());
//            // Fill pdf
//            JasperPrint print = JasperFillManager.fillReport("/home/rockmanexe1994/JaspersoftWorkspace/MyReports/DemoReport.jasper",params, new JREmptyDataSource());
//            //Export to ByteArrayOutputStream
//            ByteArrayOutputStream baos = new ByteArrayOutputStream();
//            JasperExportManager.exportReportToPdfStream(print, baos);
//            return baos;
//        } catch (JRException ex) {
//            Logger.getLogger(PrintingProcess.class.getName()).log(Level.SEVERE, null, ex);
//            return null;
//        }
//    }
    
//    public ByteArrayOutputStream iTextPrinting(Dictionary data, String templateUID){
//        try {
//            String pdfTemplateFile = "/com/meditek/itexttemplate/"+templateUID+".pdf";
////            String pdfTemplateFile = "/com/meditek/itexttemplate/Workcover WA - FINAL.pdf";
//            PdfReader pdfTemplate = new PdfReader(pdfTemplateFile);
//            
//            ByteArrayOutputStream out = new ByteArrayOutputStream();
//            PdfStamper stamper = new PdfStamper(pdfTemplate, out);
//            stamper.setFormFlattening(true);
////            Fill pdf
//            for (Enumeration d = data.keys(); d.hasMoreElements();){
//                String key = ((String)d.nextElement());
//                String lowerKey = key.toLowerCase();
//                System.out.println("Key: "+lowerKey+", value: "+data.get(key));
//                stamper.getAcroFields().setField(lowerKey, data.get(key).toString());
//            }
////            stamper.getAcroFields().setField("section1.question1.patientinfo.address1", "must see this");
//            stamper.close();
//            pdfTemplate.close();        
////            Return the output streamoutput
//            return out;
//
//        } catch (IOException | DocumentException ex) {
//            Logger.getLogger(PrintingProcess.class.getName()).log(Level.SEVERE, null, ex);
//            return null;
//        }
//    }

}
