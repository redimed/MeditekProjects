/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.meditek.jasper.process;

import com.meditek.jasper.model.FormDataModel;
import com.meditek.jasper.model.PatientKinModel;
import com.meditek.jasper.model.PatientModel;
import com.meditek.jasper.model.ReportDataWrapperModel;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;

import java.util.Dictionary;
import java.util.Enumeration;
import java.util.Hashtable;
import java.util.List;

/**
 *
 * @author rockmanexe1994
 */
public class DataProcess {
    
    public Hashtable iTextDataParse (List<FormDataModel> data){
        Hashtable parsedData = new Hashtable();
        for (FormDataModel d: data){
            if(d.getType().equals("clh")) parsedData.put(d.getName().toLowerCase(), d.getValue());
            else if(d.getType().equals("rlh")) {
                if(d.getChecked()==Boolean.TRUE){
                    System.out.println("run true");
                    parsedData.put(d.getName().toLowerCase(), d.getValue());
                }
                else{
                    System.out.println("run false");

                }
                
            }
            else if(d.getType().equals("break")) continue;
            else parsedData.put(d.getName().toLowerCase(), d.getValue());
        }
        return parsedData;
    }
    
    public ReportDataWrapperModel jasperDataParse(List<FormDataModel> data){
        ReportDataWrapperModel parsedData = new ReportDataWrapperModel();
        for(FormDataModel d : data){
            //For patient info
            if(d.getName().contains("p_")){
                if(d.getType().equals("rlh") && d.getChecked()==Boolean.TRUE) parsedData.getPatient().put(d.getName().toLowerCase(), d.getValue());
                else if(d.getType().equals("break")) continue;
                else parsedData.getPatient().put(d.getName().toLowerCase(), d.getValue());
            }
            // For patient kin info
            else if (d.getName().contains("k_")){
                if(d.getType().equals("rlh") && d.getChecked()==Boolean.TRUE) parsedData.getPatientKin().put(d.getName().toLowerCase(), d.getValue());
                else if(d.getType().equals("break")) continue;
                else parsedData.getPatientKin().put(d.getName().toLowerCase(), d.getValue());
            }
            // For employee/employment info
            else if (d.getName().contains("e_")){
                if(d.getType().equals("rlh") && d.getChecked()==Boolean.TRUE) parsedData.getEmployment().put(d.getName().toLowerCase(), d.getValue());
                else if(d.getType().equals("break")) continue;
                else parsedData.getEmployment().put(d.getName().toLowerCase(), d.getValue());
            }
            // For other form data
            else{
                if(d.getType().equals("rlh") && d.getChecked()==Boolean.TRUE) parsedData.getOtherFormData().put(d.getName().toLowerCase(), d.getValue());
                else if(d.getType().equals("break")) continue;
                else if (d.getType().equals("table")){
                    List<Hashtable> tableData = this.tableDataParse(data, d.getRef(), d.getColumns());
                    parsedData.getOtherFormData().put(d.getName(), tableData);
                }
                else parsedData.getOtherFormData().put(d.getName().toLowerCase(), d.getValue());
            }
        }
        return parsedData;
    }
    
    private List<Hashtable> tableDataParse(List<FormDataModel> data, String tableRef, int numOfCol){
        List<Hashtable> parsedData = new ArrayList<Hashtable>();
        // Illiterate over the data list to find the cell of the matching table (have matched tableRef)
        List<FormDataModel> matchTableData = new ArrayList<FormDataModel>();
        for(FormDataModel d : data){
            if(d.getRef().equals(tableRef)) matchTableData.add(d);
        }
        // Get the number of cells on a row
        int numOfCells = matchTableData.size();
        int numOfCellsOnARow = numOfCells/numOfCol;
        // Populate to the list format that i wanted
        int indexCount = 1;
        Hashtable rowData = new Hashtable();
        for(FormDataModel d : matchTableData){
            String key = "value" + String.valueOf(indexCount);
            rowData.put(key, d.getValue());
            if(indexCount<=numOfCellsOnARow){
                indexCount++;
            }
            else{
                parsedData.add(rowData);
                indexCount=1;
                rowData.clear();
            }
        }
        return parsedData;
    }
    
//    public ReportDataWrapperModel DataParsebk(Dictionary requestData){
//        ReportDataWrapperModel reportData = new ReportDataWrapperModel();
//        PatientModel patientInfo = new PatientModel();
//        PatientKinModel patientKinInfo = new PatientKinModel();
//        
////        Begin parsing data
//        for (Enumeration data = requestData.keys(); data.hasMoreElements();){
//            String key = (String)data.nextElement();
//            String lowerKey = key.toLowerCase();
////            System.out.println("Key: "+key +" Value: " + requestData.get(key));
//            if (lowerKey.contains(".patientinfo.")){
////                For patientInfo
//                if(lowerKey.contains("title")) patientInfo.setTitle(requestData.get(key).toString());
//                else if(lowerKey.contains("lastname") || lowerKey.contains("familyname")) patientInfo.setLastName(requestData.get(key).toString());
//                else if(lowerKey.contains("firstname") || lowerKey.contains("givenname")) patientInfo.setFirstName(requestData.get(key).toString());
//                else if(lowerKey.contains("dob") || lowerKey.contains("dateofbirth")) patientInfo.setDateOfBirth(requestData.get(key).toString());
//                else if(lowerKey.contains("age")) patientInfo.setAge(requestData.get(key).toString());
//                else if(lowerKey.contains("address1")) patientInfo.setAddress1(requestData.get(key).toString());
//                else if(lowerKey.contains("address2")) patientInfo.setAddress2(requestData.get(key).toString());
//                else if(lowerKey.contains("suburb")) patientInfo.setSuburb(requestData.get(key).toString());
//                else if(lowerKey.contains("postcode")) patientInfo.setPostCode(requestData.get(key).toString());
//                else if(lowerKey.contains("homephone")) patientInfo.setHomePhone(requestData.get(key).toString());
//                else if(lowerKey.contains("mobilephone")) patientInfo.setMobilePhone(requestData.get(key).toString());
//                else if(lowerKey.contains("workphone")) patientInfo.setWorkPhone(requestData.get(key).toString());
//            }
//            else if (lowerKey.contains(".patientkin.")){
////                For patientKin
//                if(lowerKey.contains("lastname") || lowerKey.contains("familyname")) patientKinInfo.setLastName(requestData.get(key).toString());
//                else if(lowerKey.contains("middlename")) patientKinInfo.setMiddleName(requestData.get(key).toString());
//                else if(lowerKey.contains("lastname") || lowerKey.contains("givenname")) patientKinInfo.setFirstName(requestData.get(key).toString());
//                else if(lowerKey.contains("address1")) patientKinInfo.setAddress1(requestData.get(key).toString());
//                else if(lowerKey.contains("address2")) patientKinInfo.setAddress2(requestData.get(key).toString());
//                else if(lowerKey.contains("suburb")) patientKinInfo.setSuburb(requestData.get(key).toString());
//                else if(lowerKey.contains("postcode")) patientKinInfo.setPostCode(requestData.get(key).toString());
//                else if(lowerKey.contains("homephone")) patientKinInfo.setHomePhone(requestData.get(key).toString());
//                else if(lowerKey.contains("mobilephone")) patientKinInfo.setMobilePhone(requestData.get(key).toString());
//                else if(lowerKey.contains("state")) patientKinInfo.setState(requestData.get(key).toString());
//                else if(lowerKey.contains("country")) patientKinInfo.setCountry(requestData.get(key).toString());
//            }
//        }
//        
//        reportData.setPatient(patientInfo);
//        reportData.setPatientKin(patientKinInfo);
//        
//        return reportData;
//    }
    
    
}