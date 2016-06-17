//
//  GeneralIllnessViewController.swift
//  UrgentCare Work
//
//  Created by Meditek on 6/15/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit

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
    @IBOutlet weak var txtOtherMedicalHistory: UITextField!
    @IBOutlet weak var txtDateOfAccident: UITextField!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        SetUpUiUx()
    }
    override func shouldAutorotate() -> Bool {
        return false
    }
    func canRotate() -> Void {
        
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        
//        if(segue.identifier == "MedicalHistorySeque"){
//            self.SequeCollectionView(segue, titles: ["Asthma","Epilepsy","Heart Condition","High Cholesterol","Diabetes Type I","Diabetes Type II","Hight Blood Pressure","Arthritis","Blood Condition"], listID: [])
//        }else if(segue.identifier == "Seguetable1"){
//            self.SequeTableView(segue, titles: ["Headache","Nausea","Fatigue","Fever"], listID: [])
//        }else if(segue.identifier == "Seguetable2"){
//            self.SequeTableView(segue, titles: ["Sore throat","Cough","Sinus congestion","Body aches"], listID: [])
//        }else if(segue.identifier == "Seguetable3"){
//            self.SequeTableView(segue, titles: ["Vomiting","Light headedness","Diarrhea","Shortness of breath"], listID: [])
//        }else if(segue.identifier == "Seguetable4"){
//            self.SequeTableView(segue, titles: ["Chest pain","Abdomen pain","Back pain","Ear pain"], listID: [])
//        }else if(segue.identifier == "Seguetable5"){
//            self.SequeTableView(segue, titles: ["Low mood","Decreased appetite","Feeling depressed","Tooth pain"], listID: [])
//        }
    }
    
    func SetUpUiUx(){
        txtBP.textFiledOnlyLine(txtBP)
        txtRR.textFiledOnlyLine(txtRR)
        txtTemp.textFiledOnlyLine(txtTemp)
        txtVitalSigns.textFiledOnlyLine(txtVitalSigns)
        txtInitalTreatment.textFiledOnlyLine(txtInitalTreatment)
        txtSaO2.textFiledOnlyLine(txtSaO2)
        txtOtherInjurySymptoms.textFiledOnlyLine(txtOtherInjurySymptoms)
        txtAllergiesYesValue.textFiledOnlyLine(txtAllergiesYesValue)
        txtMedicalHistoryValue.textFiledOnlyLine(txtMedicalHistoryValue)
        txtOtherMedicalHistory.textFiledOnlyLine(txtOtherMedicalHistory)
        txtDateOfAccident.textFiledOnlyLine(txtDateOfAccident)
        
        viewTable1.layer.borderColor =  UIColor(hex: Define.ColorCustom.greenBoderColor ).CGColor
        viewTable2.layer.borderColor =  UIColor(hex: Define.ColorCustom.greenBoderColor ).CGColor
        viewTable3.layer.borderColor =  UIColor(hex: Define.ColorCustom.greenBoderColor ).CGColor
        viewTable4.layer.borderColor =  UIColor(hex: Define.ColorCustom.greenBoderColor ).CGColor
         viewTable5.layer.borderColor =  UIColor(hex: Define.ColorCustom.greenBoderColor ).CGColor
        viewMedicalHistory.layer.borderColor =  UIColor(hex: Define.ColorCustom.greenBoderColor ).CGColor

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

}
