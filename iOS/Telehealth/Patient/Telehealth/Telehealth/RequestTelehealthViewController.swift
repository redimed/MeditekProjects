//
//  RequestTelehealthViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 1/18/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit


class RequestTelehealthViewController: BaseViewController ,UITextViewDelegate {
    var requestTelehealthService = RequestTelehealthService()
    var telehealthContainer = TelehealthContainer?()
    var patientInformation : PatientContainer!
    let colorCustomRed = UIColor.colorRBGValue(redValue: 232, greenValue: 145, blueValue: 147, alphaValue: 1.0)
    let colorAthenGray = UIColor.colorRBGValue(redValue: 202, greenValue: 202, blueValue: 208, alphaValue: 1.0)
    
    @IBOutlet weak var textView: DesignableTextView!
    @IBOutlet weak var firstNameTextField: UITextField!
    @IBOutlet weak var lastNameTextField: UITextField!
    @IBOutlet weak var mobileTextField: UITextField!
    @IBOutlet weak var homePhoneTextField: UITextField!
    @IBOutlet weak var suburbTextField: UITextField!
    @IBOutlet weak var dobTextField: UITextField!
    @IBOutlet weak var emailTextField: UITextField!
    @IBOutlet weak var typeRequest: UITextField!
    @IBOutlet weak var selectOptionImage: DesignableButton!
    
    @IBOutlet weak var collectionView: UICollectionView!
    
    @IBOutlet weak var scrollView: UIScrollView!
    
    var allFields=[UITextField]()
    var assets: [DKAsset]?
    
    var picker:UIImagePickerController?=UIImagePickerController()
    var popover:UIPopoverController?=nil
    var imageDetails : UIImage!
    var ArrayImageUID : [UIImage] = []
    
    var checkDOB = true
    var datePicker = UIDatePicker()
    var dateofbirth: String = ""
    let viewSuburb = UIView()
    var tableView: UITableView =  UITableView()
    
    var autocompleteUrls = [String]()
    var pastUrls : [String] = []
    var pickerView = UIPickerView()
    var pickOption = ["","Telehealth", "Onsite"]
    var userUID : String!
    var AppointmentSignatureUID : String = ""
    let alertView = UIAlertView()
    override func viewDidLoad() {
        super.viewDidLoad()
        if let uid = defaults.valueForKey("userUID") as? String {
            userUID = uid
            selectOptionImage.hidden = false
            collectionView.hidden = false
            if (patientInformation != nil) {
                print(patientInformation.SignatureUID)
                firstNameTextField.text = patientInformation.FirstName
                lastNameTextField.text = patientInformation.LastName
                emailTextField.text = patientInformation.Email
                mobileTextField.text = patientInformation.PhoneNumber
                dobTextField.text = patientInformation.DOB
                homePhoneTextField.text = patientInformation.HomePhoneNumber
                suburbTextField.text = patientInformation.Suburb.uppercaseString
            }
        }else {
            selectOptionImage.hidden = true
            collectionView.hidden = true
        }
        
        //
        
        //
        delegateTextField()
        textView.delegate = self
        pickerView.delegate = self
        pastUrls = autocompleteUrls
        textView.textColor = UIColor.lightGrayColor()
        addCustomView()
        DatepickerMode()
        PickerView()
    }
   
    func delegateTextField(){
        addDoneButtontextView(textView)
        addDoneButton(mobileTextField)
        addDoneButton(firstNameTextField)
        addDoneButton(lastNameTextField)
        addDoneButton(homePhoneTextField)
        addDoneButton(suburbTextField)
        addDoneButton(emailTextField)
        addDoneButton(typeRequest)
    }
    
    func showImagePickerWithAssetType(
        assetType: DKImagePickerControllerAssetType,
        allowMultipleType: Bool,
        sourceType: DKImagePickerControllerSourceType = [.Camera, .Photo],
        allowsLandscape: Bool,
        singleSelect: Bool) {
            let pickerController = DKImagePickerController()
            pickerController.assetType = assetType
            pickerController.allowsLandscape = allowsLandscape
            pickerController.allowMultipleTypes = allowMultipleType
            pickerController.sourceType = sourceType
            pickerController.singleSelect = singleSelect
            pickerController.showsCancelButton = true
            pickerController.showsEmptyAlbums = false
            pickerController.defaultSelectedAssets = self.assets
            
            pickerController.didSelectAssets = { [unowned self] (assets: [DKAsset]) in
                print("didSelectAssets")
                self.ArrayImageUID = []
                self.assets = assets
                self.collectionView?.reloadData()
                for i in assets {
                    i.fetchFullScreenImage(true, completeBlock: {
                        image, info in
                        self.ArrayImageUID.append((image)!)
                    })
                }
            }
            self.presentViewController(pickerController, animated: true) {}
    }
    
    
    
    @IBAction func suburbEndEdit(sender: AnyObject) {
        self.viewSuburb.alpha = 0
    }
    
    @IBAction func suburbSearchAction(sender: AnyObject) {
        searchAutocompleteEntriesWithSubstring(suburbTextField.text!)
        if suburbTextField.text == "" || autocompleteUrls.count == 0 {
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
    
    func PickerView(){
        let toolBar = UIToolbar()
        toolBar.barStyle = .Default
        toolBar.translucent = true
        toolBar.tintColor = UIColor.blackColor()
        toolBar.sizeToFit()
        
        
        
        // Adds the buttons
        let spaceButton = UIBarButtonItem(barButtonSystemItem: .FlexibleSpace, target: nil, action: nil)
        let doneBarButton = UIBarButtonItem(barButtonSystemItem: .Done,
            target: view, action: Selector("endEditing:"))
        //        let cancelButton = UIBarButtonItem(title: "Cancel", style: .Plain, target: self, action: "cancelClick")
        toolBar.setItems([spaceButton,doneBarButton], animated: false)
        toolBar.userInteractionEnabled = true
        
        
        // Adds the toolbar to the view
        typeRequest.inputView = pickerView
        typeRequest.inputAccessoryView = toolBar
        
    }
    
    
    
    
    func addCustomView() {
        
        
        viewSuburb.backgroundColor = UIColor.blackColor()
        viewSuburb.translatesAutoresizingMaskIntoConstraints = false
        self.viewSuburb.alpha = 0
        scrollView.addSubview(viewSuburb)
        
        
        tableView.delegate      =   self
        tableView.dataSource    =   self
        tableView.registerClass(UITableViewCell.self, forCellReuseIdentifier: "cell")
        tableView.translatesAutoresizingMaskIntoConstraints = false
        
        viewSuburb.addSubview(tableView)
        
        // view autolayout
        NSLayoutConstraint(item: viewSuburb, attribute: .Height, relatedBy: .Equal, toItem: nil, attribute: .NotAnAttribute, multiplier: 1.0, constant: 120).active = true
        NSLayoutConstraint(item: viewSuburb, attribute: .Leading, relatedBy: .Equal, toItem: view, attribute: .Leading, multiplier: 1.0, constant: 2).active = true
        NSLayoutConstraint(item: viewSuburb, attribute: .Top, relatedBy: .Equal, toItem: suburbTextField, attribute: .BottomMargin, multiplier: 1.0, constant: 10).active = true
        NSLayoutConstraint(item: viewSuburb, attribute: .CenterX, relatedBy: .Equal, toItem: view, attribute: .CenterX, multiplier: 1.0, constant: 0.0).active = true
        
        
        //table view autolayout
        NSLayoutConstraint(item: tableView, attribute: .Height, relatedBy: .Equal, toItem: nil, attribute: .NotAnAttribute, multiplier: 1.0, constant: 120).active = true
        NSLayoutConstraint(item: tableView, attribute: .Leading, relatedBy: .Equal, toItem: viewSuburb, attribute: .Leading, multiplier: 1.0, constant: 0).active = true
        NSLayoutConstraint(item: tableView, attribute: .CenterX, relatedBy: .Equal, toItem: viewSuburb, attribute: .CenterX, multiplier: 1.0, constant: 0.0).active = true
        NSLayoutConstraint(item: tableView, attribute: .CenterY, relatedBy: .Equal, toItem: viewSuburb, attribute: .CenterY, multiplier: 1.0, constant: 0.0).active = true
        
    }
    
    
    //show date picker
    func DatepickerMode(){
        dobTextField.tintColor = UIColor.clearColor()
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
        dobTextField.inputView = datePicker
        dobTextField.inputAccessoryView = toolBar
    }
    
    //Done button in datepicker
    func doneClick() {
        let dateFormatter = NSDateFormatter()
        let SaveDatetime = NSDateFormatter()
        SaveDatetime.dateFormat = formatTime.formatDate
        dateFormatter.dateFormat = formatTime.formatDate
        dateofbirth = SaveDatetime.stringFromDate(datePicker.date)
        dobTextField.text = dateFormatter.stringFromDate(datePicker.date)
        dobTextField.resignFirstResponder()
        if(requestTelehealthService.compareDate(datePicker.date)){
            checkDOB = true
            requestTelehealthService.borderTextFieldValid(dobTextField, color: colorAthenGray,check: true)
        }else{
            checkDOB = false
            requestTelehealthService.borderTextFieldValid(dobTextField, color: colorCustomRed)
        }
        
    }
    
    //cancel button in datepicker
    func cancelClick() {
        dobTextField.resignFirstResponder()
        suburbTextField.resignFirstResponder()
        typeRequest.resignFirstResponder()
    }
    
    func textViewDidBeginEditing(textView: UITextView) {
        if textView.textColor == UIColor.lightGrayColor() {
            textView.text = nil
            textView.textColor = UIColor.blackColor()
        }
    }
    func textViewDidEndEditing(textView: UITextView) {
        if textView.text.isEmpty {
            textView.text = MessageString.placeHolderDescription
            textView.textColor = UIColor.lightGrayColor()
        }
    }
    
    func textView(textView: UITextView, shouldChangeTextInRange range: NSRange, replacementText text: String) -> Bool {
        // Combine the textView text and the replacement text to
        // create the updated text string
        if(text == "\n") {
            textView.resignFirstResponder()
            return false
        }
        let currentText:NSString = textView.text
        let updatedText = currentText.stringByReplacingCharactersInRange(range, withString:text)
        // If updated text view will be empty, add the placeholder
        // and set the cursor to the beginning of the text view
        if updatedText.isEmpty {
            textView.text = MessageString.placeHolderDescription
            textView.textColor = UIColor.lightGrayColor()
            textView.selectedTextRange = textView.textRangeFromPosition(textView.beginningOfDocument, toPosition: textView.beginningOfDocument)
            
            return false
        }
        else if textView.textColor == UIColor.lightGrayColor() && !text.isEmpty {
            textView.text = nil
            textView.textColor = UIColor.blackColor()
        }
        return true
    }
    
    override func touchesBegan(touches: Set<UITouch>, withEvent event: UIEvent?) {
        view.endEditing(true)
    }
    
    func textFieldShouldReturn(textField: UITextField) -> Bool {
        
        view.endEditing(true)
        return false
    }
    
    func textFieldDidBeginEditing(textField: UITextField) {
        if textField == suburbTextField {
            if textField.text != "" {
                self.viewSuburb.alpha = 1
            }
        }
    }
    
    func textFieldDidEndEditing(textField: UITextField) {
        
        switch textField {
        case firstNameTextField:
            if textField.text != "" && requestTelehealthService.checkMaxLength(textField.text! , length: 50) == true {
                requestTelehealthService.borderTextFieldValid(firstNameTextField, color: colorAthenGray,check:true)
                firstNameTextField.text = textField.text!.capitalizeFirst
            }else {
                requestTelehealthService.borderTextFieldValid(firstNameTextField, color: colorCustomRed)
            }
            break;
        case lastNameTextField:
            if textField.text != "" && requestTelehealthService.checkMaxLength(textField.text! , length: 50) == true {
                requestTelehealthService.borderTextFieldValid(lastNameTextField, color: colorAthenGray,check:true)
                lastNameTextField.text = textField.text!.capitalizeFirst
            }else {
                requestTelehealthService.borderTextFieldValid(lastNameTextField, color: colorCustomRed)
            }
            break;
        case mobileTextField:
            if config.validateRegex(textField.text!, regex: Regex.MobileNumber)  == false || textField.text == "" {
                requestTelehealthService.borderTextFieldValid(mobileTextField, color: colorCustomRed)
            }else {
                requestTelehealthService.borderTextFieldValid(mobileTextField, color: colorAthenGray,check:true)
            }
            
            break;
        case homePhoneTextField:
            if textField.text! != "" && config.validateRegex(textField.text!, regex: Regex.PhoneNumber)  == false {
                requestTelehealthService.borderTextFieldValid(homePhoneTextField, color: colorCustomRed)
            }else {
                requestTelehealthService.borderTextFieldValid(homePhoneTextField, color: colorAthenGray,check: true)
            }
            break;
        case typeRequest:
            if textField.text == "" {
                requestTelehealthService.borderTextFieldValid(typeRequest, color: colorCustomRed)
                typeRequest.text = typeRequest.text != "" ? typeRequest.text?.capitalizeFirst : ""
            }else {
                requestTelehealthService.borderTextFieldValid(typeRequest, color: colorAthenGray,check: true)
            }
            
            break;
        case suburbTextField:
            self.viewSuburb.alpha = 0
            if textField.text == "" {
                requestTelehealthService.borderTextFieldValid(suburbTextField, color: colorCustomRed)
            }else {
                requestTelehealthService.borderTextFieldValid(suburbTextField, color: colorAthenGray,check: true)
            }
            break;
        case dobTextField:
            if textField.text == "" {
                requestTelehealthService.borderTextFieldValid(dobTextField, color: colorCustomRed)
            }
            break;
        case emailTextField:
            if config.validateRegex(textField.text!, regex: Regex.Email)  == false || textField.text == "" {
                requestTelehealthService.borderTextFieldValid(emailTextField, color: colorCustomRed)
            }else {
                requestTelehealthService.borderTextFieldValid(emailTextField, color: colorAthenGray,check:true)
            }
            
            break;
        default: break;
        }
    }
    
    @IBAction func submitRequestTelehealthAction(sender: AnyObject) {
        allFields = [firstNameTextField,lastNameTextField,mobileTextField,typeRequest,suburbTextField,dobTextField,emailTextField]
        checkField(allFields)
    }
    
    
    func checkField(arr:[UITextField]){
        if firstNameTextField.text == "" || lastNameTextField.text == "" || mobileTextField.text == "" || typeRequest.text == "" || suburbTextField.text == "" || dobTextField.text == "" || emailTextField.text == "" {
            for i in allFields {
                if i.text == "" {
                    requestTelehealthService.borderTextFieldValid(i, color: colorCustomRed)
                }
            }
            alertView.alertMessage("", message: ErrorMessage.CheckField)
            print("Please check field!")
        }else {
            if config.validateRegex(mobileTextField.text!, regex: Regex.MobileNumber)  == false {
                requestTelehealthService.borderTextFieldValid(mobileTextField, color: colorCustomRed)
                alertView.alertMessage("", message: "Please check mobile phone number!")
                print("erro mobileTextField")
            } else if homePhoneTextField.text! != "" && config.validateRegex(homePhoneTextField.text!, regex: Regex.PhoneNumber)  == false{
                requestTelehealthService.borderTextFieldValid(homePhoneTextField, color: colorCustomRed)
                alertView.alertMessage("", message: "Please check home phone number!")
                
            }else if !(requestTelehealthService.compareDate(datePicker.date)){
                requestTelehealthService.borderTextFieldValid(dobTextField, color: colorCustomRed)
                print("erro date")
                alertView.alertMessage("", message: "Please check Date of Birth!")
            }else if config.validateRegex(emailTextField.text!, regex: Regex.Email)  == false {
                requestTelehealthService.borderTextFieldValid(emailTextField, color: colorCustomRed)
                print("erro email")
                alertView.alertMessage("", message: "Please check Email!")
            }else {
                print("ok",self.ArrayImageUID.count)
                telehealthContainer = TelehealthContainer(firstName: firstNameTextField.text!, lastName: lastNameTextField.text!, mobilePhone: mobileTextField.text!, homePhone: homePhoneTextField.text!, type: typeRequest.text!, suburb: suburbTextField.text!, dob: dobTextField.text!, email: emailTextField.text!, description: textView.text, imageArray: ArrayImageUID,AppointmentSignatureUID:AppointmentSignatureUID)
                view.endEditing(true)
                performSegueWithIdentifier("ConfirmRequestSegue", sender: self)
            }
            
        }
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if segue.identifier == "ConfirmRequestSegue"{
            let confirm = segue.destinationViewController as! ConfirmRequestTelehealthViewController
            confirm.telehealthData = telehealthContainer
            if(patientInformation != nil){
                if(patientInformation.SignatureUID != ""){
                    confirm.AppointmentSignatureUID = patientInformation.SignatureUID
                }
            }else{
                 confirm.AppointmentSignatureUID = ""
            }
        }
    }
    
    
    
}

//collection
extension RequestTelehealthViewController : UICollectionViewDataSource, UICollectionViewDelegate {
    func numberOfSectionsInCollectionView(collectionView: UICollectionView) -> Int {
        return 1
    }
    
    func collectionView(collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return self.assets?.count ?? 0
    }
    func collectionView(collectionView: UICollectionView, cellForItemAtIndexPath indexPath: NSIndexPath) -> UICollectionViewCell {
        let asset = self.assets![indexPath.row]
        let cell = collectionView.dequeueReusableCellWithReuseIdentifier("RequestTelehealthCVCell", forIndexPath: indexPath) as! AppointmentImageCollectionViewCell
        
        asset.fetchImageWithSize(cell.imageView.frame.size, completeBlock: { image, info in
            cell.imageView.image = image
            cell.imageView.layer.shadowRadius = 4
            cell.imageView.layer.shadowOpacity = 0.5
            cell.imageView.layer.shadowOffset = CGSize.zero
        })
        //        let data = ArrayImageUID[indexPath.row]
        //        cell.imageView.image = data
        
        
        return cell
    }
    func collectionView(collectionView: UICollectionView, didSelectItemAtIndexPath indexPath: NSIndexPath) {
        
    }
    func collectionView(collectionView: UICollectionView, willDisplayCell cell: UICollectionViewCell, forItemAtIndexPath indexPath: NSIndexPath) {
        cell.alpha = 0
        UIView.animateWithDuration(0.5, animations: {
            cell.alpha = 1
        })
    }
    
}

// TableView
extension RequestTelehealthViewController: UITableViewDelegate, UITableViewDataSource {
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return self.autocompleteUrls.count
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        
        let cell:UITableViewCell = tableView.dequeueReusableCellWithIdentifier("cell")! as UITableViewCell
        
        cell.textLabel?.text = self.autocompleteUrls[indexPath.row]
        
        return cell
        
    }
    
    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        suburbTextField.text = self.autocompleteUrls[indexPath.row]
        requestTelehealthService.borderTextFieldValid(suburbTextField, color: colorAthenGray,check: true)
        
        
        
        UIView.animateWithDuration(0.5, animations: {
            self.viewSuburb.alpha = 0
        })
        
    }
    
}


//picker
extension RequestTelehealthViewController: UIPickerViewDataSource, UIPickerViewDelegate {
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

extension RequestTelehealthViewController : UIViewControllerTransitioningDelegate,UIAlertViewDelegate,UIImagePickerControllerDelegate,UINavigationControllerDelegate,UIPopoverControllerDelegate {
    
    
    @IBAction func uploadImageAction(sender: AnyObject) {
        let alert:UIAlertController=UIAlertController(title: "Choose Image", message: nil, preferredStyle: UIAlertControllerStyle.ActionSheet)
        
        let cameraAction = UIAlertAction(title: "Camera", style: UIAlertActionStyle.Default)
            {
                UIAlertAction in
                self.openCamera()
                
        }
        let galleryAction = UIAlertAction(title: "Gallery", style: UIAlertActionStyle.Default)
            {
                UIAlertAction in
                self.openGallery()
        }
        let cancelAction = UIAlertAction(title: "Cancel", style: UIAlertActionStyle.Cancel)
            {
                UIAlertAction in
                
        }
        
        // Add the actions
        picker?.delegate = self
        alert.addAction(cameraAction)
        alert.addAction(galleryAction)
        alert.addAction(cancelAction)
        // Present the controller
        if UIDevice.currentDevice().userInterfaceIdiom == .Phone
        {
            self.presentViewController(alert, animated: true, completion: nil)
        }
        else
        {
            popover=UIPopoverController(contentViewController: alert)
            popover!.presentPopoverFromRect(selectOptionImage.frame, inView: self.view, permittedArrowDirections: UIPopoverArrowDirection.Any, animated: true)
        }
    }
    
    func openCamera()
    {
        
        let assetType = DKOption.types[1]
        let allowMultipleType = true
        let sourceType: DKImagePickerControllerSourceType = DKImagePickerControllerSourceType.Camera
        let allowsLandscape = false
        let singleSelect = false
        showImagePickerWithAssetType(
            assetType,
            allowMultipleType: allowMultipleType,
            sourceType: sourceType,
            allowsLandscape: allowsLandscape,
            singleSelect: singleSelect
        )
    }
    
    func openGallery()
    {
        
        let assetType = DKOption.types[1]
        let allowMultipleType = true
        let sourceType: DKImagePickerControllerSourceType = DKImagePickerControllerSourceType.Photo
        let allowsLandscape = false
        let singleSelect = false
        
        showImagePickerWithAssetType(
            assetType,
            allowMultipleType: allowMultipleType,
            sourceType: sourceType,
            allowsLandscape: allowsLandscape,
            singleSelect: singleSelect
        )
        
        
    }
    
}
