//
//  MoreDetail.swift
//  RedimedAfterHours
//
//  Created by DucManh on 9/16/15.
//  Copyright (c) 2015 DucManh. All rights reserved.
//

import UIKit
protocol moreDetailDelegate{
    func tranferDataController(copntroller:MoreDetail,moreData :Dictionary<String, String>)
}
class MoreDetail: UIViewController,UITextViewDelegate,UITextFieldDelegate,UIPickerViewDelegate,UIPickerViewDataSource {
    
    @IBOutlet weak var stateTextField: DesignableTextField!
    @IBOutlet weak var surburbTextField: DesignableTextField!
    @IBOutlet weak var postCodeTextField: DesignableTextField!
    @IBOutlet weak var Address1TextField: DesignableTextField!
    @IBOutlet weak var addressTextField: DesignableTextField!
    @IBOutlet weak var mailTextField: DesignableTextField!
    var datePicker = UIDatePicker()
    @IBOutlet weak var dateTextField: UITextField!
    @IBOutlet weak var dobTextFiled: DesignableTextField!
    var colors = ["Victoria","New South Wales","Queensland ","Australia Capital Territory","Northern Territory","Western Australia ","South Australia ","Tasmania"]
    
    var informationData: Dictionary<String, String> = [:]
     var delegateInfor : moreDetailDelegate? = nil
    
    override func viewDidLoad() {
        
        super.viewDidLoad()
        
        datepickerMode()
        pickerviewMode()
        dobTextFiled.delegate = self
        mailTextField.delegate = self
        addressTextField.delegate = self
        Address1TextField.delegate = self
        postCodeTextField.delegate = self
        surburbTextField.delegate = self
        stateTextField.delegate = self
        addressTextField.autocapitalizationType = UITextAutocapitalizationType(rawValue: 1)!
        addressTextField.autocapitalizationType  = UITextAutocapitalizationType(rawValue: 1)!
        surburbTextField.autocapitalizationType = UITextAutocapitalizationType(rawValue: 1)!
        
        //load data 
        dobTextFiled.text = informationData["DOB"]
        mailTextField.text = informationData["email"]
        addressTextField.text = informationData["address1"]
        Address1TextField.text = informationData["address2"]
        surburbTextField.text = informationData["surburb"]
        postCodeTextField.text = informationData["postCode"]
        stateTextField.text = informationData["state"]
        
        //end load data
    }
    
    @IBAction func submitMakeAppointment(sender: AnyObject) {
        if(!mailTextField.text.isEmpty && !isValidEmail(mailTextField.text)){
            changeBorderColor(mailTextField)
            AlertShow("Notification",message: "Email is invalid",addButtonWithTitle: "OK")
        }else{
            var alert: UIAlertView = UIAlertView(title: "Make Appointment", message:"Please wait...", delegate: nil, cancelButtonTitle: "Cancel", otherButtonTitles: "OK")
            var loadingIndicator: UIActivityIndicatorView = UIActivityIndicatorView(frame: CGRectMake(50, 10, 37, 37)) as UIActivityIndicatorView
            loadingIndicator.center = self.view.center;
            loadingIndicator.hidesWhenStopped = true
            loadingIndicator.activityIndicatorViewStyle = UIActivityIndicatorViewStyle.Gray
            loadingIndicator.startAnimating();
            
            alert.setValue(loadingIndicator, forKey: "accessoryView")
            loadingIndicator.startAnimating()
            alert.show();
        }
        
        
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    @IBAction func clickDOBbutton(sender: AnyObject) {
        datepickerMode()
    }

    //Done button in datepicker
    func doneClick() {
        var dateFormatter = NSDateFormatter()
        dateFormatter.dateStyle = .ShortStyle
        dateTextField.text = dateFormatter.stringFromDate(datePicker.date)
        dateTextField.resignFirstResponder()
    }
    //cancel button in datepicker
    func cancelClick() {
        dateTextField.resignFirstResponder()
    }
    func changeColorClicktxtField(name:AnyObject){
        name.layer.borderColor = UIColor(red: 41/255, green: 128/255, blue: 185/255, alpha: 1.0).CGColor
        name.layer.borderWidth = 1
    }
    func changeColorOuttxtField(name:AnyObject){
        name.layer.borderWidth = 0
    }
    func textFieldDidBeginEditing(textField: UITextField) {
        
        changeColorClicktxtField(textField)
    }
    func isValidEmail(mail:String) -> Bool {
        let emailRegEx = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
        let emailTest = NSPredicate(format:"SELF MATCHES %@", emailRegEx)
        return emailTest.evaluateWithObject(mail)
    }
    func textFieldDidEndEditing(textField: UITextField) {
        changeColorOuttxtField(textField)
        if(textField == mailTextField){
            if(!mailTextField.text.isEmpty && !isValidEmail(mailTextField.text)){
                changeBorderColor(mailTextField)
                AlertShow("Notification",message: "Email is invalid",addButtonWithTitle: "OK")
            }
        }
        if(textField == postCodeTextField){
            if(postCodeTextField.text.length > 4){
                changeBorderColor(postCodeTextField)
                 AlertShow("Notification",message: "Postcode is invalid",addButtonWithTitle: "OK")
            }
        }
    }
    func changeBorderColor(name:AnyObject){
        name.layer.borderColor = UIColor(red: 232/255, green: 145/255, blue: 147/255, alpha: 1.0).CGColor
        name.layer.borderWidth = 1
        name.layer.cornerRadius = 5
    }
    func pickerviewMode(){
        let picker: UIPickerView
        picker = UIPickerView(frame: CGRectMake(0, 200, view.frame.width, 300))
        picker.backgroundColor = .whiteColor()
        
        picker.showsSelectionIndicator = true
        picker.delegate = self
        picker.dataSource = self
        
        let toolBar = UIToolbar()
        toolBar.barStyle = UIBarStyle.Default
        toolBar.translucent = true
        toolBar.tintColor = UIColor(red: 92/255, green: 216/255, blue: 255/255, alpha: 1)
        toolBar.sizeToFit()
        
        let doneButton = UIBarButtonItem(title: "Done", style: UIBarButtonItemStyle.Plain, target: self, action: "donePicker")
        let spaceButton = UIBarButtonItem(barButtonSystemItem: UIBarButtonSystemItem.FlexibleSpace, target: nil, action: nil)
        let cancelButton = UIBarButtonItem(title: "Cancel", style: UIBarButtonItemStyle.Plain, target: self, action: "donePicker")
        
        toolBar.setItems([spaceButton, doneButton], animated: false)
        toolBar.userInteractionEnabled = true
        
        stateTextField.inputView = picker
        stateTextField.inputAccessoryView = toolBar
    }
    @IBAction func stateClickPickerView(sender: AnyObject) {
        pickerviewMode()
    }
    func datepickerMode(){
        
        dateTextField.tintColor = UIColor.clearColor()
        datePicker.datePickerMode = .Date
        let toolBar = UIToolbar()
        toolBar.barStyle = .Default
        toolBar.translucent = true
        toolBar.tintColor = UIColor(red: 92/255, green: 216/255, blue: 255/255, alpha: 1)
        toolBar.sizeToFit()
        
        // Adds the buttons
        var doneButton = UIBarButtonItem(title: "Done", style: .Plain, target: self, action: "doneClick")
        var spaceButton = UIBarButtonItem(barButtonSystemItem: .FlexibleSpace, target: nil, action: nil)
        var cancelButton = UIBarButtonItem(title: "Cancel", style: .Plain, target: self, action: "cancelClick")
        toolBar.setItems([cancelButton,spaceButton, doneButton], animated: false)
        toolBar.userInteractionEnabled = true
        
        // Adds the toolbar to the view
        dateTextField.inputView = datePicker
        dateTextField.inputAccessoryView = toolBar
    }

    func numberOfComponentsInPickerView(pickerView: UIPickerView) -> Int {
        return 1
    }
    
    func pickerView(pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        return colors.count
    }
    
    func pickerView(pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
        return colors[row]
    }
    
    func pickerView(pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
        stateTextField.text = colors[row]
    }
    
    func donePicker() {
        
        stateTextField.resignFirstResponder()
        
    }
    func AlertShow(title:String,message:String,addButtonWithTitle:String){
        let alert = UIAlertView()
        alert.title = title
        alert.message = message
        alert.addButtonWithTitle(addButtonWithTitle)
        alert.show()
    }

    @IBAction func backButton(sender: UIBarButtonItem) {
        if(!mailTextField.text.isEmpty && !isValidEmail(mailTextField.text)){
            
            AlertShow("Notification",message: "Email is invalid",addButtonWithTitle: "OK")
            
        }else{
            informationData["DOB"] = dobTextFiled.text
            informationData["email"] = mailTextField.text
            informationData["address1"] = addressTextField.text
            informationData["address2"] = Address1TextField.text
            informationData["surburb"] = surburbTextField.text
            informationData["postCode"] = postCodeTextField.text
            informationData["state"] = stateTextField.text
            delegateInfor?.tranferDataController(self, moreData: informationData)
            dismissViewControllerAnimated(true, completion: nil)
        }
        
    }
}