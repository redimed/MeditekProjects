//
//  SubmitInjuryViewController.swift
//  UrgentCare Sport
//
//  Created by Giap Vo Duc on 11/3/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//
import UIKit
import Alamofire
import SwiftyJSON
import ObjectMapper

class SubmitInjuryViewController: BaseViewController,SSRadioButtonControllerDelegate,UITextViewDelegate {
    
    @IBOutlet weak var descriptionTextView: UITextView!
    @IBOutlet weak var autoTableView: UITableView!
    @IBOutlet weak var firstNameTextField: UITextField!
    @IBOutlet weak var lastNameTextField: UITextField!
    @IBOutlet weak var contactPhoneTextField: UITextField!
    @IBOutlet weak var suburbTextField: UITextField!
    @IBOutlet weak var birthDayTextField: UITextField!
    @IBOutlet weak var emailTextField: UITextField!
    @IBOutlet weak var companyName: UITextField!
    @IBOutlet weak var contactPersonTextField: UITextField!
    @IBOutlet weak var companyPhoneNumberTextField: UITextField!
    @IBOutlet weak var typeRequest: UITextField!
    
    @IBOutlet weak var btnYes: SSRadioButton!
    @IBOutlet weak var btnNo: SSRadioButton!
    @IBOutlet weak var btnPhysio: SSRadioButton!
    @IBOutlet weak var btnExercise: SSRadioButton!
    @IBOutlet weak var btnHandTherapy: SSRadioButton!
    @IBOutlet weak var btnMakeAppointment: DesignableButton!
    
    @IBOutlet weak var Navigationbar: UINavigationBar!
    @IBOutlet weak var scrollView: UIScrollView!
    @IBOutlet weak var GPReferralLabel: UILabel!
    @IBOutlet weak var typeTreatment: UILabel!
    @IBOutlet weak var selectStaff: UIBarButtonItem!
    @IBOutlet weak var SelectContactPerson: UIButton!
    
    var pickerView = UIPickerView()
    var autocompleteUrls = [String]()
    var datePicker = UIDatePicker()
    var checkDOB = true
    var dateofbirth: String = ""
    var GPReferral : String = "Y"
    var radioButtonController: SSRadioButtonsController?
    var radioButtonTypeController: SSRadioButtonsController?
    var NavigateBarTitle: String!
    var SportTye: String!
    var pastUrls : [String] = []
    var GP:String = "N"
    var treatment:String = "N"
    var physiotherapy:String = "N"
    var specialist:String = "N"
    var handTherapy:String = "N"
    var exerciseRehab:String = "N"
    let userInfo = LoginResponse()
    var companyInfo = DetailCompanyResponse()
    var staff = Staff()
    var detailCompanyData = DetailCompanyData()
    var pickOption = ["","Telehealth", "Onsite"]
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        if (Context.getDataDefasults(Define.keyNSDefaults.userLogin) as! String != "") {
            let companyInfoDict : NSDictionary = Context.getDataDefasults(Define.keyNSDefaults.companyInfor) as! NSDictionary
            companyInfo = Mapper().map(companyInfoDict)!
            if(companyInfo.data.count > 0){
                detailCompanyData = companyInfo.data[0]
                companyName.text = detailCompanyData.CompanyName
            }
        }else{
            selectStaff.enabled = false
            selectStaff.title = nil
            SelectContactPerson.hidden = true
        }
        Navigationbar.topItem?.title = NavigateBarTitle
        SetHideShowButton()
        SetDelegate()
        PickerView()
        DatepickerMode()
    }
    func PickerView(){
        let toolBar = UIToolbar()
        toolBar.barStyle = .Default
        toolBar.translucent = true
        toolBar.tintColor = UIColor.blackColor()
        toolBar.sizeToFit()
        
        
        
        // Adds the buttons
        let spaceButton = UIBarButtonItem(barButtonSystemItem: .FlexibleSpace, target: nil, action: nil)
        let doneBarButton = UIBarButtonItem(barButtonSystemItem: .Done,
                                            target: view, action: #selector(UIView.endEditing(_:)))
        //        let cancelButton = UIBarButtonItem(title: "Cancel", style: .Plain, target: self, action: "cancelClick")
        toolBar.setItems([spaceButton,doneBarButton], animated: false)
        toolBar.userInteractionEnabled = true
        
        
        // Adds the toolbar to the view
        typeRequest.inputView = pickerView
        typeRequest.inputAccessoryView = toolBar
        
    }

    func SetHideShowButton(){
        if GP == "Y" {
            GPReferralLabel.hidden = true
            btnYes.hidden = true
            btnNo.hidden = true
            GPReferral = ""
        }
        if treatment == "N"{
            typeTreatment.hidden = true
            btnHandTherapy.hidden = true
            btnExercise.hidden = true
            btnPhysio.hidden = true
            companyName.center.y += 30.0
            companyName.alpha = 1.0
        }
        radioButtonController = SSRadioButtonsController(buttons: btnYes, btnNo)
        radioButtonController!.shouldLetDeSelect = false
        btnYes.selected = true
        //type of treatment
        radioButtonTypeController = SSRadioButtonsController(buttons: btnPhysio, btnExercise,btnHandTherapy)
        radioButtonTypeController!.shouldLetDeSelect = false
    }
    func SetDelegate(){
        suburbTextField.delegate = self
        firstNameTextField.delegate = self
        lastNameTextField.delegate = self
        contactPhoneTextField.delegate = self
        emailTextField.delegate = self
        birthDayTextField.delegate = self
        descriptionTextView.delegate = self
        companyName.delegate = self
        contactPersonTextField.delegate = self
        companyPhoneNumberTextField.delegate = self
        radioButtonController!.delegate = self
        radioButtonTypeController!.delegate = self
        pickerView.delegate = self
        typeRequest.delegate = self
        //scrollView.delegate = self
    }
    
    override func viewWillAppear(animated: Bool) {
    }
    override func viewDidAppear(animated: Bool) {
        getStaff()
        customTextField(Constants.ColorCustom.colorCustomBrow)
        radioButtonTypeController!.shouldLetDeSelect = false
    }
    func textFieldDidBeginEditing(textField: UITextField) {
        if textField == suburbTextField {
            let scrollPoint: CGPoint  = CGPointMake(0.0, 100.0);
            self.scrollView.setContentOffset(scrollPoint, animated: true)
        }
    }
    func getStaff(){
        if(Context.getDataDefasults(Define.keyNSDefaults.DetailStaffCheck) as! String == "YES"){
            Context.deleteDatDefaults(Define.keyNSDefaults.DetailStaffCheck)
            let data : NSDictionary = Context.getDataDefasults(Define.keyNSDefaults.DetailStaff) as! NSDictionary
            staff = Mapper().map(data)!
            firstNameTextField.text = staff.FirstName
            lastNameTextField.text = staff.LastName
            contactPhoneTextField.text = staff.HomePhoneNumber
            emailTextField.text = staff.Email1
            birthDayTextField.text = staff.DOB
            suburbTextField.text = staff.Suburb
        }
        if(Context.getDataDefasults(Define.keyNSDefaults.DetailSiteCheck) as! String == "YES"){
            Context.deleteDatDefaults(Define.keyNSDefaults.DetailSiteCheck)
            let data : NSDictionary = Context.getDataDefasults(Define.keyNSDefaults.DetailSite) as! NSDictionary
            let site :Site = Mapper().map(data)!
            print(site)
            contactPersonTextField.text = site.ContactName
            companyPhoneNumberTextField.text = site.HomePhoneNumber
        }
    }
    //select radio button
    func didSelectButton(aButton: UIButton?) {
        if aButton?.titleLabel?.text == "Yes"{
            GPReferral = "Y"
        }else if aButton?.titleLabel?.text == "No" {
            GPReferral = "N"
        }
        if aButton?.titleLabel?.text == "Exercise Rehab"{
            exerciseRehab = "Y"
            physiotherapy = "N"
            handTherapy = "N"
        } else if aButton?.titleLabel?.text == "Physiotherapy" {
            physiotherapy = "Y"
            exerciseRehab = "N"
            handTherapy = "N"
        } else if  aButton?.titleLabel?.text == "Hand Therapy" {
            handTherapy = "Y"
            exerciseRehab = "N"
            physiotherapy = "N"
        }
    }
    func customTextField(color:UIColor){
        var arrText : [UITextField] = [firstNameTextField,lastNameTextField,contactPhoneTextField,suburbTextField,birthDayTextField,emailTextField,companyName,contactPersonTextField,companyPhoneNumberTextField]
        for i in 0 ..< arrText.count  {
            borderTextFieldValid(arrText[i], color: color)
        }
    }
    @IBAction func makeAppointmentButton(sender: AnyObject) {
        //check netword
        if Context.isConnectedToNetwork() == false {
            OpenWifi()
        }else {
            checkfield()
            if firstNameTextField.text == "" || lastNameTextField.text == "" || contactPhoneTextField.text == "" || companyName.text == "" || contactPersonTextField.text == ""  || typeRequest.text == "" {
                alertMessage(Define.MessageString.required, message: "Please check your information!")
            }else {
                if Context.checkMaxLength(firstNameTextField, length: 50) == false{
                    alertMessage(Define.MessageString.required, message: "First name is max 50 character!")
                }else if Context.checkMaxLength(lastNameTextField, length: 250) == false {
                    alertMessage(Define.MessageString.required, message: "Last name is max 250 character!")
                }else if Context.checkMaxLength(contactPhoneTextField, length: 100) == false{
                    alertMessage(Define.MessageString.required, message: "Contact phone is max 250 character!")
                }else if Context.validatePhoneNumber(contactPhoneTextField.text!,regex:RegexString.MobileNumber) == false {
                    borderTextFieldValid(contactPhoneTextField, color: Constants.ColorCustom.colorCustomRed)
                    alertMessage(Define.MessageString.required, message: "Please check your phonenumber!")
                }
                else if birthDayTextField.text != "" && checkDOB == false {
                    alertMessage(Define.MessageString.required, message: "Please check your BirthDay!")
                    borderTextFieldValid(birthDayTextField, color: Constants.ColorCustom.colorCustomRed)
                }
                else if emailTextField.text != "" && Context.validatePhoneNumber(emailTextField.text!,regex:RegexString.Email) == false {
                    alertMessage(Define.MessageString.required, message: "Please check your email!")
                    borderTextFieldValid(emailTextField, color: Constants.ColorCustom.colorCustomRed)
                }
                else if companyPhoneNumberTextField.text != "" && Context.validatePhoneNumber(companyPhoneNumberTextField.text!,regex:RegexString.PhoneNumber) == false {
                    borderTextFieldValid(companyPhoneNumberTextField, color: Constants.ColorCustom.colorCustomRed)
                    alertMessage(Define.MessageString.required, message: "Please check your company phone number!")
                }
                else {
                    sendingData()
                }
            }
        }
    }
    func sendingData(){
        btnMakeAppointment.enabled = false
        self.showloading(Define.MessageString.PleaseWait)
        var requestAppointPost = RequestAppointPost()
        requestAppointPost = loadata()
        UserService.postRequestAppointment(requestAppointPost) { [weak self] (response) in
            print(response.result.value)
            if let _ = self {
                if response.result.isSuccess {
                    if let _ = response.result.value {
                        if let requestAppointResponse = Mapper<RequestAppointResponse>().map(response.result.value) {
                            self!.hideLoading()
                            if(requestAppointResponse.status == "success"){
                                self!.alertView.alertMessage("Success", message: "Request Telehealth Success!")
                                let loginViewController :ViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("ViewControllerID") as! ViewController
                                let time = dispatch_time(DISPATCH_TIME_NOW, Int64(self!.delay))
                                dispatch_after(time, dispatch_get_main_queue(), {
                                    self?.navigationController?.pushViewController(loginViewController, animated: true)
                                })

                            }else{
                                self?.hideLoading()
                                if let errorModel = Mapper<ErrorModel>().map(response.result.value){
                                    self!.alertView.alertMessage("Error", message:Context.getErrorMessage(errorModel.ErrorType))
                                }
                            }
                        }
                    }
                } else {
                    self!.hideLoading()
                    self?.showMessageNoNetwork()
                }
            }
        }
    }
    func loadata() -> RequestAppointPost {
        let requestAppointPost = RequestAppointPost()
        let requestAppointData = RequestAppointData()
        let patientAppointment = PatientAppointment()
        
        requestAppointData.RequestDate = Context.NowDate()
        requestAppointData.Type = typeRequest.text!
        requestAppointData.Description = descriptionTextView.text!
        
        patientAppointment.FirstName = firstNameTextField.text!
        patientAppointment.LastName = lastNameTextField.text!
        patientAppointment.Email = emailTextField.text!
        patientAppointment.PhoneNumber = contactPhoneTextField.text!
        patientAppointment.DOB = birthDayTextField.text!
        patientAppointment.Suburb = suburbTextField.text!
        
        
        let appointmentDataGPReferral = AppointmentData()
        appointmentDataGPReferral.Name = "GPReferral"
        appointmentDataGPReferral.Value = GPReferral
        requestAppointData.appointmentData.append(appointmentDataGPReferral)
        
        let appointmentDataPhysiotherapy = AppointmentData()
        appointmentDataPhysiotherapy.Name = "physiotherapy"
        appointmentDataPhysiotherapy.Value = physiotherapy
        requestAppointData.appointmentData.append(appointmentDataPhysiotherapy)
        
        let appointmentDataSpecialist = AppointmentData()
        appointmentDataSpecialist.Name = "specialist"
        appointmentDataSpecialist.Value = specialist
        requestAppointData.appointmentData.append(appointmentDataSpecialist)
        
        let appointmentDataHandTherapy = AppointmentData()
        appointmentDataHandTherapy.Name = "handTherapy"
        appointmentDataHandTherapy.Value = handTherapy
        requestAppointData.appointmentData.append(appointmentDataHandTherapy)
        
//        let appointmentDataHandPhysiotherapy = AppointmentData()
//        appointmentDataHandPhysiotherapy.Name = "physiotherapy"
//        appointmentDataHandPhysiotherapy.Value = physiotherapy
//        requestAppointData.appointmentData.append(appointmentDataHandPhysiotherapy)
        
        let appointmentDataGP = AppointmentData()
        appointmentDataGP.Name = "GP"
        appointmentDataGP.Value = GP
        requestAppointData.appointmentData.append(appointmentDataGP)
        
        let appointmentDataTreatment = AppointmentData()
        appointmentDataTreatment.Name = "treatment"
        appointmentDataTreatment.Value = treatment
        requestAppointData.appointmentData.append(appointmentDataTreatment)
        
        let appointmentDataCompanyName = AppointmentData()
        appointmentDataCompanyName.Name = "companyName"
        appointmentDataCompanyName.Value = companyName.text!
        requestAppointData.appointmentData.append(appointmentDataCompanyName)
        
        let appointmentDataCompanyPhoneNumber = AppointmentData()
        appointmentDataCompanyPhoneNumber.Name = "companyPhoneNumber"
        appointmentDataCompanyPhoneNumber.Value = companyPhoneNumberTextField.text!
        requestAppointData.appointmentData.append(appointmentDataCompanyPhoneNumber)
        
        let appointmentDataContactPerson = AppointmentData()
        appointmentDataContactPerson.Name = "contactPerson"
        appointmentDataContactPerson.Value = contactPersonTextField.text!
        requestAppointData.appointmentData.append(appointmentDataContactPerson)
        
        let appointmentDataExerciseRehab = AppointmentData()
        appointmentDataExerciseRehab.Name = "exerciseRehab"
        appointmentDataExerciseRehab.Value = exerciseRehab
        requestAppointData.appointmentData.append(appointmentDataExerciseRehab)
        
        requestAppointData.patientAppointment = patientAppointment
        requestAppointPost.data = requestAppointData
        
        return requestAppointPost
    }
    //change color border
    func borderTextFieldValid(textField:UITextField,color:UIColor){
        let border = CALayer()
        let width = CGFloat(1.0)
        border.borderColor = color.CGColor
        border.frame = CGRect(x: 0, y: textField.frame.size.height - width, width:  textField.frame.size.width, height: textField.frame.size.height)
        
        border.borderWidth = width
        textField.layer.addSublayer(border)
        textField.layer.masksToBounds = true
        
    }
    //check textfile is reqired
    func checkfield() {
        var arrText : [UITextField] = [firstNameTextField,lastNameTextField,contactPhoneTextField,companyName,contactPersonTextField,typeRequest]
        for i in 0 ..< arrText.count  {
            if arrText[i].text == "" {
                borderTextFieldValid(arrText[i], color: Constants.ColorCustom.colorCustomRed)
            }else{
                arrText[i].layer.borderWidth = 0
            }
        }
    }
    //search suburb
    @IBAction func suburbChange(sender: AnyObject) {
        searchAutocompleteEntriesWithSubstring(suburbTextField.text!)
    }
    
    func searchAutocompleteEntriesWithSubstring(substring: String)
    {
        let dataSource = pastUrls
        
        let searchString = substring.uppercaseString
        let predicate = NSPredicate(format: "SELF beginswith[c] %@", searchString)
        let searchDataSource = dataSource.filter { predicate.evaluateWithObject($0) }
        autocompleteUrls = searchDataSource
        if autocompleteUrls.count == 0 {
            autoTableView.hidden = true
        }else{
            autoTableView.hidden = false
        }
        autoTableView.reloadData()
        
    }
    
    //show date picker
    func DatepickerMode(){
        birthDayTextField.tintColor = UIColor.clearColor()
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
        birthDayTextField.inputView = datePicker
        birthDayTextField.inputAccessoryView = toolBar
    }
    //Done button in datepicker
    func doneClick() {
        let dateFormatter = NSDateFormatter()
        let SaveDatetime = NSDateFormatter()
        SaveDatetime.dateFormat = "dd/MM/yyyy"
        dateFormatter.dateFormat = "dd/MM/yyyy"
        dateofbirth = SaveDatetime.stringFromDate(datePicker.date)
        birthDayTextField.text = dateFormatter.stringFromDate(datePicker.date)
        birthDayTextField.resignFirstResponder()
        if(Context.compareDate(datePicker.date)){
            checkDOB = true
            birthDayTextField.layer.borderWidth = 0
        }else{
            checkDOB = false
            borderTextFieldValid(birthDayTextField, color: Constants.ColorCustom.colorCustomRed)
        }
    }
    //Cancel button in datepicker
    func cancelClick() {
        birthDayTextField.resignFirstResponder()
    }
    //Show alert message
    func alertMessage(title : String,message : String){
        let alertController = UIAlertController(title: title, message: message, preferredStyle: .Alert)
        let OKAction = UIAlertAction(title: "OK", style: .Default) { (action) in
            //Handle if click OK
        }
        alertController.addAction(OKAction)
        self.presentViewController(alertController, animated: true) {}
    }
    //open wifi
    func OpenWifi(){
        let alertController = UIAlertController(title: "No Internet Connection", message: "Make sure your device is connected to the internet ", preferredStyle: .Alert)
        
        let cancelAction = UIAlertAction(title: "Cancel", style: .Cancel) { (action) in}
        alertController.addAction(cancelAction)
        
        let OKAction = UIAlertAction(title: "OK", style: .Default) { (action) in
            UIApplication.sharedApplication().openURL(NSURL(string:UIApplicationOpenSettingsURLString)!);
        }
        alertController.addAction(OKAction)
        self.presentViewController(alertController, animated: true) {}
    }
    
    //Check out focus textfield
    func textFieldDidEndEditing(textField: UITextField) {
        switch textField {
        case firstNameTextField :
            if firstNameTextField.text != "" &&  Context.checkMaxLength(firstNameTextField, length: 50) == true {
                borderTextFieldValid(firstNameTextField, color: Constants.ColorCustom.colorCustomBrow)
                firstNameTextField.text = firstNameTextField.text?.capitalizeFirst
            }else{
                borderTextFieldValid(firstNameTextField, color: Constants.ColorCustom.colorCustomRed)
            }
        case lastNameTextField:
            if lastNameTextField.text != "" &&  Context.checkMaxLength(lastNameTextField, length: 250) == true {
                borderTextFieldValid(lastNameTextField, color: Constants.ColorCustom.colorCustomBrow)
                lastNameTextField.text = lastNameTextField.text?.capitalizeFirst
            }else{
                borderTextFieldValid(lastNameTextField, color: Constants.ColorCustom.colorCustomRed)
            }
        case contactPhoneTextField:
            if Context.validatePhoneNumber(contactPhoneTextField.text!,regex:RegexString.MobileNumber) == false || contactPhoneTextField.text == "" {
                borderTextFieldValid(contactPhoneTextField, color: Constants.ColorCustom.colorCustomRed)
            }else {
                borderTextFieldValid(contactPhoneTextField, color: Constants.ColorCustom.colorCustomBrow)
            }
            
        case typeRequest:
            if Context.validatePhoneNumber(typeRequest.text!,regex:RegexString.MobileNumber) == false || typeRequest.text == "" {
                borderTextFieldValid(typeRequest, color: Constants.ColorCustom.colorCustomRed)
            }else {
                borderTextFieldValid(typeRequest, color: Constants.ColorCustom.colorCustomBrow)
            }
        case emailTextField:
            if emailTextField.text != ""{
                if Context.validatePhoneNumber(emailTextField.text!,regex:RegexString.Email) == false {
                    borderTextFieldValid(emailTextField, color: Constants.ColorCustom.colorCustomRed)
                }else {
                    borderTextFieldValid(emailTextField, color: Constants.ColorCustom.colorCustomBrow)
                }
            }else {
                borderTextFieldValid(emailTextField, color: Constants.ColorCustom.colorCustomBrow)
            }
        case companyName:
            if companyName.text != "" {
                borderTextFieldValid(companyName, color: Constants.ColorCustom.colorCustomBrow)
                companyName.text = companyName.text?.capitalizeFirst
            }else {
                borderTextFieldValid(companyName, color: Constants.ColorCustom.colorCustomRed)
            }
        case contactPersonTextField:
            if contactPersonTextField.text != "" {
                borderTextFieldValid(contactPersonTextField, color: Constants.ColorCustom.colorCustomBrow)
                contactPersonTextField.text = contactPersonTextField.text?.capitalizeFirst
            }else {
                borderTextFieldValid(contactPersonTextField, color: Constants.ColorCustom.colorCustomRed)
            }
        case companyPhoneNumberTextField:
            if companyPhoneNumberTextField.text != "" {
                if Context.validatePhoneNumber(companyPhoneNumberTextField.text!,regex:RegexString.PhoneNumber) == false {
                    borderTextFieldValid(companyPhoneNumberTextField, color: Constants.ColorCustom.colorCustomRed)
                }else {
                    borderTextFieldValid(companyPhoneNumberTextField, color: Constants.ColorCustom.colorCustomBrow)
                }
            }else {
                borderTextFieldValid(companyPhoneNumberTextField, color: Constants.ColorCustom.colorCustomBrow)
            }
        case birthDayTextField:
            if Context.compareDate(datePicker.date) == false {
                borderTextFieldValid(birthDayTextField, color: Constants.ColorCustom.colorCustomRed)
            }else {
                borderTextFieldValid(birthDayTextField, color: Constants.ColorCustom.colorCustomBrow)
            }
            
        case suburbTextField :
            autoTableView.hidden = true
        default: break
        }
    }
    
    func textViewDidEndEditing(textView: UITextView) {
        if textView == descriptionTextView {
            if descriptionTextView.text != "" {
                descriptionTextView.text = descriptionTextView.text.capitalizeFirst
            }
        }
    }
    func SelectStaf(){
        let listStaffViewController :UIViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("ListStaffViewControllerID") as! ListStaffViewController
        self.navigationController?.pushViewController(listStaffViewController, animated: true)
    }
    @IBAction func actionSelectStaff(sender: AnyObject) {
        SelectStaf()
    }
    
    @IBAction func actionSelectContactPerson(sender: AnyObject) {
        let listContactPerson :UIViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("ListContactPersonViewControllerID") as! ListContactPersonViewController
        self.navigationController?.pushViewController(listContactPerson, animated: true)
    }
    
}

extension SubmitInjuryViewController: UITableViewDelegate,UITableViewDataSource {
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return autocompleteUrls.count
    }
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("AutoCompleteRowIdentifier", forIndexPath: indexPath) as! AutocompleteTableViewCell
        cell.name.text = autocompleteUrls[indexPath.row]
        return cell
    }
    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        suburbTextField.text = autocompleteUrls[indexPath.row]
        autoTableView.hidden = true
    }
    
    @IBAction func actionBack(sender: AnyObject) {
        self.navigationController!.popToRootViewControllerAnimated(true)
    }
}

extension SubmitInjuryViewController: UIPickerViewDataSource, UIPickerViewDelegate {
    func numberOfComponentsInPickerView(pickerView: UIPickerView) -> Int {
        return 1
    }
    func pickerView(pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        return pickOption.count
    }
    func pickerView(pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
        return pickOption[row]
    }
    func pickerView(pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
        print("row",row)
        typeRequest.text = pickOption[row]
    }
    
}
