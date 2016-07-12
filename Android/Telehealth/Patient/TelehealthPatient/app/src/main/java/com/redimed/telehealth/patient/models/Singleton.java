package com.redimed.telehealth.patient.models;

import com.redimed.telehealth.patient.utlis.UploadFile;

import java.util.ArrayList;

/**
 * Created by MeditekMini on 6/20/16.
 */
public class Singleton {

    private ArrayList<CustomGallery> customGalleries;
    private static Singleton singletonInstance = null;
    private ArrayList<EFormData> EFormDatas, EFormInjury, EFormMedicalHistory, EFormInjurySymptoms, EFormBodyParts, EFormPatient, EFormSymptoms;

    private Singleton() {
        customGalleries = new ArrayList<>();

        EFormDatas = new ArrayList<>();
        EFormInjury = new ArrayList<>();
        EFormPatient = new ArrayList<>();
        EFormSymptoms = new ArrayList<>();
        EFormBodyParts = new ArrayList<>();
        EFormMedicalHistory = new ArrayList<>();
        EFormInjurySymptoms = new ArrayList<>();
    }

    public static Singleton getInstance() {
        if (singletonInstance == null) {
            singletonInstance = new Singleton();
        }
        return singletonInstance;
    }

    public ArrayList<CustomGallery> getCustomGalleries() {
        return customGalleries;
    }

    public void setCustomGalleries(ArrayList<CustomGallery> customGalleries) {
        this.customGalleries = customGalleries;
    }

    public void addEFormDatas(ArrayList<EFormData> EFormDatas) {
        this.EFormDatas.addAll(EFormDatas);
    }

    public void clearAll() {
        singletonInstance = null;
    }

    public ArrayList<EFormData> getEFormDatas() {
        return EFormDatas;
    }

    public void setEFormDatas(ArrayList<EFormData> EFormDatas) {
        this.EFormDatas = EFormDatas;
    }

    public ArrayList<EFormData> getEFormPatient() {
        return EFormPatient;
    }

    public void setEFormPatient(ArrayList<EFormData> EFormPatient) {
        this.EFormPatient = EFormPatient;
    }

    public ArrayList<EFormData> getEFormInjury() {
        return EFormInjury;
    }

    public void setEFormInjury(ArrayList<EFormData> EFormInjury) {
        this.EFormInjury = EFormInjury;
    }

    public ArrayList<EFormData> getEFormMedicalHistory() {
        return EFormMedicalHistory;
    }

    public void setEFormMedicalHistory(ArrayList<EFormData> EFormMedicalHistory) {
        this.EFormMedicalHistory = EFormMedicalHistory;
    }

    public ArrayList<EFormData> getEFormSymptoms() {
        return EFormSymptoms;
    }

    public void setEFormSymptoms(ArrayList<EFormData> EFormSymptoms) {
        this.EFormSymptoms = EFormSymptoms;
    }

    public ArrayList<EFormData> getEFormInjurySymptoms() {
        return EFormInjurySymptoms;
    }

    public void setEFormInjurySymptoms(ArrayList<EFormData> EFormInjurySymptoms) {
        this.EFormInjurySymptoms = EFormInjurySymptoms;
    }

    public ArrayList<EFormData> getEFormBodyParts() {
        return EFormBodyParts;
    }

    public void setEFormBodyParts(ArrayList<EFormData> EFormBodyParts) {
        this.EFormBodyParts = EFormBodyParts;
    }
}


