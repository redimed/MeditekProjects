//
//  GeneralIllnessViewController.swift
//  UrgentCare Work
//
//  Created by Meditek on 6/15/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit
import ObjectMapper

class GeneralIllnessViewController: UIViewController {
    
    @IBOutlet weak var viewMedicalHistory: UIView!
    @IBOutlet weak var viewTable1: UIView!
    @IBOutlet weak var viewTable2: UIView!
    @IBOutlet weak var viewTable3: UIView!
    @IBOutlet weak var viewTable4: UIView!
    @IBOutlet weak var viewTable5: UIView!
    
    
    @IBOutlet weak var txtBP: UITextField!
    @IBOutlet weak var txtSaO2: UITextField!
    @IBOutlet weak var txtRR: UITextField!
    @IBOutlet weak var txtTemp: UITextField!
    @IBOutlet weak var txtVitalSigns: UITextField!
    @IBOutlet weak var txtInitalTreatment: UITextField!
    @IBOutlet weak var txtOtherInjurySymptoms: UITextField!
    @IBOutlet weak var txtAllergiesYesValue: UITextField!
    @IBOutlet weak var txtMedicalHistoryValue: UITextField!
    @IBOutlet weak var txtMedicationsValue: UITextField!
    @IBOutlet weak var txtDateOfAccident: UITextField!
    
    var datePicker = UIDatePicker()
    var DataPatientInjuryOrGeneral = General()
    var GeneralDataHard = General()
    var GeneralDataChange = General()
    override func viewDidLoad() {
        super.viewDidLoad()
        
        SetUpUiUx()
        GetDataInform()
        
    }
    override func shouldAutorotate() -> Bool {
        return false
    }
    func canRotate() -> Void {
        
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        
        if(segue.identifier == "MedicalHistorySeque"){
            self.SequeCollectionView(segue, titles: [["Asthma","field_2_3_0"],["Epilepsy","field_2_4_0"],["Heart Condition","field_2_5_0"],["High Cholesterol","field_2_3_1"],["Diabetes Type I","field_2_4_1"],["Diabetes Type II","field_2_5_1"],["Hight Blood Pressure","field_2_3_2"],["Arthritis","field_2_4_2"],["Blood Condition","field_2_5_2"]], listID: [],type: "NoBackground")
        }else if(segue.identifier == "Seguetable1"){
            self.SequeTableView(segue, titles: [["Headache","field_2_7_0"],["Nausea","field_2_7_1"],["Fatigue","field_2_7_2"],["Fever","field_2_8_0"]], listID: [], type: "")
        }else if(segue.identifier == "Seguetable2"){
            self.SequeTableView(segue, titles: [["Sore throat","field_2_8_1"],["Cough","field_2_8_2"],["Sinus congestion","field_2_9_0"],["Body aches","field_2_9_1"]], listID: [], type: "")
        }else if(segue.identifier == "Seguetable3"){
            self.SequeTableView(segue, titles: [["Vomiting","field_2_9_2"],["Light headedness","field_2_10_0"],["Diarrhea","field_2_10_1"],["Shortness of breath","field_2_10_2"]], listID: [], type: "")
        }else if(segue.identifier == "Seguetable4"){
            self.SequeTableView(segue, titles: [["Chest pain","field_2_11_0"],["Abdomen pain","field_2_11_1"],["Back pain","field_2_13_1"],["Ear pain","field_2_11_2"]], listID: [], type: "")
        }else if(segue.identifier == "Seguetable5"){
            self.SequeTableView(segue, titles: [["Low mood","field_2_12_0"],["Decreased appetite","field_2_12_1"],["Feeling depressed","field_2_12_2"],["Tooth pain","field_2_13_0"]], listID: [], type: "")
        }
    }
    
    func GetDataInform(){
        AllRedisiteData.general.removeAll()
        GeneralDataHard.general.append(Context.EformtData("no", name: "is_sym_before", ref: "field_2_1_1", type: "eform_input_check_radio", checked: "true", refRow: "row_2_1"))
        GeneralDataHard.general.append(Context.EformtData("yes", name: "is_sym_before", ref: "field_2_1_2", type: "eform_input_check_radio", checked: "false", refRow: "row_2_1"))
        
        GeneralDataHard.general.append(Context.EformtData("yes", name: "medic_his1", ref: "field_2_3_0", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_3"))
        GeneralDataHard.general.append(Context.EformtData("yes", name: "medic_his2", ref: "field_2_4_0", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_4"))
        GeneralDataHard.general.append(Context.EformtData("yes", name: "medic_his3", ref: "field_2_5_0", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_5"))
        GeneralDataHard.general.append(Context.EformtData("yes", name: "medic_his4", ref: "field_2_3_1", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_3"))
        GeneralDataHard.general.append(Context.EformtData("yes", name: "medic_his5", ref: "field_2_4_1", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_4"))
        GeneralDataHard.general.append(Context.EformtData("yes", name: "medic_his6", ref: "field_2_5_1", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_5"))
        GeneralDataHard.general.append(Context.EformtData("yes", name: "medic_his7", ref: "field_2_3_2", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_3"))
        GeneralDataHard.general.append(Context.EformtData("yes", name: "medic_his8", ref: "field_2_4_2", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_4"))
        GeneralDataHard.general.append(Context.EformtData("yes", name: "medic_his9", ref: "field_2_5_2", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_5"))
        
        GeneralDataHard.general.append(Context.EformtData("yes", name: "sym1", ref: "field_2_7_0", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_7"))
        GeneralDataHard.general.append(Context.EformtData("yes", name: "sym2", ref: "field_2_7_1", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_7"))
        GeneralDataHard.general.append(Context.EformtData("yes", name: "sym3", ref: "field_2_7_2", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_7"))
        GeneralDataHard.general.append(Context.EformtData("yes", name: "sym4", ref: "field_2_8_0", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_8"))
        
        GeneralDataHard.general.append(Context.EformtData("yes", name: "sym5", ref: "field_2_8_1", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_8"))
        GeneralDataHard.general.append(Context.EformtData("yes", name: "sym6", ref: "field_2_8_2", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_8"))
        GeneralDataHard.general.append(Context.EformtData("yes", name: "sym7", ref: "field_2_9_0", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_9"))
        GeneralDataHard.general.append(Context.EformtData("yes", name: "sym8", ref: "field_2_9_1", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_9"))
        
        GeneralDataHard.general.append(Context.EformtData("yes", name: "sym9", ref: "field_2_9_2", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_9"))
        GeneralDataHard.general.append(Context.EformtData("yes", name: "sym10", ref: "field_2_10_0", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_10"))
        GeneralDataHard.general.append(Context.EformtData("yes", name: "sym11", ref: "field_2_10_1", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_10"))
        GeneralDataHard.general.append(Context.EformtData("yes", name: "sym12", ref: "field_2_10_2", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_10"))
        
        GeneralDataHard.general.append(Context.EformtData("yes", name: "sym13", ref: "field_2_11_0", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_11"))
        GeneralDataHard.general.append(Context.EformtData("yes", name: "sym14", ref: "field_2_11_1", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_11"))
        GeneralDataHard.general.append(Context.EformtData("yes", name: "sym15", ref: "field_2_13_1", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_13"))
        GeneralDataHard.general.append(Context.EformtData("yes", name: "sym16", ref: "field_2_11_2", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_11"))
        
        GeneralDataHard.general.append(Context.EformtData("yes", name: "sym17", ref: "field_2_12_0", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_12"))
        GeneralDataHard.general.append(Context.EformtData("yes", name: "sym18", ref: "field_2_12_1", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_12"))
        GeneralDataHard.general.append(Context.EformtData("yes", name: "sym19", ref: "field_2_12_2", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_12"))
        GeneralDataHard.general.append(Context.EformtData("yes", name: "sym20", ref: "field_2_13_0", type: "eform_input_check_checkbox", checked: "false", refRow: "row_2_13"))
        
        GeneralDataHard.general.append(Context.EformtData("no", name: "is_medic", ref: "field_2_15_1", type: "eform_input_check_radio", checked: "true", refRow: "row_2_15"))
        GeneralDataHard.general.append(Context.EformtData("yes", name: "is_medic", ref: "field_2_15_2", type: "eform_input_check_radio", checked: "false", refRow: "row_2_15"))
        
        GeneralDataHard.general.append(Context.EformtData("no", name: "is_allergies", ref: "field_2_16_1", type: "eform_input_check_radio", checked: "true", refRow: "row_2_16"))
        GeneralDataHard.general.append(Context.EformtData("yes", name: "is_allergies", ref: "field_2_16_2", type: "eform_input_check_radio", checked: "false", refRow: "row_2_16"))
        
        AllRedisiteData.general = GeneralDataHard.general
        
    }
    func SetUpUiUx(){
        DatepickerMode()
        UIDevice.currentDevice().setValue(UIInterfaceOrientation.LandscapeLeft.rawValue, forKey: "orientation")
        txtBP.textFiledOnlyLine(txtBP)
        txtRR.textFiledOnlyLine(txtRR)
        txtTemp.textFiledOnlyLine(txtTemp)
        txtVitalSigns.textFiledOnlyLine(txtVitalSigns)
        txtInitalTreatment.textFiledOnlyLine(txtInitalTreatment)
        txtSaO2.textFiledOnlyLine(txtSaO2)
        txtOtherInjurySymptoms.textFiledOnlyLine(txtOtherInjurySymptoms)
        txtAllergiesYesValue.textFiledOnlyLine(txtAllergiesYesValue)
        txtMedicalHistoryValue.textFiledOnlyLine(txtMedicalHistoryValue)
        txtMedicationsValue.textFiledOnlyLine(txtMedicationsValue)
        txtDateOfAccident.textFiledOnlyLine(txtDateOfAccident)
        
        viewTable1.layer.borderColor =  UIColor(hex: Define.ColorCustom.greenBoderColor ).CGColor
        viewTable2.layer.borderColor =  UIColor(hex: Define.ColorCustom.greenBoderColor ).CGColor
        viewTable3.layer.borderColor =  UIColor(hex: Define.ColorCustom.greenBoderColor ).CGColor
        viewTable4.layer.borderColor =  UIColor(hex: Define.ColorCustom.greenBoderColor ).CGColor
        viewTable5.layer.borderColor =  UIColor(hex: Define.ColorCustom.greenBoderColor ).CGColor
        viewMedicalHistory.layer.borderColor =  UIColor(hex: Define.ColorCustom.greenBoderColor ).CGColor
    }
    
    func SubmitData(){
        GeneralData.general.removeAll()
        GeneralDataChange.general.append(Context.EformtData(txtDateOfAccident.text!, name: "inj_date", ref: "field_2_0_1", type: "eform_input_date", checked: "", refRow: "row_2_0"))
        GeneralDataChange.general.append(Context.EformtData(txtMedicalHistoryValue.text!, name: "inj_date", ref: "field_2_2_1", type: "eform_input_text", checked: "", refRow: "row_2_2"))
        GeneralDataChange.general.append(Context.EformtData(txtOtherInjurySymptoms.text!, name: "other_symptoms", ref: "field_2_14_1", type: "eform_input_text", checked: "", refRow: "row_2_14"))
        GeneralDataChange.general.append(Context.EformtData(txtMedicationsValue.text!, name: "medictation", ref: "field_2_15_3", type: "eform_input_text", checked: "", refRow: "row_2_15"))
        GeneralDataChange.general.append(Context.EformtData(txtAllergiesYesValue.text!, name: "allergies", ref: "field_2_16_3", type: "eform_input_text", checked: "", refRow: "row_2_16"))
        GeneralDataChange.general.append(Context.EformtData(txtVitalSigns.text!, name: "hr", ref: "field_2_17_1", type: "eform_input_text", checked: "", refRow: "row_2_17"))
        
        GeneralDataChange.general.append(Context.EformtData(txtTemp.text!, name: "temp", ref: "field_2_17_3", type: "eform_input_text", checked: "", refRow: "row_2_17"))
        GeneralDataChange.general.append(Context.EformtData(txtRR.text!, name: "rr", ref: "field_2_17_5", type: "eform_input_text", checked: "", refRow: "row_2_17"))
        GeneralDataChange.general.append(Context.EformtData(txtBP.text!, name: "blood_pressure", ref: "field_2_18_1", type: "eform_input_text", checked: "", refRow: "row_2_18"))
        GeneralDataChange.general.append(Context.EformtData(txtSaO2.text!, name: "sao2", ref: "field_2_18_3", type: "eform_input_date", checked: "", refRow: "row_2_18"))
        GeneralDataChange.general.append(Context.EformtData(txtInitalTreatment.text!, name: "initial_treatment", ref: "field_2_19_1", type: "eform_input_date", checked: "", refRow: "row_2_19"))
        
        GeneralDataHard.general = AllRedisiteData.general
        GeneralData.general.removeAll()
        GeneralData.general = GeneralDataHard.general + GeneralDataChange.general
    }
    override func viewWillAppear(animated: Bool) {
        UIApplication.sharedApplication().statusBarStyle = UIStatusBarStyle.LightContent
        let statusBar: UIView = UIApplication.sharedApplication().valueForKey("statusBar") as! UIView
        if statusBar.respondsToSelector(Selector("setBackgroundColor:")) {
            statusBar.backgroundColor = UIColor(hex: Define.ColorCustom.greenBoldColor)
        }
        if (self.isMovingFromParentViewController()) {
            UIDevice.currentDevice().setValue(Int(UIInterfaceOrientation.LandscapeLeft.rawValue), forKey: "orientation")
        }
        
    }
    @IBAction func ConsentForm(sender: AnyObject) {
        SubmitData()
        let redisiteView :RedisiteImageViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("RedisiteImageViewControllerID") as! RedisiteImageViewController
        DataPatientInjuryOrGeneral.general = PatientData.general + GeneralData.general
        redisiteView.DataPatientInjuryOrGeneral = DataPatientInjuryOrGeneral
        redisiteView.templateUID = Define.Redisite.templateUID_GeneralEFormUID
        redisiteView.redisiteName = "Redisite General"
        self.presentViewController(redisiteView, animated: true, completion: nil)
    }
    @IBAction func ChangeSymptomsBeforeRadio(sender: AnyObject) {
        if(sender.selectedSegmentIndex == 0){
            Context.RadioGetData("no", title: [["no","field_2_1_1"],["yes","field_2_1_1"]])
        }else{
            Context.RadioGetData("yes", title: [["no","field_2_1_1"],["yes","field_2_1_1"]])
        }
    }
    @IBAction func ChangeAllergiesRadio(sender: AnyObject) {
        txtAllergiesYesValue.text = ""
        if(sender.selectedSegmentIndex == 0){
            txtAllergiesYesValue.hidden = true
            Context.RadioGetData("no", title: [["no","field_2_16_1"],["yes","field_2_16_2"]])
        }else{
            txtAllergiesYesValue.hidden = false
            Context.RadioGetData("yes", title: [["no","field_2_16_1"],["yes","field_2_16_2"]])
        }
    }
    @IBAction func ChangeMedicationRadio(sender: AnyObject) {
        txtMedicationsValue.text = ""
        if(sender.selectedSegmentIndex == 0){
            txtMedicationsValue.hidden = true
            Context.RadioGetData("no", title: [["no","field_2_15_1"],["yes","field_2_15_2"]])
        }else{
            txtMedicationsValue.hidden = false
            Context.RadioGetData("yes", title: [["no","field_2_15_1"],["yes","field_2_15_2"]])
        }
    }
    @IBAction func BackAction(sender: AnyObject) {
        self.dismissViewControllerAnimated(true, completion: {})
    }
    
    
}
extension GeneralIllnessViewController {
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
