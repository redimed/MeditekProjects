/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.meditek.jasper.model;

import java.util.Hashtable;
import com.meditek.jasper.model.FormModuleModel;

/**
 *
 * @author rockmanexe1994
 */
public class DynamicFormModuleDefinitionModel {
    Hashtable modulesDef;
    String[] modulesNeedsRadioResolve;

    //module definition
    public Hashtable getModulesDef() {
        if(this.modulesDef==null) {
            this.modulesDef = new Hashtable();
            this.modulesDef.put("3", new FormModuleModel("Functional Assessment Header", "FunctionalAssessment_Header", true, false));
            this.modulesDef.put("footer", new FormModuleModel("Functional Assessment Footer", "FunctionalAssessment_Footer", false, true));
            this.modulesDef.put("6", new FormModuleModel("Functional Assessment Participate Ability", "FunctionalAssessment_ParticipateAbility", false, false));
            this.modulesDef.put("5", new FormModuleModel("Functional Assessment - Range Of Motion Assessment", "FunctionalAssessment_RangeOfMotionAssessment", false, false));
            this.modulesDef.put("8", new FormModuleModel("Functional Assessment - Hamstring Flexibility", "FunctionalAssessment_HamstringFlexibility", false, false));
            this.modulesDef.put("9", new FormModuleModel("Functional Assessment - Upper Limb Strength Test", "FunctionalAssessment_UpperLimbStrengthTest", false, false));
            this.modulesDef.put("11", new FormModuleModel("Functional Assessment - Lower Limb Function", "FunctionalAssessment_LowerLimbFunction", false, false));
            this.modulesDef.put("15", new FormModuleModel("Functional Assessment - Cardiovascular Fitness", "FunctionalAssessment_CardiovascularFitness3Mins", false, false));
            this.modulesDef.put("18", new FormModuleModel("Functional Assessment - Core Strength", "FunctionalAssessment_CoreStrength", false, false));
            this.modulesDef.put("19", new FormModuleModel("Functional Assessment - Floor to Waist Lift", "FunctionalAssessment_Lift_FloorToWaist", false, false));
            this.modulesDef.put("20", new FormModuleModel("Functional Assessment - Carrying at Waist Height", "FunctionalAssessment_Carrying_WaistHeight", false, false));
            this.modulesDef.put("21", new FormModuleModel("Functional Assessment - Bilateral Lifting Waist to Shoulder Height", "FunctionalAssessment_Lift_WaistToShoulder", false, false));
            this.modulesDef.put("22", new FormModuleModel("Functional Assessment - Bilateral Lifting Shoulder to Overhead Weight", "FunctionalAssessment_Lift_ShoulderToOverHead", false, false));
            this.modulesDef.put("23", new FormModuleModel("Functional Assessment - Cable Row and Rotation in Trunk Extension", "FunctionalAssessment_CableRow_Rotation_TrunkExtension", false, false));
            this.modulesDef.put("24", new FormModuleModel("Functional Assessment - Dynamic Push/Pull", "FunctionalAssessment_Dynamic_Push_Pull", false, false));
            this.modulesDef.put("25", new FormModuleModel("Functional Assessment - Repetitive Ladder/ High Step-Up with 3 pt Contact", "FunctionalAssessment_High_Step_Up", false, false));
            this.modulesDef.put("26", new FormModuleModel("Functional Assessment - Repetitive wrist flexion/extension (Subtained above Shoulder Height)", "FunctionalAssessment_Wrist_Flexion", false, false));
            this.modulesDef.put("27", new FormModuleModel("Functional Assessment - Sustanied Kneel + Crawl", "FunctionalAssessment_Sustained_Kneel_Crawl", false, false));
            this.modulesDef.put("28", new FormModuleModel("Functional Assessment - Bilateral sustained above shoulder hold (5kg)", "FunctionalAssessment_Bilateral_Sustained_Above_Shoulder_Hold", false, false));
            this.modulesDef.put("29", new FormModuleModel("Functional Assessment - Bilateral Supine Chest Press (Dumbbells)", "FunctionalAssessment_Bilateral_Supine_Chest_Press", false, false));
            this.modulesDef.put("30", new FormModuleModel("Functional Assessment - Sustanied Kneel", "FunctionalAssessment_Sustained_Kneel", false, false));
            this.modulesDef.put("31", new FormModuleModel("Functional Assessment - Ladder Climb", "FunctionalAssessment_Ladder_Climb", false, false));
            this.modulesDef.put("32", new FormModuleModel("Functional Assessment - Deadlift", "FunctionalAssessment_Deadlift", false, false));
            this.modulesDef.put("33", new FormModuleModel("Functional Assessment - Unilateral Carry", "FunctionalAssessment_Unilateral_Carry", false, false));
            this.modulesDef.put("17", new FormModuleModel("Functional Assessment - Overall Manual Handling Rating", "FunctionalAssessment_Overral_Manual_Handling", false, false));
            this.modulesDef.put("10", new FormModuleModel("Functional Assessment Summary - Range Of Motion", "FunctionalAssessment_Summary_RangeOfMotion", false, false));
            this.modulesDef.put("12", new FormModuleModel("Functional Assessment Summary - General Physical Capacity", "FunctionalAssessment_Summary_GeneralPhysicalCapacity", false, false));
            this.modulesDef.put("13", new FormModuleModel("Functional Assessment Summary - Job Specific Capacity", "FunctionalAssessment_Summary_JobSpecificCapacity", false, false));
            this.modulesDef.put("14", new FormModuleModel("Functional Assessment Summary - Risk Rating", "FunctionalAssessment_Summary_RiskRating", false, false));
            this.modulesDef.put("34", new FormModuleModel("Functional Assessment Doctor Info", "FunctionalAssessment_DoctorInfo", false, false));
        }
        return modulesDef;
    }

    public String[] getModulesNeedsRadioResolve() {
        if (this.modulesNeedsRadioResolve==null || this.modulesNeedsRadioResolve.length==0){
            this.modulesNeedsRadioResolve = new String[]{"19","20","21","22","23","24","25","26","27","28","29","30","31","32","33"};
        }
        return modulesNeedsRadioResolve;
    }
    
}
