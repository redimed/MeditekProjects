//
//  UpdateProfileViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 2/29/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit

class UpdateProfileViewController: UIViewController,UITextFieldDelegate {
    @IBOutlet weak var firstNameTxt: UITextField!
    @IBOutlet weak var lastNameTxt: UITextField!
    @IBOutlet weak var homePhoneTxt: UITextField!
    @IBOutlet weak var dobTxt: UITextField!
    @IBOutlet weak var emailTxt: UITextField!
    @IBOutlet weak var addressTxt: UITextField!
    @IBOutlet weak var suburbbTxt: UITextField!
    @IBOutlet weak var postCodeTxt: UITextField!
    @IBOutlet weak var countryTxt: UITextField!
    @IBOutlet weak var imageView: UIImageView!
    
    var requestTelehealthService = RequestTelehealthService()
    let patientService = PatientService()
    let colorCustomRed = UIColor.colorRBGValue(redValue: 232, greenValue: 145, blueValue: 147, alphaValue: 1.0)
    let colorAthenGray = UIColor.colorRBGValue(redValue: 202, greenValue: 202, blueValue: 208, alphaValue: 1.0)
    let alertView = UIAlertView()
    
    var patientInformation : PatientContainer!
    var datePicker = UIDatePicker()
    var dateofbirth: String = ""
    var checkDOB = true
    
    let viewSuburb = UIView()
    var tableView: UITableView =  UITableView()
    var autocompleteUrls = [String]()
    var pastUrls : [String] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        if patientInformation != nil {
            firstNameTxt.text = patientInformation.FirstName
            lastNameTxt.text = patientInformation.LastName
            homePhoneTxt.text = patientInformation.HomePhoneNumber
            dobTxt.text = patientInformation.DOB
            emailTxt.text = patientInformation.Email1
            addressTxt.text = patientInformation.Address1
            suburbbTxt.text = patientInformation.Suburb
            postCodeTxt.text = patientInformation.Postcode
            countryTxt.text = patientInformation.Country
            //            self.patientService.getImage((patientInformation?.ImageUID)!, completionHandler: { image in
            self.imageView.image = patientInformation.Image
            //            })
            
        }
        autocompleteUrls = requestTelehealthService.loadDataJson()
        pastUrls = autocompleteUrls
        DatepickerMode()
        //        addCustomView()
        // Do any additional setup after loading the view.
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func updateProfileButton(sender: AnyObject) {
        showloading("Please wait...")
        patientInformation.FirstName = firstNameTxt.text
        patientInformation.LastName = lastNameTxt.text
        patientInformation.HomePhoneNumber = homePhoneTxt.text
        patientInformation.DOB = dobTxt.text
        patientInformation.Email1 = emailTxt.text
        patientInformation.Address1 = addressTxt.text
        patientInformation.Suburb = suburbbTxt.text
        patientInformation.Postcode = postCodeTxt.text
        patientInformation.Country = countryTxt.text
        
        patientService.updateInfomationPatient(patientInformation, completionHandler: {
            data in
            if data["message"] == "success"{
                self.hideLoading()
                self.alertView.alertMessage("", message: "Update Success")
                self.performSegueWithIdentifier("unwindToProfileSegue", sender: self)
            }else{
                self.hideLoading()
                self.alertView.alertMessage("", message: "Update Error")
            }
        })
       
    }
    
    
    @IBAction func suburbSearchAction(sender: AnyObject) {
        searchAutocompleteEntriesWithSubstring(suburbbTxt.text!)
        if suburbbTxt.text == "" || autocompleteUrls.count == 0 {
            self.viewSuburb.alpha = 0
        }else {
            
            self.viewSuburb.alpha = 1
            
        }
        
    }
    
    func searchAutocompleteEntriesWithSubstring(substring: String)
    {
        autocompleteUrls = requestTelehealthService.handleSearchData(pastUrls, substring: substring)
        if substring == "" {
            autocompleteUrls = pastUrls
        }
        tableView.reloadData()
    }
    
    
    func addCustomView() {
        
        
        viewSuburb.backgroundColor = UIColor.blackColor()
        viewSuburb.translatesAutoresizingMaskIntoConstraints = false
        self.viewSuburb.alpha = 0
        view.addSubview(viewSuburb)
        
        
        tableView.delegate      =   self
        tableView.dataSource    =   self
        tableView.registerClass(UITableViewCell.self, forCellReuseIdentifier: "cell")
        tableView.translatesAutoresizingMaskIntoConstraints = false
        
        viewSuburb.addSubview(tableView)
        
        // view autolayout
        NSLayoutConstraint(item: viewSuburb, attribute: .Height, relatedBy: .Equal, toItem: nil, attribute: .NotAnAttribute, multiplier: 1.0, constant: 120).active = true
        NSLayoutConstraint(item: viewSuburb, attribute: .Leading, relatedBy: .Equal, toItem: view, attribute: .Leading, multiplier: 1.0, constant: 2).active = true
        NSLayoutConstraint(item: viewSuburb, attribute: .Top, relatedBy: .Equal, toItem: suburbbTxt, attribute: .BottomMargin, multiplier: 1.0, constant: 0).active = true
        NSLayoutConstraint(item: viewSuburb, attribute: .CenterX, relatedBy: .Equal, toItem: view, attribute: .CenterX, multiplier: 1.0, constant: 0.0).active = true
        
        
        //table view autolayout
        NSLayoutConstraint(item: tableView, attribute: .Height, relatedBy: .Equal, toItem: nil, attribute: .NotAnAttribute, multiplier: 1.0, constant: 120).active = true
        NSLayoutConstraint(item: tableView, attribute: .Leading, relatedBy: .Equal, toItem: viewSuburb, attribute: .Leading, multiplier: 1.0, constant: 0).active = true
        NSLayoutConstraint(item: tableView, attribute: .CenterX, relatedBy: .Equal, toItem: viewSuburb, attribute: .CenterX, multiplier: 1.0, constant: 0.0).active = true
        NSLayoutConstraint(item: tableView, attribute: .CenterY, relatedBy: .Equal, toItem: viewSuburb, attribute: .CenterY, multiplier: 1.0, constant: 0.0).active = true
        
    }
    
    //show date picker
    func DatepickerMode(){
        dobTxt.tintColor = UIColor.clearColor()
        datePicker.datePickerMode = .Date
        let toolBar = UIToolbar()
        toolBar.barStyle = .Default
        toolBar.translucent = true
        toolBar.tintColor = UIColor.blackColor()
        toolBar.sizeToFit()
        
        // Adds the buttons
        let doneButton = UIBarButtonItem(title: "Done", style: .Plain, target: self, action: "doneClick")
        let spaceButton = UIBarButtonItem(barButtonSystemItem: .FlexibleSpace, target: nil, action: nil)
        let cancelButton = UIBarButtonItem(title: "Cancel", style: .Plain, target: self, action: "cancelClick")
        toolBar.setItems([cancelButton,spaceButton, doneButton], animated: false)
        toolBar.userInteractionEnabled = true
        
        // Adds the toolbar to the view
        dobTxt.inputView = datePicker
        dobTxt.inputAccessoryView = toolBar
    }
    
    //Done button in datepicker
    func doneClick() {
        let dateFormatter = NSDateFormatter()
        let SaveDatetime = NSDateFormatter()
        SaveDatetime.dateFormat = formatTime.formatDate
        dateFormatter.dateFormat = formatTime.formatDate
        dateofbirth = SaveDatetime.stringFromDate(datePicker.date)
        dobTxt.text = dateFormatter.stringFromDate(datePicker.date)
        dobTxt.resignFirstResponder()
        if(requestTelehealthService.compareDate(datePicker.date)){
            checkDOB = true
            requestTelehealthService.borderTextFieldValid(dobTxt, color: colorAthenGray,check: true)
        }else{
            checkDOB = false
            requestTelehealthService.borderTextFieldValid(dobTxt, color: colorCustomRed)
        }
        
    }
    
    //cancel button in datepicker
    func cancelClick() {
        dobTxt.resignFirstResponder()
    }
    
    
    func textFieldDidEndEditing(textField: UITextField) {
        
        switch textField {
        case firstNameTxt:
            if textField.text != "" && requestTelehealthService.checkMaxLength(textField.text! , length: 50) == true {
                requestTelehealthService.borderTextFieldValid(firstNameTxt, color: colorAthenGray,check:true)
                firstNameTxt.text = textField.text!.capitalizeFirst
            }else {
                requestTelehealthService.borderTextFieldValid(firstNameTxt, color: colorCustomRed)
            }
            break;
        case lastNameTxt:
            if textField.text != "" && requestTelehealthService.checkMaxLength(textField.text! , length: 50) == true {
                requestTelehealthService.borderTextFieldValid(lastNameTxt, color: colorAthenGray,check:true)
                lastNameTxt.text = textField.text!.capitalizeFirst
            }else {
                requestTelehealthService.borderTextFieldValid(lastNameTxt, color: colorCustomRed)
            }
            break;
        case homePhoneTxt:
            if textField.text! != "" && config.validateRegex(textField.text!, regex: Regex.PhoneNumber)  == false {
                requestTelehealthService.borderTextFieldValid(homePhoneTxt, color: colorCustomRed)
            }else {
                requestTelehealthService.borderTextFieldValid(homePhoneTxt, color: colorAthenGray,check: true)
            }
            break;
        case dobTxt:
            if textField.text == "" {
                requestTelehealthService.borderTextFieldValid(dobTxt, color: colorCustomRed)
            }
            break;
        case emailTxt:
            if config.validateRegex(textField.text!, regex: Regex.Email)  == false || textField.text == "" {
                requestTelehealthService.borderTextFieldValid(emailTxt, color: colorCustomRed)
            }else {
                requestTelehealthService.borderTextFieldValid(emailTxt, color: colorAthenGray,check:true)
            }
            
            break;
        case postCodeTxt:
            if textField.text! != "" && config.validateRegex(textField.text!, regex: Regex.PostCodeLength)  == false {
                requestTelehealthService.borderTextFieldValid(postCodeTxt, color: colorCustomRed)
            }else {
                requestTelehealthService.borderTextFieldValid(postCodeTxt, color: colorAthenGray,check: true)
            }
            break;
        case addressTxt:
            break;
        case suburbbTxt:
            if textField.text == "" {
                requestTelehealthService.borderTextFieldValid(suburbbTxt, color: colorCustomRed)
            }else {
                requestTelehealthService.borderTextFieldValid(suburbbTxt, color: colorAthenGray,check: true)
            }
            break;
        case countryTxt:
            break;
        default:
            break
            
        }
        
    }
    
}

// TableView
extension UpdateProfileViewController: UITableViewDelegate, UITableViewDataSource {
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return self.autocompleteUrls.count
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        
        let cell:UITableViewCell = tableView.dequeueReusableCellWithIdentifier("cell")! as UITableViewCell
        
        cell.textLabel?.text = self.autocompleteUrls[indexPath.row]
        
        return cell
        
    }
    
    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        suburbbTxt.text = self.autocompleteUrls[indexPath.row]
        requestTelehealthService.borderTextFieldValid(suburbbTxt, color: colorAthenGray,check: true)
        
        
        
        UIView.animateWithDuration(0.5, animations: {
            self.viewSuburb.alpha = 0
        })
        
    }
    
}
