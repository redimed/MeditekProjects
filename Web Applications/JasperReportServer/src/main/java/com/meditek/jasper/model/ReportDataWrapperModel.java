/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.meditek.jasper.model;

/**
 *
 * @author rockmanexe1994
 */
public class ReportDataWrapperModel {
    PatientModel patient;
    PatientKinModel patientKin;

    public PatientKinModel getPatientKin() {
        return patientKin;
    }

    public void setPatientKin(PatientKinModel patientKin) {
        this.patientKin = patientKin;
    }

    public PatientModel getPatient() {
        return patient;
    }

    public void setPatient(PatientModel patient) {
        this.patient = patient;
    }
}
