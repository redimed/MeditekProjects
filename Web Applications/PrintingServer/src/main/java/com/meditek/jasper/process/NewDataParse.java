/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.meditek.jasper.process;

import com.meditek.jasper.model.NewFormDataModel;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.imageio.ImageIO;

/**
 *
 * @author rockmanexe1994
 */
public final class NewDataParse {

    private NewDataParse() {
    }
    
    // Main method for parsing data
    // Input: a list of raw data, baseUrl (for image parsing) and print method
    // Output: parsed data in a Hashtable
    public static Hashtable dataParse(List<NewFormDataModel> data, String baseUrl, String printMethod){
        Hashtable parsedData = new Hashtable();
        for(NewFormDataModel d : data){
            parsedData.put(d.getName().toLowerCase(),objectParse(d, baseUrl, printMethod));
        }
        System.out.println("this is final parsed data: "+ parsedData);
        return parsedData;
    }
    
    // Parsed each data based on it's type
    // Input: a raw data object, baseUrl (for parsing image) and print method
    // Output: an object contain parsed data
    private static Object objectParse(NewFormDataModel obj, String baseUrl, String printMethod){
        Object parsedObj=null;
        switch (obj.getType().toLowerCase()){
            case "normal_image":
                parsedObj=imageNormalParsing(obj.getValue(), baseUrl, printMethod);
                break;
            case "base64_image":
                parsedObj=imageBase64Parsing(obj.getValue(), printMethod);
                break;
            case "repeat":
                parsedObj=repeatParsing(obj.getValue(), baseUrl, printMethod);
                break;
            case "image_array":
                parsedObj=imageArrayParsing(obj.getValue(), baseUrl, printMethod);
                break;
            default:
                parsedObj=obj.getValue();
                break;
        }
        return parsedObj;
    }
    
    //Data parsed for each type
    
    // Parse normal image based on print method
    // Input: an object contain a raw data, base url and print method
    // Output: an object contain parsed image.
    private static Object imageNormalParsing(Object dataObj, String baseUrl, String printMethod){
        String imageString = dataObj.toString();
        Object parsedImg = new Object();
        // Process image data based on print type
        switch (printMethod.toLowerCase()){
            case "jasper":
                try {
                    parsedImg = ImageIO.read(new URL(baseUrl+"/api/downloadFileWithoutLogin/"+imageString).openStream());
                } catch (IOException ex) {
                    Logger.getLogger(NewDataParse.class.getName()).log(Level.SEVERE, null, ex);
                    parsedImg = null;
                }
                break;
        }
        return parsedImg;
    }
    
    // Parse base64 image string base on print method
    // Input: an object contain raw data, print method
    // Output: an object contain parsed image
    private static Object imageBase64Parsing(Object dataObj, String printMethod){
        String base64String = dataObj.toString();
        Object parsedImg = new Object();
        // Process base64 image data base on print type
        switch (printMethod.toLowerCase()){
            case "jasper":
                byte[] imgBytes = Base64.getDecoder().decode(base64String);
                parsedImg = new ByteArrayInputStream(imgBytes);
                break;
        }
        return parsedImg;
    }
    
    // Parse an array of images based on print method
    // Input: an object image UID, baseUrl and print method
    // Output: an object contain parsed image array.
    private static Object imageArrayParsing(Object dataObj, String baseUrl, String printMethod){
        List<HashMap> imageArray = (List<HashMap>)dataObj;
        ArrayList<Hashtable> parsedImgArr = new ArrayList<Hashtable>();
        if (imageArray==null) return parsedImgArr;
        for(HashMap image : imageArray){
            System.out.println("this is image: " + image.toString());
            Hashtable parsedHash = new Hashtable();
            Object parsedImg = imageNormalParsing(image.get("value"), "https://meditek.redimed.com.au:3005", printMethod);
            if (parsedImg != null){
                parsedHash.put("value", parsedImg);
            }
                parsedImgArr.add(parsedHash);
        }
        return parsedImgArr;
    }
    
    // Parse data for a section that repeat continuously many times in the report (not for module that appear multiple times)
    // Input: an object contain the list of the repeat data, base url (for image parsing), print method
    // Output: an object contain a list of hashtables of the parsed data.
    private static Object repeatParsing(Object dataObj, String baseUrl, String printMethod){
        List<ArrayList<HashMap>> data = (List<ArrayList<HashMap>>)dataObj;
        List<Hashtable> parsedData = new ArrayList<Hashtable>(); //Hashtable
        for(List<HashMap> l : data){
            Hashtable parsedHash = new Hashtable();
            for(HashMap d : l){
                Object parsedObj = objectParse(new NewFormDataModel( d.get("type").toString(), d.get("value")), baseUrl, printMethod);
                if (parsedObj != null) parsedHash.put(d.get("name").toString().toLowerCase(), parsedObj);
            }
            parsedData.add(parsedHash);
        }
        return parsedData;
    }
    
//    private static Object tableParsing(){
//        return null;
//    }
//    
//    private static Object moduleParsing(){
//        return null;
//    }
}
