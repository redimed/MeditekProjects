/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.meditek.jasper.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.meditek.jasper.model.FormDataModel;
import com.meditek.jasper.model.MailModel;
import com.meditek.jasper.model.NewAttachmentModel;
import com.meditek.jasper.model.NewReportRequestDataModel;
import com.meditek.jasper.model.RequestDataModel;
import com.meditek.jasper.process.NewPrintingMethod;
import com.meditek.jasper.process.PrintingProcess;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.URL;
import java.net.URLConnection;
import java.util.List;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.mail.MessagingException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.net.ssl.HttpsURLConnection;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.configuration.XMLConfiguration;
import org.apache.commons.io.IOUtils;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.InputStreamSource;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import sun.nio.ch.IOUtil;


/**
 *
 * @author rockmanexe1994
 */
@RestController
public class MainController {
    
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
    public void newPrint(HttpServletRequest req, HttpServletResponse res, @RequestBody NewReportRequestDataModel requestData) throws Exception{
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
    
    @CrossOrigin("*")
    @RequestMapping(value="/sendmail", method=RequestMethod.POST)
    public void sendMail(HttpServletRequest req, HttpServletResponse res, @RequestBody MailModel mailRequest) throws Exception {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();

        MimeMessage message = sender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setFrom(mailRequest.getSender());
//            helper.setTo(mailRequest.getRecipient().);
        for (String r : mailRequest.getRecipient()){
            helper.addTo(r);
        }
        helper.setSubject(mailRequest.getSubject());
        helper.setText(mailRequest.getBodyContent());
//        System.out.println("this is the number of attachments" +);
        // Get attachments
        String baseUrl=req.getScheme()+"://"+req.getServerName()+":3005";
        for (NewAttachmentModel attachment : mailRequest.getAttachments()){
            switch (attachment.getType()){
                case "report":
                    //test only
                    
//                    String baseUrl="https://meditek.redimed.com.au:3005";
//                    String printMethod = attachment.getContent().getPrintMethod();
                    // for main deployment
                    URL getReportURL=new URL(req.getScheme()+"://"+req.getServerName()+":3015/eform/print");
                    HttpsURLConnection conn = (HttpsURLConnection) getReportURL.openConnection();
                    conn.setRequestMethod("POST");
                    conn.setDoOutput(true);
                    conn.setRequestProperty("Content-Type", "application/json");
                    String jsonParams = "{\"EFormUID\":\""+attachment.getContent()+"\"}";
                    OutputStream os = conn.getOutputStream();
                    os.write(jsonParams.getBytes());
                    os.flush();
                    InputStream result = conn.getInputStream();
                    BufferedReader reader = new BufferedReader(new InputStreamReader(result));
                    StringBuilder out = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        out.append(line);
                    }
                    System.out.println("Input stream result: " + out.toString());
                    ObjectMapper mapper = new ObjectMapper();
                    String parsedString = out.toString().replace("\\n", "");
                    parsedString = parsedString.replace("\\", "");
//                    parsedString = parsedString.replace("\\", "");
                    parsedString = parsedString.replace(" ", "");
                    RequestDataModel formData = mapper.readValue(parsedString, RequestDataModel.class);
                    //Filling pdf file
                    ByteArrayOutputStream baos;
                    if(formData.getPrintMethod().equals("itext")){
                        baos = pdfPrinting.iTextPrinting(formData.getData(), formData.getTemplateUID(), baseUrl, formData.getPrintMethod());
                    }
                    else if(formData.getPrintMethod().equals("jasper")){
                        baos = pdfPrinting.jasperPrinting(formData.getData(), formData.getTemplateUID(), baseUrl, formData.getPrintMethod());
                    }
                    else{
                        baos = pdfPrinting.dynamicJasperPrinting(formData.getData(), baseUrl, formData.getPrintMethod());
                    }
                    if (baos!=null) {
                        InputStream is = new ByteArrayInputStream(baos.toByteArray());
                        is.close();
                        helper.addAttachment(attachment+".pdf", new ByteArrayResource(baos.toByteArray()));
                    }
                    break;
                    case "image":
                        ByteArrayOutputStream image;
                        InputStream imgStream = new URL(baseUrl+"/api/downloadFileWithoutLogin/"+attachment.getContent()).openStream();
                        if(imgStream!=null) {
                            byte[] imgArr = IOUtils.toByteArray(imgStream);
                            helper.addAttachment(attachment+".jpg", new ByteArrayResource(imgArr));
                        }
                        break;
            }

        }
//        File file = new File("/home/rockmanexe1994/Downloads/Swallows Nest.mp3");
//        helper.addAttachment(file.getName(),file);
//        Get config
//        XMLConfiguration mailServerConfigs = new XMLConfiguration("/home/rockmanexe1994/Desktop/test-printing/mail-servers.xml");
//        List<Object> servers = mailServerConfigs.getList("server");
//        System.out.println("this is server configs - " + mailServerConfigs.getDocument().toString());
        Properties propsFromFile = new Properties();
        propsFromFile.load(new FileInputStream("email-server.properties"));
        //Config host
        sender.setHost(propsFromFile.getProperty("mail.host")==null?"":propsFromFile.getProperty("mail.host"));
        sender.setUsername(propsFromFile.getProperty("mail.username")==null?"":propsFromFile.getProperty("mail.username"));
        sender.setPassword(propsFromFile.getProperty("mail.password")==null?"":propsFromFile.getProperty("mail.password"));
        sender.setPort(propsFromFile.getProperty("mail.port")==null?0:Integer.valueOf(propsFromFile.getProperty("mail.port")));
        //Additional Properties
        Properties props = new Properties();
        props.put("mail.smtp.auth", propsFromFile.getProperty("mail.props.smtp.auth")==null?null:propsFromFile.getProperty("mail.props.smtp.auth"));
        props.put("mail.smtp.starttls.enable", propsFromFile.getProperty("mail.props.smtp.starttls.enable")==null?null:propsFromFile.getProperty("mail.props.smtp.starttls.enable"));
        sender.setJavaMailProperties(props);
        sender.send(message);
    }
}
