//
//  InjuryViewController.swift
//  UrgentCare Work
//
//  Created by Meditek on 6/14/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit

class InjuryViewController: UIViewController {

    @IBOutlet weak var viewMedicalHistory: UIView!
    @IBOutlet weak var viewDescribeInjury: UIView!
    @IBOutlet weak var viewInjurySymptoms: UIView!
    @IBOutlet weak var viewTableLeg: UIView!
    @IBOutlet weak var viewTableArm: UIView!
    @IBOutlet weak var viewTableHandShoulder: UIView!
    @IBOutlet weak var viewOtherBody: UIView!
    
    
    @IBOutlet weak var txtOtherBodyPart: UITextField!
    @IBOutlet weak var txtInitalTreatment: UITextField!
    @IBOutlet weak var txtPain: UITextField!
    @IBOutlet weak var txtOtherInjurySymptoms: UITextField!
    @IBOutlet weak var txtAllergiesYesValue: UITextField!
    @IBOutlet weak var txtMedicalHistoryValue: UITextField!
    @IBOutlet weak var txtOtherMedicalHistory: UITextField!
    @IBOutlet weak var txtOtherDescribleInjury: UITextField!
    @IBOutlet weak var txtWhatAcctually: UITextField!
    @IBOutlet weak var txtWorkplace: UITextField!
    @IBOutlet weak var txtDateOfAccident: UITextField!
    
    
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
        // Dispose of any resources that can be recreated.
    }
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        
//        if(segue.identifier == "DescrubeInjury"){
//            self.SequeCollectionView(segue, titles: ["Sparain/Strain","  Laceration  ","  Crush  ","  Fall  "], listID: [])
//        }else if(segue.identifier == "InjurySymtomsSegue"){
//            self.SequeCollectionView(segue, titles: [" Open wound  ","  Swelling  ","  Redness  "," Reduced movement "], listID: [])
//        }else if(segue.identifier == "MedicalHistorySeque"){
//            self.SequeCollectionView(segue, titles: ["Asthma","Epilepsy","Heart Condition","High Cholesterol","Diabetes Type I","Diabetes Type II","Hight Blood Pressure","Arthritis","Blood Condition"], listID: [])
//        }else if(segue.identifier == "SegueTable1"){
//            self.SequeTableView(segue, titles: ["Left lower leg","Right lower leg","Left upper leg","Right upper leg"], listID: [])
//        }else if(segue.identifier == "SegueTable2"){
//            self.SequeTableView(segue, titles: ["Left lower arm","Right lower leg","Left upper arm","Right upper arm"], listID: [])
//        }else if(segue.identifier == "SegueTable3"){
//            self.SequeTableView(segue, titles: ["Left lower hand","Right hand","Left shoulder","Right shoulder"], listID: [])
//        }else if(segue.identifier == "SegueTable4"){
//            self.SequeTableView(segue, titles: ["Abdomen","Chest","Lower back"], listID: [])
//        }
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
        let listSite :ConsentViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("ConsentViewControllerID") as! ConsentViewController
        self.navigationController?.pushViewController(listSite, animated: true)
    }
    func SetUpCustomLayout(){
        
        txtOtherBodyPart.textFiledOnlyLine(txtOtherBodyPart)
        txtInitalTreatment.textFiledOnlyLine(txtInitalTreatment)
        txtPain.textFiledOnlyLine(txtPain)
        txtOtherInjurySymptoms.textFiledOnlyLine(txtOtherInjurySymptoms)
        txtAllergiesYesValue.textFiledOnlyLine(txtAllergiesYesValue)
        txtMedicalHistoryValue.textFiledOnlyLine(txtMedicalHistoryValue)
        txtOtherMedicalHistory.textFiledOnlyLine(txtOtherMedicalHistory)
        txtOtherDescribleInjury.textFiledOnlyLine(txtOtherDescribleInjury)
        txtWhatAcctually.textFiledOnlyLine(txtWhatAcctually)
        txtWorkplace.textFiledOnlyLine(txtWorkplace)
        txtDateOfAccident.textFiledOnlyLine(txtDateOfAccident)

        viewTableHandShoulder.layer.borderColor =  UIColor(hex: Define.ColorCustom.greenBoderColor ).CGColor
        viewOtherBody.layer.borderColor =  UIColor(hex: Define.ColorCustom.greenBoderColor ).CGColor
        viewTableArm.layer.borderColor =  UIColor(hex: Define.ColorCustom.greenBoderColor ).CGColor
        viewTableLeg.layer.borderColor =  UIColor(hex: Define.ColorCustom.greenBoderColor ).CGColor
        viewInjurySymptoms.layer.borderColor =  UIColor(hex: Define.ColorCustom.greenBoderColor ).CGColor
        
        viewDescribeInjury.layer.borderColor =  UIColor(hex: Define.ColorCustom.greenBoderColor ).CGColor
        viewMedicalHistory.layer.borderColor =  UIColor(hex: Define.ColorCustom.greenBoderColor ).CGColor
    }
}
