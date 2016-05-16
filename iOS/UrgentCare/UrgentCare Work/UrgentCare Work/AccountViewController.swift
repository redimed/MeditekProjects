//
//  AccountViewController.swift
//  UrgentCare Work
//
//  Created by Meditek on 3/25/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit
import ObjectMapper

class AccountViewController: BaseViewController {
    
    @IBOutlet weak var txtAccountName: UITextField!
    @IBOutlet weak var txtAccountBookingPerson: UITextField!
    @IBOutlet weak var txtAccountMobile: UITextField!
    @IBOutlet weak var txtAccountEmail: UITextField!
    
    @IBOutlet weak var txtFirstName: UITextField!
    @IBOutlet weak var txtMiddleName: UITextField!
    @IBOutlet weak var txtLastName: UITextField!
    @IBOutlet weak var txtHomePhone: UITextField!
    @IBOutlet weak var txtDOB: UITextField!
    @IBOutlet weak var txtEmail: UITextField!
    @IBOutlet weak var txtAddress: UITextField!
    @IBOutlet weak var txtSuburb: UITextField!
    @IBOutlet weak var txtPostCode: UITextField!
    @IBOutlet weak var txtCountry: UITextField!
    
    var datePicker = UIDatePicker()
    var dateofbirth: String = ""
    
    override func viewDidLoad() {
        super.viewDidLoad()
       // ScrollView.contentSize.height = 1000
        self.navigationItem.title = "Account"
        loadDataUserAccount()
        GetPatientInfomation()
         DatepickerMode()
    }
    func DatepickerMode(){
        txtDOB.tintColor = UIColor.clearColor()
        datePicker.datePickerMode = .Date
        let toolBar = UIToolbar()
        toolBar.barStyle = .Default
        toolBar.translucent = true
        toolBar.tintColor = UIColor.blackColor()
        toolBar.sizeToFit()
        
        // Adds the buttons
        let doneButton = UIBarButtonItem(title: "Done", style: .Plain, target: self, action: #selector(SubmitInjuryViewController.doneClick))
        let spaceButton = UIBarButtonItem(barButtonSystemItem: .FlexibleSpace, target: nil, action: nil)
        let cancelButton = UIBarButtonItem(title: "Cancel", style: .Plain, target: self, action: #selector(SubmitInjuryViewController.cancelClick))
        toolBar.setItems([cancelButton,spaceButton, doneButton], animated: false)
        toolBar.userInteractionEnabled = true
        
        // Adds the toolbar to the view
        txtDOB.inputView = datePicker
        txtDOB.inputAccessoryView = toolBar
    }
    //Done button in datepicker
    func doneClick() {
        let dateFormatter = NSDateFormatter()
        let SaveDatetime = NSDateFormatter()
        SaveDatetime.dateFormat = "dd/MM/yyyy"
        dateFormatter.dateFormat = "dd/MM/yyyy"
        dateofbirth = SaveDatetime.stringFromDate(datePicker.date)
        txtDOB.text = dateFormatter.stringFromDate(datePicker.date)
        txtDOB.resignFirstResponder()
    }
    //Cancel button in datepicker
    func cancelClick() {
        txtDOB.resignFirstResponder()
    }

    func loadDataUserAccount(){
        
        let userInforDict : NSDictionary = Context.getDataDefasults(Define.keyNSDefaults.userInfor) as! NSDictionary
        let userInfor :LoginResponse = Mapper().map(userInforDict)!
        let user: User = userInfor.user!
        
        UserService.getDetailUserAccount(user.UID) { [weak self] (response) in
            print(response.result.value)
            if let _ = self {
                if response.result.isSuccess {
                    if let _ = response.result.value {
                        if let userAccountDetail = Mapper<UserAccountDetail>().map(response.result.value) {
                            print(userAccountDetail.id)
                            if(userAccountDetail.UserName != ""){
                                self!.txtAccountName.text = userAccountDetail.UserName
                                self!.txtAccountEmail.text = userAccountDetail.Email
                                self?.txtAccountMobile.text = userAccountDetail.PhoneNumber
                            }else{
                                if let errorModel = Mapper<ErrorModel>().map(response.result.value){
                                    self!.alertView.alertMessage("Error", message:Context.getErrorMessage(errorModel.ErrorType))
                                }
                            }
                        }
                    }
                } else {
                    self?.showMessageNoNetwork()
                }
            }
        }
        
    }
    
    func GetPatientInfomation(){
        let data = Context.getDataDefasults(Define.keyNSDefaults.userInfor)
        let respone = Mapper<LoginResponse>().map(data)
        UserService.getPatientInfomation((respone?.user!.telehealthUser.UID)!) { [weak self] (response) in
            print(response.result.value)
            if let _ = self {
                if response.result.isSuccess {
                    if let _ = response.result.value {
                        if let dataTeleheathUserDetail = Mapper<DataTeleheathUserDetail>().map(response.result.value) {
                            if dataTeleheathUserDetail.message == "Success"  {
                                let teleheathUserDetail = Mapper().toJSON(dataTeleheathUserDetail.data[0])
                                Context.setDataDefaults(teleheathUserDetail, key: Define.keyNSDefaults.TeleheathUserDetail)
                                self?.txtFirstName.text = dataTeleheathUserDetail.data[0].FirstName
                                self?.txtLastName.text = dataTeleheathUserDetail.data[0].LastName
                                self?.txtMiddleName.text = dataTeleheathUserDetail.data[0].MiddleName
                                self?.txtHomePhone.text = dataTeleheathUserDetail.data[0].HomePhoneNumber
                                self?.txtDOB.text = dataTeleheathUserDetail.data[0].DOB
                                self?.txtEmail.text = dataTeleheathUserDetail.data[0].Email
                                self?.txtAddress.text = dataTeleheathUserDetail.data[0].Address1
                                self?.txtSuburb.text = dataTeleheathUserDetail.data[0].Suburb
                                self?.txtPostCode.text = dataTeleheathUserDetail.data[0].Postcode
                                self?.txtCountry.text = dataTeleheathUserDetail.data[0].CountryName
                                self?.txtAccountBookingPerson.text = dataTeleheathUserDetail.data[0].FirstName + dataTeleheathUserDetail.data[0].LastName
                                
                            }else{
                                if let errorModel = Mapper<ErrorModel>().map(response.result.value){
                                    self!.alertView.alertMessage("Error", message:Context.getErrorMessage(errorModel.ErrorType))
                                }
                            }
                        }
                    }
                } else {
                    self?.showMessageNoNetwork()
                }
                
            }
        }
        
    }
    @IBAction func ActionUpdateProfile(sender: AnyObject) {
        let postUpdatePatientInfo:PostUpdatePatientInfo = PostUpdatePatientInfo()
        var patientInformation : PatientInformation = PatientInformation()
        let data = Context.getDataDefasults(Define.keyNSDefaults.TeleheathUserDetail)
        let PatientInfor = Mapper<PatientInformation>().map(data)
        
        patientInformation = PatientInfor!
        
        patientInformation.FirstName = txtFirstName.text!
        patientInformation.LastName = txtLastName.text!
        patientInformation.MiddleName = txtMiddleName.text!
        patientInformation.HomePhoneNumber = txtHomePhone.text!
        patientInformation.DOB = txtDOB.text!
        patientInformation.Email = txtEmail.text!
        patientInformation.Address1 = txtAddress.text!
        patientInformation.Suburb = txtSuburb.text!
        patientInformation.Postcode = txtPostCode.text!
        patientInformation.CountryName = txtCountry.text!
        postUpdatePatientInfo.data = patientInformation
        
        UserService.postUpdateProfile(postUpdatePatientInfo) { [weak self] (response) in
            print(response)
            if let _ = self {
                if response.result.isSuccess {
                    if let _ = response.result.value {
                        if let dataTeleheathUserDetail = Mapper<DataTeleheathUserDetail>().map(response.result.value) {
                            if dataTeleheathUserDetail.message == "success"  {
                                self!.alertView.alertMessage("Success", message: "Update Patient Information Success!")
                                
                            }else{
                                if let errorModel = Mapper<ErrorModel>().map(response.result.value){
                                    self!.alertView.alertMessage("Error", message:Context.getErrorMessage(errorModel.ErrorType))
                                }
                            }
                        }
                    }
                } else {
                    self?.showMessageNoNetwork()
                }
                
            }
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    override func viewWillAppear(animated: Bool) {
        self.navigationController?.navigationBarHidden = false
        self.navigationController?.navigationBar.topItem?.title = "Back"
    }
    
}
