/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.meditek.jasper.controller;

import com.meditek.jasper.model.FormDataModel;
import com.meditek.jasper.model.RequestDataModel;
import com.meditek.jasper.process.PrintingProcess;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

import java.util.Dictionary;
import java.util.Hashtable;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author rockmanexe1994
 */
@RestController
public class JasperReportController {
    
    PrintingProcess pdfPrinting = new PrintingProcess();
    
    @CrossOrigin("*")
    @RequestMapping(value="/hello", method=RequestMethod.GET)
    public String sayHello(){
        return "Hello World!";
    }
    
    @CrossOrigin("*")
    @RequestMapping(value="/struct", method=RequestMethod.POST)
    public String getDataStructure(HttpServletResponse res, @RequestBody RequestDataModel requestData){
        res.setContentType("application/pdf");
        return requestData.toString();
    }
    
//    @CrossOrigin("*")
//    @RequestMapping(value="/print", method=RequestMethod.POST)
//    public void print (HttpServletResponse res, @RequestBody RequestDataModel requestData){
//        try {
//            //Populate data list to HashTable
//            Dictionary DataDic = new Hashtable();
//            System.out.println(requestData.getTemplateUID());
//            System.out.println(requestData.getPrintMethod());
//            List<FormDataModel> formData = requestData.getData();
////            for(FormDataModel d : formData) System.out.println("Key: " + d.getName() + ", value: "+ d.getValue());;
//            for(FormDataModel d : formData) DataDic.put(d.getName(), d.getValue());
//            //Filling pdf file
//            ByteArrayOutputStream baos;
//            if(requestData.getPrintMethod().equals("itext")){
//                baos = pdfPrinting.iTextPrinting(DataDic, requestData.getTemplateUID()); // templateUID will be the template file name.
//            }
//            else{
////                baos = pdfPrinting.jasperPrinting(DataDic); // dataUID will be the template file name.
//            }
//            //Return the filled pdf file.
//            res.setContentType("application/pdf");
//            res.addHeader("Content-Disposition","inline");
//            res.setContentLength(baos.toByteArray().length);
//            res.getOutputStream().write(baos.toByteArray());
//        } catch (Exception ex) {
//            Logger.getLogger(JasperReportController.class.getName()).log(Level.SEVERE, null, ex);
//            res.setStatus(500);
//        }
//        
//    }
    @CrossOrigin("*")
    @RequestMapping(value="/print", method=RequestMethod.POST)
    public void print(HttpServletResponse res, @RequestBody RequestDataModel requestData){
        try {
            System.out.print("run heree");
            // Filling pdf file
            ByteArrayOutputStream baos;
            if(requestData.getPrintMethod().equals("itext")){
                baos = pdfPrinting.iTextPrinting(requestData.getData(), requestData.getTemplateUID());
            }
            else{
                baos = pdfPrinting.jasperPrinting(requestData.getData(), requestData.getTemplateUID());
            }
            //Return the filled pdf file.
            res.setContentType("application/pdf");
            res.addHeader("Content-Disposition","inline");
            res.setContentLength(baos.toByteArray().length);
            res.getOutputStream().write(baos.toByteArray());
        } catch (IOException ex) {
            Logger.getLogger(JasperReportController.class.getName()).log(Level.SEVERE, null, ex);
            
        }
    }
}
