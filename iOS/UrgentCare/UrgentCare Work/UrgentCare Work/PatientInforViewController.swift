//
//  PatientInforViewController.swift
//  UrgentCare Work
//
//  Created by Meditek on 6/2/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit

class PatientInforViewController: BaseViewController {
    var isPresented = false
    
    @IBOutlet weak var ServicerequestedView: UIView!
    @IBOutlet weak var RelatedContentView: UIView!
    @IBOutlet weak var navigationBar: UINavigationBar!
    
    @IBOutlet weak var txtVeteranNumber: UITextField!
    @IBOutlet weak var txtMembership: UITextField!
    @IBOutlet weak var txtHealthFundName: UITextField!
    @IBOutlet weak var txtExpiry: UITextField!
    @IBOutlet weak var txtPosition: UITextField!
    @IBOutlet weak var txtMedicareNumber: UITextField!
    @IBOutlet weak var txtNOKEmail: UITextField!
    @IBOutlet weak var txtNOKTelephone: UITextField!
    @IBOutlet weak var txtNOKName: UITextField!
    @IBOutlet weak var txtWorkTelephone: UITextField!
    @IBOutlet weak var txtMobileTelephone: UITextField!
    @IBOutlet weak var txtHomeTelephone: UITextField!
    @IBOutlet weak var txtPostCode: UITextField!
    @IBOutlet weak var txtSuburb: UITextField!
    @IBOutlet weak var txtAddress: UITextField!
    @IBOutlet weak var txtOccupation: UITextField!
    @IBOutlet weak var txtDOB: UITextField!
    @IBOutlet weak var txtGivenName: UITextField!
    @IBOutlet weak var txtFamilyName: UITextField!
    @IBOutlet weak var txtClaimNo: UITextField!
    @IBOutlet weak var scrollView: UIScrollView!
    @IBOutlet weak var txtSalutation: UITextField!
    @IBOutlet weak var backBarItem: UIBarButtonItem!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.navigationController?.navigationBarHidden = true
        SetDefautDataPatient()
        print(generalData.general.count)
        setUpUI()
    }
    //set data patient
    func SetDefautDataPatient(){
        generalData.general.removeAll()
        generalData.general.append(Context.EformtData("yes", name: "is_work_related", ref: "field_0_0_0", type: "eform_input_check_radio", checked: "false", refRow: "row_0_0"))
        generalData.general.append(Context.EformtData("no", name: "is_work_related", ref: "field_0_0_1", type: "eform_input_check_radio", checked: "true", refRow: "row_0_0"))
        
        generalData.general.append(Context.EformtData("yes", name: "service1", ref: "field_0_2_0", type: "eform_input_check_checkbox", checked: "false", refRow: "row_0_0"))
        generalData.general.append(Context.EformtData("yes", name: "service2", ref: "field_0_2_1", type: "eform_input_check_checkbox", checked: "false", refRow: "row_0_0"))
        generalData.general.append(Context.EformtData("yes", name: "service3", ref: "field_0_2_3", type: "eform_input_check_checkbox", checked: "false", refRow: "row_0_0"))
        generalData.general.append(Context.EformtData("yes", name: "service4", ref: "field_0_3_1", type: "eform_input_check_checkbox", checked: "false", refRow: "row_0_0"))
        generalData.general.append(Context.EformtData("yes", name: "service5", ref: "field_0_3_2", type: "eform_input_check_checkbox", checked: "false", refRow: "row_0_0"))
        generalData.general.append(Context.EformtData("yes", name: "service6", ref: "field_0_4_2", type: "eform_input_check_checkbox", checked: "false", refRow: "row_0_0"))
        generalData.general.append(Context.EformtData("yes", name: "service7", ref: "field_0_4_3", type: "eform_input_check_checkbox", checked: "false", refRow: "row_0_0"))
    }
    //
    override func shouldAutorotate() -> Bool {
        return false
    }
    func canRotate() -> Void {
        
    }
    
    @IBAction func ActionGenerailliness(sender: AnyObject) {
        let listSite :GeneralIllnessViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("GeneralIllnessViewControllerID") as! GeneralIllnessViewController
        self.navigationController?.pushViewController(listSite, animated: true)
    }
    @IBAction func ActionInjury(sender: AnyObject) {
        let listSite :InjuryViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("InjuryViewControllerID") as! InjuryViewController
        self.navigationController?.pushViewController(listSite, animated: true)
    }
    override func viewWillDisappear (animated: Bool) {
        super.viewWillDisappear(animated)
        self.navigationController?.navigationBarHidden = true
        if (self.isMovingFromParentViewController()) {
            UIDevice.currentDevice().setValue(Int(UIInterfaceOrientation.LandscapeLeft.rawValue), forKey: "orientation")
        }
        
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    override func viewWillAppear(animated: Bool) {
        backBarItem.width = 20
        UIApplication.sharedApplication().statusBarStyle = UIStatusBarStyle.LightContent
        let statusBar: UIView = UIApplication.sharedApplication().valueForKey("statusBar") as! UIView
        if statusBar.respondsToSelector(Selector("setBackgroundColor:")) {
            statusBar.backgroundColor = UIColor(hex: Define.ColorCustom.greenBoldColor)
        }
    }
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if(segue.identifier == "SegueViewRelated"){
            self.SequeTableView(segue, titles: [["Work related","field_0_0_0"],["Not work related","field_0_0_1"]], listID: [0],type: "radio")
        }else if(segue.identifier == "SegueViewServiceRequested"){
            self.SequeTableView(segue, titles: [["Trauma Consult","field_0_2_0"],["First medical Certificate","field_0_2_1"],["Follow up in Perth","field_0_2_3"],["Fitness for work","field_0_3_1"],["Initial Telehealth Consult","field_0_3_2"],["Progress Telehealth Consult","field_0_4_2"],["Transport to/from Airport","field_0_4_3"]], listID: [0],type: "")
        }
    }
    func setUpUI(){
        for view in self.view.subviews {
            if let textField = view as? UITextField {
                print("textField")
                if textField.text == "" {
                    // show error
                    return
                }
            }
        }
        txtVeteranNumber.textFiledOnlyLine(txtVeteranNumber)
        txtMembership.textFiledOnlyLine(txtMembership)
        txtHealthFundName.textFiledOnlyLine(txtHealthFundName)
        txtExpiry.textFiledOnlyLine(txtExpiry)
        txtPosition.textFiledOnlyLine(txtPosition)
        txtMedicareNumber.textFiledOnlyLine(txtMedicareNumber)
        txtNOKEmail.textFiledOnlyLine(txtNOKEmail)
        txtNOKTelephone.textFiledOnlyLine(txtNOKTelephone)
        txtNOKName.textFiledOnlyLine(txtNOKName)
        txtWorkTelephone.textFiledOnlyLine(txtWorkTelephone)
        txtMobileTelephone.textFiledOnlyLine(txtMobileTelephone)
        txtHomeTelephone.textFiledOnlyLine(txtHomeTelephone)
        txtPostCode.textFiledOnlyLine(txtPostCode)
        txtSuburb.textFiledOnlyLine(txtSuburb)
        txtAddress.textFiledOnlyLine(txtAddress)
        txtOccupation.textFiledOnlyLine(txtOccupation)
        txtDOB.textFiledOnlyLine(txtDOB)
        txtGivenName.textFiledOnlyLine(txtGivenName)
        txtFamilyName.textFiledOnlyLine(txtFamilyName)
        txtClaimNo.textFiledOnlyLine(txtClaimNo)
        txtSalutation.textFiledOnlyLine(txtSalutation)
        //
        txtSalutation.textFiledOnlyLine(txtSalutation)
        //
        //
        RelatedContentView.layer.borderColor =  UIColor(hex: Define.ColorCustom.greenBoderColor ).CGColor
        ServicerequestedView.layer.borderColor =  UIColor(hex: Define.ColorCustom.greenBoderColor ).CGColor
        //
        //
        self.automaticallyAdjustsScrollViewInsets = false
        UIDevice.currentDevice().setValue(UIInterfaceOrientation.LandscapeRight.rawValue, forKey: "orientation")
        //
    }
    
}
