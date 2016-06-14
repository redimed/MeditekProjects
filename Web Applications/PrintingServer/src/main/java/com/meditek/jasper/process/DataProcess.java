/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.meditek.jasper.process;

import com.meditek.jasper.model.FormDataModel;
import com.meditek.jasper.model.DynamicFormModuleDefinitionModel;



import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.InputStream;

import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.HashMap;

import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import javax.imageio.ImageIO;

/**
 *
 * @author rockmanexe1994
 */
public class DataProcess {
    
    private Map iTextTableParse (FormDataModel tableTypeObj, List<FormDataModel> data){
        Map tableData = new HashMap();
        String name = tableTypeObj.getName();
        String parent = tableTypeObj.getRef();
        for(FormDataModel d : data){
            if(d.getRef().equals(parent)){
                if(d.getType().equals("eform_input_check_checkbox")) {
                    if(d.getChecked()==Boolean.TRUE){
                        tableData.put(name+"_"+d.getRefChild().toLowerCase(), d.getValue());
                    }
                }
                else{
                    tableData.put(name+"_"+d.getRefChild().toLowerCase(), d.getValue());
                }
            }
        }
        return tableData;
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
    
    public Hashtable dataParse(List<FormDataModel> data, String baseUrl, String printMethod){
        Hashtable parsedData = new Hashtable();
        //Get table ref
        List<String> tableRefs = new ArrayList<String>();
        List<FormDataModel> tableIdentity = new ArrayList<FormDataModel>();
        // Get module list that need name fixing
        String[] needNameResolve = new DynamicFormModuleDefinitionModel().getModulesNeedsRadioResolve();
        // find all table in data and put all the ref into tableRefs list
        for(FormDataModel d : data){
            if (d.getType().equals("table")){
                if (!tableRefs.contains(d.getRef())) tableRefs.add(d.getRef());
                if (!tableIdentity.contains(d))tableIdentity.add(d);
            }
        }
        // Populate table
        for(FormDataModel d : tableIdentity){
            switch (printMethod.toLowerCase()){
                case "itext": 
                    parsedData.putAll(iTextTableParse(d, data));
                    break;
                case "jasper": 
                    List<Hashtable> tableHash = jasperTableDataParse(d, d.getColumns(), d.getRows(), data);
                    parsedData.put(d.getName().toLowerCase(), tableHash);
                    break;
                case "dynamicjasper": break;
            }
        }     
        // Populate other data (non-table data)
        Object dataObj = null;
        for (FormDataModel d : data){
            if(!(d.getType().equals("table") || tableRefs.contains(d.getRef()))){
                // Populate image
                if(d.getName().toLowerCase().contains("signature") || d.getName().toLowerCase().contains("image") || d.getType().equals("eform_input_signature") || d.getType().equals("eform_input_image_doctor")){
                    //Base64 image
                    if(d.getValue().equals("") || d.getValue()==null){
                        if(printMethod.toLowerCase().equals("itext")){
                            byte[] imgBytes = Base64.getDecoder().decode(d.getBase64Data());
                            try {
                                dataObj=com.itextpdf.text.Image.getInstance(imgBytes);
                            }
                            catch (Exception ex){
                                System.out.println(ex);
                                dataObj=null;
                            } 
                        }
                        else {
                            try{
                                byte[] imgBytes = Base64.getDecoder().decode(d.getBase64Data());
                                InputStream is = new ByteArrayInputStream(imgBytes);
                                dataObj=is;
                            }
                            catch (Exception ex){
                                System.out.println(ex);
                                dataObj=null;
                            }
                        }
                    }
                    // Non-Base64 image
                    else { 
                        if(printMethod.toLowerCase().equals("itext")){
                            try{
                                dataObj=com.itextpdf.text.Image.getInstance(new URL(baseUrl+"/api/downloadFileWithoutLogin/"+d.getValue()));
                            }
                            catch (Exception ex){
                                System.out.println(ex);
                                dataObj=null;
                            }        
                        }
                        else {
                            try{
                                BufferedImage image = ImageIO.read(new URL(baseUrl+"/api/downloadFileWithoutLogin/"+d.getValue()).openStream());
                                dataObj=image;
                            }
                            catch(Exception ex){
                                System.out.println(ex);
                                dataObj=null;
                            }
                        }
                    }
                }
                //Checkbox
                else if(d.getType().equals("eform_input_check_checkbox")){
                    if(d.getChecked()==Boolean.TRUE){
                        dataObj=d.getValue();
                    }
                }
                // Radio button
                else if(d.getType().equals("eform_input_check_radio")) {
                    if(d.getChecked()==Boolean.TRUE){
                        dataObj=d.getValue();
                    }
                }
                //Remaining data
                else dataObj=d.getValue();
                
                // Add to parsedData
                switch (printMethod.toLowerCase()){
                    case "itext":
                    case "jasper":
                        if(dataObj!=null) parsedData.put(d.getName().toLowerCase(), dataObj);
                        break;
                    case "dynamicjasper":
                        if(parsedData.get(d.getModuleID())==null){
                            parsedData.put(d.getModuleID(), new Hashtable());
                        }
                        if(dataObj!=null){
                            if(d.getType().equals("eform_input_check_radio") && Arrays.asList(needNameResolve).contains(d.getModuleID())){
                                ((Hashtable)parsedData.get(d.getModuleID())).put((d.getName().split("_"))[1].toLowerCase(),dataObj);
                            }
                            else{
                                ((Hashtable)parsedData.get(d.getModuleID())).put(d.getName().toLowerCase(),dataObj);
                            }

                        }
                        break;
                }
                
                // Itext special data
                if(d.getType().equals("eform_input_date") && (d.getValue().split("/").length)==3){
                    String dateString = d.getValue().toString();
                    parsedData.put(d.getName().toLowerCase()+"_date", (dateString.split("/"))[0]);
                    parsedData.put(d.getName().toLowerCase()+"_month", (dateString.split("/"))[1]);
                    parsedData.put(d.getName().toLowerCase()+"_year", (dateString.split("/"))[2]);
                }
                if(d.getName().split("#").length > 1){
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
            }
        }
        return parsedData;
    }   
}
