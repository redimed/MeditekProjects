/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.meditek.jasper.controller;

import com.meditek.jasper.model.FormDataModel;
import com.meditek.jasper.model.RequestDataModel;
import com.meditek.jasper.process.PrintingProcess;
import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.ByteBuffer;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;

import java.util.Dictionary;
import java.util.Hashtable;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.imageio.ImageIO;
import javax.imageio.stream.ImageOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import sun.misc.IOUtils;

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
                baos = pdfPrinting.iTextPrinting(requestData.getData(), requestData.getTemplateUID());
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
    
    @CrossOrigin("*")
    @RequestMapping(value="/test", method=RequestMethod.GET)
    public void test(HttpServletRequest req){
        try {
                System.out.println(req.getScheme()+"://"+req.getServerName()+":3005");
                URL url = new URL("https://meditek.redimed.com.au:3005/api/downloadFileWithoutLogin/a26d342d-0cac-4c62-84a9-3bca782127d6");
//                ReadableByteChannel rbc = Channels.newChannel(url.openStream());
                
//                System.out.println(rbc);
//              ByteArrayOutputStream baos = new ByteArrayOutputStream();
//              
//                FileOutputStream fos = new FileOutputStream("tmp");
//                fos.getChannel().transferFrom(rbc, 0, Long.MAX_VALUE);
//                System.out.println(fos);
                BufferedImage image = ImageIO.read(url.openStream());
                File output = new File("/home/rockmanexe1994/tmp.png");
                ImageIO.write(image, "png", output);
              
//                System.out.println(image);
//                ImageIO.read(url);
                
                
            } catch (Exception ex) {
            Logger.getLogger(JasperReportController.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}
