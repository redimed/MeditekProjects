//
//  InjuryViewController.swift
//  UrgentCare Work
//
//  Created by Meditek on 6/14/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit
import ObjectMapper

class InjuryViewController: UIViewController {
    
    @IBOutlet weak var viewMedicalHistory: UIView!
    @IBOutlet weak var viewDescribeInjury: UIView!
    @IBOutlet weak var viewInjurySymptoms: UIView!
    @IBOutlet weak var viewTableLeg: UIView!
    @IBOutlet weak var viewTableArm: UIView!
    @IBOutlet weak var viewTableHandShoulder: UIView!
    @IBOutlet weak var viewOtherBody: UIView!
    
    
    @IBOutlet weak var sliderPain: UISlider!
    @IBOutlet weak var txtOtherBodyPart: UITextField!
    @IBOutlet weak var txtInitalTreatment: UITextField!
    @IBOutlet weak var txtPain: UITextField!
    @IBOutlet weak var txtOtherInjurySymptoms: UITextField!
    @IBOutlet weak var txtAllergiesYesValue: UITextField!
    @IBOutlet weak var txtMedicationValue: UITextField!
    @IBOutlet weak var txtOtherMedicalHistory: UITextField!
    @IBOutlet weak var txtOtherDescribleInjury: UITextField!
    @IBOutlet weak var txtWhatAcctually: UITextField!
    @IBOutlet weak var txtWorkplace: UITextField!
    @IBOutlet weak var txtDateOfAccident: UITextField!
    
    var datePicker = UIDatePicker()
    var DataPatientInjuryOrGeneral = General()
    var InjuryDataHard = General()
    var InjuryDataChange = General()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        SetUpCustomLayout()
    }
    override func shouldAutorotate() -> Bool {
        return false
    }
    func canRotate() -> Void {
        
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    func GetdataInform(){
        
        AllRedisiteData.general.removeAll()
        InjuryData.general.removeAll()
        
        InjuryDataHard.general.append(Context.EformtData("yes", name: "is_sprain", ref: "field_2_4_1", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_4"))
        InjuryDataHard.general.append(Context.EformtData("yes", name: "is_laceration", ref: "field_2_4_2", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_4"))
        InjuryDataHard.general.append(Context.EformtData("yes", name: "is_crush", ref: "field_2_5_3", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_5"))
        InjuryDataHard.general.append(Context.EformtData("yes", name: "is_fall", ref: "field_2_5_4", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_5"))
        
        InjuryDataHard.general.append(Context.EformtData("yes", name: "is_allergies", ref: "field_2_20_2", type: "eform_input_check_radio", checked: "true", refRow: "row_2_20"))
        InjuryDataHard.general.append(Context.EformtData("no", name: "is_allergies", ref: "field_2_20_1", type: "eform_input_check_radio", checked: "true", refRow: "row_2_20"))
        
        InjuryDataHard.general.append(Context.EformtData("yes", name: "is_medic", ref: "field_2_19_2", type: "eform_input_check_radio", checked: "true", refRow: "row_2_19"))
        InjuryDataHard.general.append(Context.EformtData("no", name: "is_medic", ref: "field_2_19_1", type: "eform_input_check_radio", checked: "true", refRow: "row_2_19"))
        
        InjuryDataHard.general.append(Context.EformtData("yes", name: "is_sym_before", ref: "field_2_7_1", type: "eform_input_check_radio", checked: "true", refRow: "row_2_7"))
        InjuryDataHard.general.append(Context.EformtData("no", name: "is_sym_before", ref: "field_2_7_2", type: "eform_input_check_radio", checked: "false", refRow: "row_2_7"))
        
        InjuryDataHard.general.append(Context.EformtData("yes", name: "part1", ref: "field_2_9_0", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_9"))
        InjuryDataHard.general.append(Context.EformtData("yes", name: "part2", ref: "field_2_9_1", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_9"))
        InjuryDataHard.general.append(Context.EformtData("yes", name: "part3", ref: "field_2_9_2", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_9"))
        InjuryDataHard.general.append(Context.EformtData("yes", name: "part4", ref: "field_2_10_0", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_10"))
        InjuryDataHard.general.append(Context.EformtData("yes", name: "part5", ref: "field_2_10_1", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_10"))
        InjuryDataHard.general.append(Context.EformtData("yes", name: "part6", ref: "field_2_10_2", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_10"))
        InjuryDataHard.general.append(Context.EformtData("yes", name: "part7", ref: "field_2_11_0", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_11"))
        InjuryDataHard.general.append(Context.EformtData("yes", name: "part8", ref: "field_2_11_1", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_11"))
        InjuryDataHard.general.append(Context.EformtData("yes", name: "part9", ref: "field_2_11_2", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_11"))
        InjuryDataHard.general.append(Context.EformtData("yes", name: "part10", ref: "field_2_12_0", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_12"))
        InjuryDataHard.general.append(Context.EformtData("yes", name: "part11", ref: "field_2_12_1", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_12"))
        InjuryDataHard.general.append(Context.EformtData("yes", name: "part12", ref: "field_2_12_2", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_12"))
        InjuryDataHard.general.append(Context.EformtData("yes", name: "part13", ref: "field_2_13_0", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_13"))
        InjuryDataHard.general.append(Context.EformtData("yes", name: "part14", ref: "field_2_13_1", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_13"))
        InjuryDataHard.general.append(Context.EformtData("yes", name: "part15", ref: "field_2_13_2", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_13"))
        
        InjuryDataHard.general.append(Context.EformtData("yes", name: "medic_his1", ref: "field_2_15_0", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_15"))
        InjuryDataHard.general.append(Context.EformtData("yes", name: "medic_his4", ref: "field_2_15_1", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_15"))
        InjuryDataHard.general.append(Context.EformtData("yes", name: "medic_his7", ref: "field_2_15_2", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_15"))
        InjuryDataHard.general.append(Context.EformtData("yes", name: "medic_his2", ref: "field_2_16_0", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_16"))
        InjuryDataHard.general.append(Context.EformtData("yes", name: "medic_his5", ref: "field_2_16_1", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_16"))
        InjuryDataHard.general.append(Context.EformtData("yes", name: "medic_his3", ref: "field_2_17_0", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_17"))
        InjuryDataHard.general.append(Context.EformtData("yes", name: "medic_his6", ref: "field_2_17_1", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_17"))
        InjuryDataHard.general.append(Context.EformtData("yes", name: "medic_his9", ref: "field_2_17_2", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_17"))
        InjuryDataHard.general.append(Context.EformtData("yes", name: "medic_his8", ref: "field_2_16_2", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_16"))
        
        InjuryDataHard.general.append(Context.EformtData("yes", name: "inj_sym1", ref: "field_2_21_1", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_21"))
        InjuryDataHard.general.append(Context.EformtData("yes", name: "inj_sym2", ref: "field_2_21_2", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_21"))
        InjuryDataHard.general.append(Context.EformtData("yes", name: "inj_sym3", ref: "field_2_22_1", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_22"))
        InjuryDataHard.general.append(Context.EformtData("yes", name: "inj_sym4", ref: "field_2_22_2", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_22"))
        
        AllRedisiteData.general = InjuryDataHard.general
    }
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if(segue.identifier == "DescrubeInjury"){
            self.SequeCollectionView(segue, titles: [["Sparain/Strain","field_2_4_1"],["Laceration","field_2_4_2"],["Crush","field_2_5_3"],["Fall","field_2_5_4"]], listID: [],type: "")
        }else if(segue.identifier == "InjurySymtomsSegue"){
            self.SequeCollectionView(segue, titles: [[" Open wound  ","field_2_21_1"],["  Swelling  ","field_2_21_2"],["  Redness  ","field_2_22_1"],[" Reduced movement ","field_2_22_2"]], listID: [],type: "NoBackground")
        }else if(segue.identifier == "MedicalHistorySeque"){
            self.SequeCollectionView(segue, titles: [["Asthma","field_2_15_0"],["Epilepsy","field_2_16_0"],["Heart Condition","field_2_17_0"],["High Cholesterol","field_2_15_1"],["Diabetes Type I","field_2_16_1"],["Diabetes Type II","field_2_17_1"],["Hight Blood Pressure","field_2_15_2"],["Arthritis","field_2_16_2"],["Blood Condition","field_2_17_2"]], listID: [],type: "NoBackground")
        }else if(segue.identifier == "SegueTable1"){
            self.SequeTableView(segue, titles: [["Left lower leg","field_2_9_0"],["Right lower leg","field_2_9_1"],["Left upper leg","field_2_9_2"],["Right upper leg","field_2_10_0"]], listID: [],type: "")
        }else if(segue.identifier == "SegueTable2"){
            self.SequeTableView(segue, titles: [["Left lower arm","field_2_10_1"],["Right lower arm","field_2_10_2"],["Left upper arm","field_2_11_0"],["Right upper arm","field_2_11_1"]], listID: [],type: "")
        }else if(segue.identifier == "SegueTable3"){
            self.SequeTableView(segue, titles: [["Left hand","field_2_11_2"],["Right hand","field_2_12_0"],["Left shoulder","field_2_12_1"],["Right shoulder","field_2_12_2"]], listID: [],type: "")
        }else if(segue.identifier == "SegueTable4"){
            self.SequeTableView(segue, titles: [["Abdomen","field_2_13_0"],["Chest","field_2_13_1"],["Lower back","field_2_13_2"]], listID: [],type: "")
        }
    }
    override func viewWillAppear(animated: Bool) {
        AllRedisiteData.general.removeAll()
        AllRedisiteData.general = InjuryDataHard.general
        GetdataInform()
        UIApplication.sharedApplication().statusBarStyle = UIStatusBarStyle.LightContent
        let statusBar: UIView = UIApplication.sharedApplication().valueForKey("statusBar") as! UIView
        if statusBar.respondsToSelector(Selector("setBackgroundColor:")) {
            statusBar.backgroundColor = UIColor(hex: Define.ColorCustom.greenBoldColor)
        }
        if (self.isMovingFromParentViewController()) {
            UIDevice.currentDevice().setValue(Int(UIInterfaceOrientation.LandscapeLeft.rawValue), forKey: "orientation")
        }
    }
    func CheckDataSubmit(){
        
        InjuryDataChange.general.removeAll()
        
        InjuryDataChange.general.append(Context.EformtData(txtDateOfAccident.text!, name: "inj_date", ref: "field_2_0_1", type: "eform_input_text", checked: "", refRow: "row_2_0"))
        InjuryDataChange.general.append(Context.EformtData(txtWorkplace.text!, name: "inj_place", ref: "field_2_1_1", type: "eform_input_text", checked: "", refRow: "row_2_1"))
        InjuryDataChange.general.append(Context.EformtData(txtWhatAcctually.text!, name: "what_happened", ref: "field_2_3_0", type: "eform_input_text", checked: "", refRow: "row_2_3"))
        InjuryDataChange.general.append(Context.EformtData(txtOtherDescribleInjury.text!, name: "other_inj", ref: "field_2_6_1", type: "eform_input_text", checked: "", refRow: "row_2_6"))
        InjuryDataChange.general.append(Context.EformtData(txtOtherMedicalHistory.text!, name: "other_medical_history", ref: "field_2_18_1", type: "eform_input_text", checked: "", refRow: "row_2_18"))
        InjuryDataChange.general.append(Context.EformtData(txtMedicationValue.text!, name: "medictation", ref: "field_2_19_3", type: "eform_input_text", checked: "", refRow: "row_2_19"))
        InjuryDataChange.general.append(Context.EformtData(txtAllergiesYesValue.text!, name: "allergies", ref: "field_2_20_3", type: "eform_input_text", checked: "", refRow: "row_2_20"))
        InjuryDataChange.general.append(Context.EformtData(txtOtherInjurySymptoms.text!, name: "other_symptoms", ref: "field_2_24_1", type: "eform_input_text", checked: "", refRow: "row_2_24"))
        InjuryDataChange.general.append(Context.EformtData(txtPain.text!, name: "pain_level", ref: "field_2_23_1", type: "eform_input_text", checked: "", refRow: "row_2_23"))
        InjuryDataChange.general.append(Context.EformtData(txtInitalTreatment.text!, name: "initial_treatment", ref: "field_2_25_1", type: "eform_input_text", checked: "", refRow: "row_2_25"))
        
        InjuryDataHard.general = AllRedisiteData.general
        InjuryData.general.removeAll()
        InjuryData.general = InjuryDataHard.general + InjuryDataChange.general
    }
    @IBAction func ConsentForm(sender: AnyObject) {
        CheckDataSubmit()
        let consentView :RedisiteImageViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("RedisiteImageViewControllerID") as! RedisiteImageViewController
        DataPatientInjuryOrGeneral.general = PatientData.general + InjuryData.general
        consentView.DataPatientInjuryOrGeneral = DataPatientInjuryOrGeneral
        consentView.templateUID = Define.Redisite.templateUID_InjuryEFormUID
        self.presentViewController(consentView, animated: true, completion: nil)
    }
    func SetUpCustomLayout(){
        DatepickerMode()
        self.automaticallyAdjustsScrollViewInsets = false
        UIDevice.currentDevice().setValue(UIInterfaceOrientation.LandscapeLeft.rawValue, forKey: "orientation")
        
        txtOtherBodyPart.textFiledOnlyLine(txtOtherBodyPart)
        txtInitalTreatment.textFiledOnlyLine(txtInitalTreatment)
        txtPain.textFiledOnlyLine(txtPain)
        txtOtherInjurySymptoms.textFiledOnlyLine(txtOtherInjurySymptoms)
        txtAllergiesYesValue.textFiledOnlyLine(txtAllergiesYesValue)
        txtMedicationValue.textFiledOnlyLine(txtMedicationValue)
        txtOtherMedicalHistory.textFiledOnlyLine(txtOtherMedicalHistory)
        txtOtherDescribleInjury.textFiledOnlyLine(txtOtherDescribleInjury)
        txtWhatAcctually.textFiledOnlyLine(txtWhatAcctually)
        txtWorkplace.textFiledOnlyLine(txtWorkplace)
        txtDateOfAccident.textFiledOnlyLine(txtDateOfAccident)
        txtPain.text = "  5"
        viewTableHandShoulder.layer.borderColor =  UIColor(hex: Define.ColorCustom.greenBoderColor ).CGColor
        viewOtherBody.layer.borderColor =  UIColor(hex: Define.ColorCustom.greenBoderColor ).CGColor
        viewTableArm.layer.borderColor =  UIColor(hex: Define.ColorCustom.greenBoderColor ).CGColor
        viewTableLeg.layer.borderColor =  UIColor(hex: Define.ColorCustom.greenBoderColor ).CGColor
        viewInjurySymptoms.layer.borderColor =  UIColor(hex: Define.ColorCustom.greenBoderColor ).CGColor
        
        viewDescribeInjury.layer.borderColor =  UIColor(hex: Define.ColorCustom.greenBoderColor ).CGColor
        viewMedicalHistory.layer.borderColor =  UIColor(hex: Define.ColorCustom.greenBoderColor ).CGColor
    }
    @IBAction func ActionBack(sender: AnyObject) {
        self.dismissViewControllerAnimated(true, completion: {})
    }
    @IBAction func ChangeValueSlider(sender: AnyObject) {
        let currentValue = Int(sliderPain.value)
        txtPain.text = "  \(currentValue)"
    }
    
}
extension InjuryViewController {
    
    func DatepickerMode(){
        txtDateOfAccident.tintColor = UIColor.clearColor()
        datePicker.datePickerMode = .Date
        let toolBar = UIToolbar()
        toolBar.barStyle = .Default
        toolBar.translucent = true
        toolBar.tintColor = UIColor.blackColor()
        toolBar.sizeToFit()
        
        let doneButton = UIBarButtonItem(title: "Done", style: .Plain, target: self, action: #selector(GeneralIllnessViewController.doneClick))
        let spaceButton = UIBarButtonItem(barButtonSystemItem: .FlexibleSpace, target: nil, action: nil)
        let cancelButton = UIBarButtonItem(title: "Cancel", style: .Plain, target: self, action: #selector(GeneralIllnessViewController.cancelClick))
        toolBar.setItems([cancelButton,spaceButton, doneButton], animated: false)
        toolBar.userInteractionEnabled = true
        txtDateOfAccident.inputView = datePicker
        txtDateOfAccident.inputAccessoryView = toolBar
    }
    //Done button in datepicker
    func doneClick() {
        let dateFormatter = NSDateFormatter()
        let SaveDatetime = NSDateFormatter()
        SaveDatetime.dateFormat = "dd/MM/yyyy"
        dateFormatter.dateFormat = "dd/MM/yyyy"
        txtDateOfAccident.text = dateFormatter.stringFromDate(datePicker.date)
        txtDateOfAccident.resignFirstResponder()
        if(Context.compareDate(datePicker.date)){
            txtDateOfAccident.textFiledOnlyLine(txtDateOfAccident)
        }else{
            txtDateOfAccident.txtError(txtDateOfAccident)
        }
        
    }
    //Cancel button in datepicker
    func cancelClick() {
        txtDateOfAccident.resignFirstResponder()
    }
    
}

