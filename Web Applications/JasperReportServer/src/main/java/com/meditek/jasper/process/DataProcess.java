/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.meditek.jasper.process;

import com.meditek.jasper.model.PatientKinModel;
import com.meditek.jasper.model.PatientModel;
import com.meditek.jasper.model.ReportDataWrapperModel;

import java.util.Dictionary;
import java.util.Enumeration;

/**
 *
 * @author rockmanexe1994
 */
public class DataProcess {
    public ReportDataWrapperModel DataParse(Dictionary requestData){
        ReportDataWrapperModel reportData = new ReportDataWrapperModel();
        PatientModel patientInfo = new PatientModel();
        PatientKinModel patientKinInfo = new PatientKinModel();
        
//        Begin parsing data
        for (Enumeration data = requestData.keys(); data.hasMoreElements();){
            String key = (String)data.nextElement();
            String lowerKey = key.toLowerCase();
//            System.out.println("Key: "+key +" Value: " + requestData.get(key));
            if (lowerKey.contains(".patientinfo.")){
//                For patientInfo
                if(lowerKey.contains("title")) patientInfo.setTitle(requestData.get(key).toString());
                else if(lowerKey.contains("lastname") || lowerKey.contains("familyname")) patientInfo.setLastName(requestData.get(key).toString());
                else if(lowerKey.contains("firstname") || lowerKey.contains("givenname")) patientInfo.setFirstName(requestData.get(key).toString());
                else if(lowerKey.contains("dob") || lowerKey.contains("dateofbirth")) patientInfo.setDateOfBirth(requestData.get(key).toString());
                else if(lowerKey.contains("age")) patientInfo.setAge(requestData.get(key).toString());
                else if(lowerKey.contains("address1")) patientInfo.setAddress1(requestData.get(key).toString());
                else if(lowerKey.contains("address2")) patientInfo.setAddress2(requestData.get(key).toString());
                else if(lowerKey.contains("suburb")) patientInfo.setSuburb(requestData.get(key).toString());
                else if(lowerKey.contains("postcode")) patientInfo.setPostCode(requestData.get(key).toString());
                else if(lowerKey.contains("homephone")) patientInfo.setHomePhone(requestData.get(key).toString());
                else if(lowerKey.contains("mobilephone")) patientInfo.setMobilePhone(requestData.get(key).toString());
                else if(lowerKey.contains("workphone")) patientInfo.setWorkPhone(requestData.get(key).toString());
            }
            else if (lowerKey.contains(".patientkin.")){
//                For patientKin
                if(lowerKey.contains("lastname") || lowerKey.contains("familyname")) patientKinInfo.setLastName(requestData.get(key).toString());
                else if(lowerKey.contains("middlename")) patientKinInfo.setMiddleName(requestData.get(key).toString());
                else if(lowerKey.contains("lastname") || lowerKey.contains("givenname")) patientKinInfo.setFirstName(requestData.get(key).toString());
                else if(lowerKey.contains("address1")) patientKinInfo.setAddress1(requestData.get(key).toString());
                else if(lowerKey.contains("address2")) patientKinInfo.setAddress2(requestData.get(key).toString());
                else if(lowerKey.contains("suburb")) patientKinInfo.setSuburb(requestData.get(key).toString());
                else if(lowerKey.contains("postcode")) patientKinInfo.setPostCode(requestData.get(key).toString());
                else if(lowerKey.contains("homephone")) patientKinInfo.setHomePhone(requestData.get(key).toString());
                else if(lowerKey.contains("mobilephone")) patientKinInfo.setMobilePhone(requestData.get(key).toString());
                else if(lowerKey.contains("state")) patientKinInfo.setState(requestData.get(key).toString());
                else if(lowerKey.contains("country")) patientKinInfo.setCountry(requestData.get(key).toString());
            }
        }
        
        reportData.setPatient(patientInfo);
        reportData.setPatientKin(patientKinInfo);
        
        return reportData;
    }
}