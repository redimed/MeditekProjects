/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.meditek.jasper.process;

import com.lowagie.text.Image;
import com.meditek.jasper.model.FormDataModel;
import com.meditek.jasper.model.DynamicFormModuleDefinitionModel;



import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.InputStream;

import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;

import java.util.Hashtable;
import java.util.List;
import javax.imageio.ImageIO;

/**
 *
 * @author rockmanexe1994
 */
public class DataProcess {
    
    public Hashtable iTextDataParse (List<FormDataModel> data, String baseUrl) throws Exception{
        //init params
        Hashtable parsedData = new Hashtable();
        for (FormDataModel d: data){
            if(d.getType().equals("eform_input_check_checkbox")) parsedData.put(d.getName().toLowerCase(), d.getChecked()==Boolean.FALSE?"no":"yes");
            else if(d.getType().equals("eform_input_check_radio")) {
                if(d.getChecked()==Boolean.TRUE){
                    System.out.println("run true");
                    parsedData.put(d.getName().toLowerCase(), d.getValue());
                }
                else{
                    System.out.println("run false");
                }
            }
            else if(d.getType().equals("table")){
                parsedData = iTextTableParse(d, parsedData, data);
            }
            else if(d.getName().toLowerCase().contains("signature") || d.getName().toLowerCase().contains("image") || d.getType().equals("eform_input_signature") || d.getType().equals("eform_input_image_doctor")){
                com.itextpdf.text.Image imageRes;
                if(d.getValue().equals("") || d.getValue()==null){
                    byte[] imgBytes = Base64.getDecoder().decode(d.getBase64Data());
                    try {
                        imageRes=com.itextpdf.text.Image.getInstance(imgBytes);
                        parsedData.put(d.getName().toLowerCase(), imageRes);
                    }
                    catch (Exception ex){
			System.out.println(ex);
                        imageRes=null;
                    } 
                }
                else {
                    try{
                        imageRes=com.itextpdf.text.Image.getInstance(new URL(baseUrl+"/api/downloadFileWithoutLogin/"+d.getValue()));
                        parsedData.put(d.getName().toLowerCase(), imageRes);
                    }
                    catch (Exception ex){
			System.out.println(ex);
                        imageRes=null;
                    }                    
                }                
            }
            else if(d.getType().equals("eform_input_date") && (d.getValue().split("/").length)==3){
                String dateString = d.getValue().toString();
                parsedData.put(d.getName().toLowerCase()+"_date", (dateString.split("/"))[0]);
                parsedData.put(d.getName().toLowerCase()+"_month", (dateString.split("/"))[1]);
                parsedData.put(d.getName().toLowerCase()+"_year", (dateString.split("/"))[2]);
                parsedData.put(d.getName().toLowerCase(), dateString);
            }
            else if(d.getName().split("#").length > 1){
                String[] splStr = d.getName().split("#");
                int indexStart=0;
                String fillData = d.getValue().toString();
                for (int i = 1; i<splStr.length; i++){
                    try{
                        int numOfChar=Integer.parseInt(splStr[i]);
                        parsedData.put(splStr[0]+"_row"+i, fillData);
                        indexStart=indexStart+numOfChar;
                        fillData=fillData.substring(indexStart);
                    }
                    catch (Exception e){
                        break;
                    }
                }
            }
            else if(d.getType().equals("break")) continue;
            else parsedData.put(d.getName().toLowerCase(), d.getValue());
        }
        return parsedData;
    }
    
    private Hashtable iTextTableParse (FormDataModel tableTypeObj, Hashtable parsedData, List<FormDataModel> data){
        String name = tableTypeObj.getName();
        String parent = tableTypeObj.getRef();
        for(FormDataModel d : data){
            if(d.getRef().equals(parent)){
                if(d.getType().equals("eform_input_check_checkbox")) {
                    if(d.getChecked()==Boolean.TRUE){
                        parsedData.put(name+"_"+d.getRefChild().toLowerCase(), d.getValue());
                    }
                }
                else{
                    parsedData.put(name+"_"+d.getRefChild().toLowerCase(), d.getValue());
                }
            }
        }
        return parsedData;
    }
    
    public Hashtable jasperDataParse(List<FormDataModel> data, String baseUrl) throws Exception{
        Hashtable parsedData = new Hashtable();
        //init params
        List<String> tableRefs = new ArrayList<String>();
        List<FormDataModel> tableIdentity = new ArrayList<FormDataModel>();
        // find all table in data and put all the ref into tableRefs list
        for(FormDataModel d : data){
            if (d.getType().equals("table")){
                tableRefs.add(d.getRef());
                tableIdentity.add(d);
            }
        }
        // populate all tables
        for(FormDataModel d : tableIdentity){
            List<Hashtable> tableHash = jasperTableDataParse(d, d.getColumns(), d.getRows(), data);
            parsedData.put(d.getName().toLowerCase(), tableHash);
        } 
        //populate remaning data (non-table)
        for(FormDataModel d : data){
            //only if it's not table identity or not a cell in a table
            if(!(d.getType().equals("table") || tableRefs.contains(d.getRef()))){
                if(d.getName().toLowerCase().contains("signature") || d.getName().toLowerCase().contains("_image") || d.getType().equals("eform_input_signature")){
                    try{
                        
                        BufferedImage image = ImageIO.read(new URL(baseUrl+"/api/downloadFileWithoutLogin/"+d.getValue()).openStream());
                        parsedData.put(d.getName().toLowerCase(), image);
                    }
                    catch(Exception e){
			System.out.println(e);
                        // Do nothing
                    }
                }
                else if(d.getType().equals("eform_input_check_radio")) {
                    if(d.getChecked()==Boolean.TRUE){
                        System.out.println("run true");
                        parsedData.put(d.getName().toLowerCase(), d.getValue());
                    }
                    else{
                        System.out.println("run false");
                    }
                }
                else parsedData.put(d.getName().toLowerCase(), d.getValue());
            }
        }
        return parsedData;
    }
    
    public Hashtable dynamicJasperDataParse(List<FormDataModel> data, String baseUrl) throws Exception{
        Hashtable parsedData= new Hashtable();
        //init params
        List<String> tableRefs = new ArrayList<String>();
        List<FormDataModel> tableIdentity = new ArrayList<FormDataModel>();
        String[] needNameResolve = new DynamicFormModuleDefinitionModel().getModulesNeedsRadioResolve();
        // find all table in data and put all the ref into tableRefs list
        for(FormDataModel d : data){
            if (d.getType().equals("table")){
                tableRefs.add(d.getRef());
                tableIdentity.add(d);
            }
        }
        //add tables populate here later if needed
        //HERE!
        //add tables populate here later if needed
        //populate remaining data (non-table)
        Object dataObj=null;
        for (FormDataModel d : data){
            //Get data object
            if(!(d.getType().equals("table") || tableRefs.contains(d.getRef()))){
                if(d.getName().toLowerCase().contains("signature") || d.getName().toLowerCase().contains("_image") || d.getType().equals("eform_input_signature")){
//                    if(d.getValue().equals("") || d.getValue()==null){
//                    byte[] imgBytes = Base64.getDecoder().decode(d.getBase64Data());
//                    try {
//                        imageRes=com.itextpdf.text.Image.getInstance(imgBytes);
//                        parsedData.put(d.getName().toLowerCase(), imageRes);
//                    }
//                    catch (Exception ex){
//			System.out.println(ex);
//                        imageRes=null;
//                    } 
//                }
//                else {
//                    try{
//                        imageRes=com.itextpdf.text.Image.getInstance(new URL(baseUrl+"/api/downloadFileWithoutLogin/"+d.getValue()));
//                        parsedData.put(d.getName().toLowerCase(), imageRes);
//                    }
//                    catch (Exception ex){
//			System.out.println(ex);
//                        imageRes=null;
//                    }                    
//                }     
                    if(d.getValue().equals("") || d.getValue()==null){
                        try{
                            byte[] imgBytes = Base64.getDecoder().decode(d.getBase64Data());
                            InputStream is = new ByteArrayInputStream(imgBytes);
                            dataObj=is;
                        }
                        catch (Exception e){
                            dataObj=null;
                        }
                    }
                    else{
                         try{
                            BufferedImage image = ImageIO.read(new URL(baseUrl+"/api/downloadFileWithoutLogin/"+d.getValue()).openStream());
                            dataObj=image;
                        }
                        catch(Exception e){
                            dataObj=null;
                        }
                    }
                }
                else if(d.getType().equals("eform_input_check_radio")) {
                    if(d.getChecked()==Boolean.TRUE){
                        System.out.println("run true");
                        dataObj=d.getValue();
                    }
                    else{
                        System.out.println("run false");
                        dataObj=null;
                    }
                }
                else dataObj=d.getValue();
            }
            if(parsedData.get(d.getModuleID())==null){
                parsedData.put(d.getModuleID(), new Hashtable());
            }
            if(dataObj!=null){
                System.out.println("crash here: " + d.getName() + "---" + d.getValue());
                if(d.getType().equals("eform_input_check_radio") && Arrays.asList(needNameResolve).contains(d.getModuleID())){
                    ((Hashtable)parsedData.get(d.getModuleID())).put((d.getName().split("_"))[1].toLowerCase(),dataObj);
                }
                else{
                    ((Hashtable)parsedData.get(d.getModuleID())).put(d.getName().toLowerCase(),dataObj);
                }
                
            }
        }
        return parsedData;
    }
    
    private List<Hashtable> jasperTableDataParse(FormDataModel tableIdentity, int numOfCols, int numOfRows, List<FormDataModel> formData){
        List<Hashtable> parsedTable = new ArrayList<Hashtable>();
        // Illiterate over the data list to find the cell of the matching table (have matched tableRef)
        String tableRef = tableIdentity.getRef();
        Hashtable matchTableData = new Hashtable();
        for(FormDataModel d : formData){
            System.out.println(d.getRefChild()+" - "+d.getRef()+ " - "+d.getValue());
            if(d.getRef().equals(tableRef) && !d.getType().equals("table")) matchTableData.put(d.getRefChild(), d.getValue());
        }
        //Populate the table
        int tableFieldLimit = numOfRows*numOfCols;
        for(int rowIndex=0; rowIndex<numOfRows; rowIndex++){
            Hashtable rowData = new Hashtable();
            for(int colIndex=0; colIndex<numOfCols; colIndex++){
                String cellData = (matchTableData.get("field_"+rowIndex+"_"+colIndex))==null?"":(matchTableData.get("field_"+rowIndex+"_"+colIndex)).toString();
                System.out.println("this is data of row "+rowIndex+" col "+colIndex+" : "+cellData);
                rowData.put("value"+String.valueOf(colIndex), cellData);
            }
            parsedTable.add(rowData);
        }
        System.out.println("Number of rows: "+parsedTable.size());
        for(Hashtable hash : parsedTable){
            System.out.println("Size of dictionary: "+hash.size());
        }
        return parsedTable;
    }
    
    
}
