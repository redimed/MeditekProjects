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

    //module definition
    public Hashtable getModulesDef() {
        if(this.modulesDef==null) {
            this.modulesDef = new Hashtable();
            this.modulesDef.put("3", new FormModuleModel("Functional Assessment Header", "FunctionalAssessment_Header", true, false));
            this.modulesDef.put("ModuleUID_2", new FormModuleModel("Functional Assessment Footer", "FunctionalAssessment_Footer", false, true));
            this.modulesDef.put("6", new FormModuleModel("Functional Assessment Participate Ability", "FunctionalAssessment_ParticipateAbility", false, false));
            this.modulesDef.put("5", new FormModuleModel("Functional Assessment - Range Of Motion Assessment", "FunctionalAssessment_RangeOfMotionAssessment", false, false));
            this.modulesDef.put("ModuleUID_5", new FormModuleModel("Functional Assessment - Hamstring Flexibility", "FunctionalAssessment_HamstringFlexibility", false, false));
            this.modulesDef.put("ModuleUID_6", new FormModuleModel("Functional Assessment - Upper Limb Strength Test", "FunctionalAssessment_UpperLimbStrengthTest", false, false));
            this.modulesDef.put("ModuleUID_7", new FormModuleModel("Functional Assessment - Lower Limb Function", "FunctionalAssessment_LowerLimbFunction", false, false));
            this.modulesDef.put("ModuleUID_8", new FormModuleModel("Functional Assessment - Cardiovascular Fitness", "FunctionalAssessment_CardiovascularFitness3Mins", false, false));
            this.modulesDef.put("ModuleUID_9", new FormModuleModel("Functional Assessment - Core Strength", "FunctionalAssessment_CoreStrength", false, false));
            this.modulesDef.put("ModuleUID_10", new FormModuleModel("Functional Assessment Summary - Range Of Motion", "FunctionalAssessment_Summary_RangeOfMotion", false, false));
            this.modulesDef.put("ModuleUID_11", new FormModuleModel("Functional Assessment Summary - General Physical Capacity", "FunctionalAssessment_Summary_GeneralPhysicalCapacity", false, false));
            this.modulesDef.put("ModuleUID_12", new FormModuleModel("Functional Assessment Summary - Job Specific Capacity", "FunctionalAssessment_Summary_JobSpecificCapacity", false, false));
            this.modulesDef.put("ModuleUID_13", new FormModuleModel("Functional Assessment Summary - Risk Rating", "FunctionalAssessment_Summary_RiskRating", false, false));
            this.modulesDef.put("ModuleUID_14", new FormModuleModel("Functional Assessment Doctor Info", "FunctionalAssessment_DoctorInfo", false, false));
        }
        return modulesDef;
    }
}
