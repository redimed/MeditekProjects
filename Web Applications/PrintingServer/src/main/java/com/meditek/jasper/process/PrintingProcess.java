/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.meditek.jasper.process;

import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Image;
import com.itextpdf.text.pdf.AcroFields;
import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.PdfStamper;
import com.itextpdf.text.pdf.PushbuttonField;
import com.meditek.jasper.model.FormDataModel;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
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
/**
 *
 * @author rockmanexe1994
 */
public class PrintingProcess {
    
    DataProcess dataParsing = new DataProcess();
    
    public PrintingProcess() {
    }
    
    public ByteArrayOutputStream iTextPrinting(List<FormDataModel> formData, String formUID, String baseUrl) throws Exception{
        try {
            // init params
            String basePath = "com/meditek/itexttemplate/";
            String pdfTemplateFile = "/"+basePath+formUID+".pdf";
            // Get populated data
            Hashtable data = dataParsing.iTextDataParse(formData, baseUrl);
            for (Enumeration data1 = data.keys(); data1.hasMoreElements();){
                String key= (String)data1.nextElement();
                System.out.println("Key: "+key+" Value: "+ data.get(key));
            }
            //Get correct pdf template
          
            PdfReader pdfTemplate = new PdfReader(pdfTemplateFile);
            // Fill pdf
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            PdfStamper stamper = new PdfStamper(pdfTemplate, out);
            AcroFields form = stamper.getAcroFields();
            stamper.setFormFlattening(true);
            for(Enumeration d = data.keys(); d.hasMoreElements();){
                String key = (String)d.nextElement();
               
                if(key.contains("base64") || key.contains("image") || key.contains("signature")){
                    PushbuttonField imgField = form.getNewPushbuttonFromField(key);
                     System.out.println("This is imgfield: " + imgField);
                    imgField.setLayout(PushbuttonField.LAYOUT_ICON_ONLY);
                    imgField.setProportionalIcon(true);
                    imgField.setImage(Image.getInstance((Image)data.get(key)));
                    form.replacePushbuttonField(key, imgField.getField());
                }
                else stamper.getAcroFields().setField(key, data.get(key).toString());
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
    
    public ByteArrayOutputStream jasperPrinting(List<FormDataModel> formData, String formUID, String baseUrl) throws Exception{
        try {
            Hashtable parsedData = dataParsing.jasperDataParse(formData, baseUrl);
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

}
