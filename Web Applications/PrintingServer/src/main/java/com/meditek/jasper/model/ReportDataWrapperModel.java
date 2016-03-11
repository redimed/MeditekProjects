/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.meditek.jasper.model;

import java.util.Hashtable;

/**
 *
 * @author rockmanexe1994
 */
public class ReportDataWrapperModel {
//    PatientModel patient;
//    PatientKinModel patientKin;
    
    Hashtable patient;
    Hashtable patientKin;
    Hashtable employment;
    Hashtable otherFormData;

//    public PatientKinModel getPatientKin() {
//        return patientKin;
//    }
//
//    public void setPatientKin(PatientKinModel patientKin) {
//        this.patientKin = patientKin;
//    }
//
//    public PatientModel getPatient() {
//        return patient;
//    }
//
//    public void setPatient(PatientModel patient) {
//        this.patient = patient;
//    }

    public Hashtable getPatient() {
        return patient;
    }

    public void setPatient(Hashtable patient) {
        this.patient = patient;
    }

    public Hashtable getPatientKin() {
        return patientKin;
    }

    public void setPatientKin(Hashtable patientKin) {
        this.patientKin = patientKin;
    }

    public Hashtable getEmployment() {
        return employment;
    }

    public void setEmployment(Hashtable employment) {
        this.employment = employment;
    }

    public Hashtable getOtherFormData() {
        return otherFormData;
    }

    public void setOtherFormData(Hashtable otherFormData) {
        this.otherFormData = otherFormData;
    }
    
}
