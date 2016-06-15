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
import com.meditek.jasper.model.DynamicFormModuleDefinitionModel;
import com.meditek.jasper.model.FormDataModel;
import com.meditek.jasper.model.FormModuleModel;
import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import net.sf.jasperreports.engine.JREmptyDataSource;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.design.JRDesignBand;
import net.sf.jasperreports.engine.design.JRDesignExpression;
import net.sf.jasperreports.engine.design.JRDesignParameter;
import net.sf.jasperreports.engine.design.JRDesignSection;
import net.sf.jasperreports.engine.design.JRDesignStyle;
import net.sf.jasperreports.engine.design.JRDesignSubreport;
import net.sf.jasperreports.engine.design.JRDesignSubreportParameter;
import net.sf.jasperreports.engine.design.JasperDesign;
import net.sf.jasperreports.engine.type.PrintOrderEnum;
import net.sf.jasperreports.engine.type.SplitTypeEnum;
/**
 *
 * @author rockmanexe1994
 */
public class PrintingProcess {
    
    DataProcess dataParsing = new DataProcess();
    
    public PrintingProcess() {
    }
    
    public ByteArrayOutputStream iTextPrinting(List<FormDataModel> formData, String formUID, String baseUrl, String printMethod) throws Exception{
        try {
            // init params
            String basePath = "reportTemplate/itext/";
            String pdfTemplateFile = basePath+formUID+".pdf";
            // Get populated data
            Hashtable data = dataParsing.dataParse(formData, baseUrl, printMethod);
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
                    imgField.setLayout(PushbuttonField.LAYOUT_ICON_ONLY);
                    imgField.setScaleIcon(PushbuttonField.SCALE_ICON_ALWAYS);
                    imgField.setIconFitToBounds(true);
                    imgField.setProportionalIcon(false);
                    Image image = Image.getInstance((Image)data.get(key));
                    imgField.setImage(image);
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
    
    public ByteArrayOutputStream jasperPrinting(List<FormDataModel> formData, String formUID, String baseUrl, String printMethod) throws Exception{
        try {
            Hashtable parsedData = dataParsing.dataParse(formData, baseUrl, printMethod);
            for (Enumeration data = parsedData.keys(); data.hasMoreElements();){
                String key= (String)data.nextElement();
                System.out.println("Key: "+key+"                    Value: "+ parsedData.get(key));
            }
            String realPath = "reportTemplate/jasper/";
            InputStream templateFile = new FileInputStream(realPath+formUID+".jasper");
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
    
    public ByteArrayOutputStream dynamicJasperPrinting(List<FormDataModel> data, String baseUrl, String printMethod) throws Exception {
        //init some params first
        Hashtable parsedData = dataParsing.dataParse(data, baseUrl, printMethod);
        JRDesignBand newBand;
        Hashtable preDefinedModules = new DynamicFormModuleDefinitionModel().getModulesDef();
        // Make a list of the module ID needed
        List<String> moduleUIDList = new ArrayList<String>();
        for(FormDataModel d : data){
            if(!moduleUIDList.contains(d.getModuleID()) && !d.getModuleID().equals("")){
                moduleUIDList.add(d.getModuleID().toString());
            }
        }
         // Main Jasper Design
         // Generate a blank report
         JasperDesign jasperDesign = new JasperDesign();
         jasperDesign.setName("Functional Assessment Report");
         jasperDesign.setPageWidth(595);
         jasperDesign.setPageHeight(842);
         jasperDesign.setColumnWidth(515);
         jasperDesign.setColumnSpacing(0);
         jasperDesign.setLeftMargin(20);
         jasperDesign.setRightMargin(20);
         jasperDesign.setTopMargin(20);
//         jasperDesign.setBottomMargin(20);
         jasperDesign.setWhenNoDataType(null);
//         jasperDesign.setOrientation(OrientationEnum.PORTRAIT);
         jasperDesign.setPrintOrder(PrintOrderEnum.VERTICAL);
         JRDesignStyle normalStyle = new JRDesignStyle();
         normalStyle.setName("test");
         normalStyle.setDefault(true);
         normalStyle.setFontName("OfficiaSans Basic");
         normalStyle.setPdfFontName("OfficiaSans Basic");
         normalStyle.setPdfEncoding("Cp1252");
         normalStyle.setPdfEmbedded(true);
         jasperDesign.addStyle(normalStyle);
         JRDesignParameter parameter = new JRDesignParameter();
         parameter.setName("data");
         parameter.setValueClass(Hashtable.class);
         jasperDesign.addParameter(parameter);
         parameter = new JRDesignParameter();
         parameter.setName("real_path");
         parameter.setValueClass(String.class);
         jasperDesign.addParameter(parameter);
         parameter = new JRDesignParameter();
         parameter.setName("module_list");
         parameter.setValueClass(ArrayList.class);
         jasperDesign.addParameter(parameter);

         //Add sub reports
        for(String moduleUID:moduleUIDList){
            System.out.println("this is module UID: "+moduleUID);
            if(preDefinedModules.get(moduleUID)==null) continue;
            // get correct sub report, config it and add it to a new band
            FormModuleModel module = (FormModuleModel)preDefinedModules.get(moduleUID);
            JRDesignBand band = new JRDesignBand();
            band.setSplitType(SplitTypeEnum.STRETCH);
            JRDesignSubreport sub = new JRDesignSubreport(jasperDesign);
            sub.setWidth(555);
            JRDesignExpression expression = new JRDesignExpression();
            expression.setText("\"reportTemplate/dynamicjasper/"+module.getTemplateFileName()+"\"");
            sub.setExpression(expression);
            JRDesignSubreportParameter subparam = new JRDesignSubreportParameter();
            subparam.setName("data");
            expression = new JRDesignExpression();
            expression.setText("$P{data}.get(\""+moduleUID+"\")");
            subparam.setExpression(expression);
            sub.addParameter(subparam);
            subparam = new JRDesignSubreportParameter();
            subparam.setName("real_path");
            expression = new JRDesignExpression();
            expression.setText("$P{real_path}");
            subparam.setExpression(expression);
            sub.addParameter(subparam);
            if(moduleUID.equals("42")){
                subparam = new JRDesignSubreportParameter();
                subparam.setName("module_list");
                expression = new JRDesignExpression();
                expression.setText("$P{module_list}");
                subparam.setExpression(expression);
                sub.addParameter(subparam);
            }
            expression = new JRDesignExpression();
            expression.setText("new net.sf.jasperreports.engine.JREmptyDataSource()");
            sub.setDataSourceExpression(expression);
            band.addElement(sub);
            // add the band to the correct position
            if(module.getIsFooter()==true) {
                band.setHeight(20);
                jasperDesign.setPageFooter(band);
            }
            else if(module.getIsHeader()==true) jasperDesign.setPageHeader(band);
            else ((JRDesignSection)jasperDesign.getDetailSection()).addBand(band);
        }
        JasperReport jasperReport = JasperCompileManager.compileReport(jasperDesign);
        HashMap params = new HashMap();
        String realPath = "reportTemplate/dynamicjasper/";
        params.put("data", parsedData);
        params.put("real_path", realPath);
        params.put("module_list", moduleUIDList);
        System.out.println("this is parsed data: " + parsedData.toString());
        JasperPrint print = JasperFillManager.fillReport(jasperReport, params, new JREmptyDataSource());
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        JasperExportManager.exportReportToPdfStream(print, baos);
        return baos;
    }
    

}
