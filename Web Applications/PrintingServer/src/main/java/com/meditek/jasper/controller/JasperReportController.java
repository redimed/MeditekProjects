/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.meditek.jasper.controller;

import com.meditek.jasper.model.NewRequestDataModel;
import com.meditek.jasper.model.RequestDataModel;
import com.meditek.jasper.process.NewPrintingMethod;
import com.meditek.jasper.process.PrintingProcess;

import java.io.ByteArrayOutputStream;


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

    @CrossOrigin("*")
    @RequestMapping(value="/print", method=RequestMethod.POST)
    public void print(HttpServletRequest req, HttpServletResponse res, @RequestBody RequestDataModel requestData) throws Exception{

            String printMethod = requestData.getPrintMethod();
            // Filling pdf file
            ByteArrayOutputStream baos;
            if(printMethod.equals("itext")){
                String baseUrl=req.getScheme()+"://"+req.getServerName()+":3005";
                baos = pdfPrinting.iTextPrinting(requestData.getData(), requestData.getTemplateUID(), baseUrl, printMethod);
            }
            else if(printMethod.equals("jasper")){
                String baseUrl=req.getScheme()+"://"+req.getServerName()+":3005";
                baos = pdfPrinting.jasperPrinting(requestData.getData(), requestData.getTemplateUID(), baseUrl, printMethod);
            }
            else{
                String baseUrl=req.getScheme()+"://"+req.getServerName()+":3005";
                baos = pdfPrinting.dynamicJasperPrinting(requestData.getData(), baseUrl, printMethod);
            }
            //Return the filled pdf file.
            res.setContentType("application/pdf");
            res.addHeader("Content-Disposition","inline");
            res.setContentLength(baos.toByteArray().length);
            res.getOutputStream().write(baos.toByteArray());           
    }
    
    @CrossOrigin("*")
    @RequestMapping(value="/newprint", method=RequestMethod.POST)
    public void newPrint(HttpServletRequest req, HttpServletResponse res, @RequestBody NewRequestDataModel requestData) throws Exception{
        String baseUrl=req.getScheme()+"://"+req.getServerName()+":3005";
        String printMethod = requestData.getPrintMethod();
        //Filling pdf file
        ByteArrayOutputStream baos;
        switch (printMethod){
            case "jasper":
                System.out.println("runhere");
                baos = NewPrintingMethod.printJasper(requestData.getData(), requestData.getTemplateUID(), baseUrl, printMethod);
                break;
            default :
                System.out.println("runhere default");
                baos=null;
                break;
        }
        //Return the filled pdf file.
        res.setContentType("application/pdf");
        res.addHeader("Content-Disposition","inline");
        res.setContentLength(baos.toByteArray().length);
        res.getOutputStream().write(baos.toByteArray());   
    }
    
}
