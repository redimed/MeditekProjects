/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.meditek.jasper.controller;

import com.meditek.jasper.model.RequestDataModel;
import com.meditek.jasper.process.PrintingProcess;
import java.awt.image.BufferedImage;

import java.io.ByteArrayOutputStream;
import java.io.File;

import java.net.URL;



import java.util.logging.Level;
import java.util.logging.Logger;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
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
//    String baseUrl="https://meditek.redimed.com.au:3005";
    //String baseUrl="https://testapp.redimed.com.au:3005";
    
    @CrossOrigin("*")
    @RequestMapping(value="/hello", method=RequestMethod.GET)
    public String sayHello(){
        return "Hello World!";
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
    public void print(HttpServletRequest req, HttpServletResponse res, @RequestBody RequestDataModel requestData) throws Exception{

            System.out.print("run heree");
            // Filling pdf file
            ByteArrayOutputStream baos;
            if(requestData.getPrintMethod().equals("itext")){
                String baseUrl=req.getScheme()+"://"+req.getServerName()+":3005";
                baos = pdfPrinting.iTextPrinting(requestData.getData(), requestData.getTemplateUID(), baseUrl);
            }
            else{
                String baseUrl=req.getScheme()+"://"+req.getServerName()+":3005";
                baos = pdfPrinting.jasperPrinting(requestData.getData(), requestData.getTemplateUID(), baseUrl);
            }
            //Return the filled pdf file.
            res.setContentType("application/pdf");
            res.addHeader("Content-Disposition","inline");
            res.setContentLength(baos.toByteArray().length);
            res.getOutputStream().write(baos.toByteArray());           
    }
    
}
