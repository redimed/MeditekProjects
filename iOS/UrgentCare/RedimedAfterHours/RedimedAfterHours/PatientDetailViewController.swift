import UIKit
protocol patientDetailViewDelegate{
    func tranferDataController(copntroller: PatientDetailViewController, moreData: Dictionary<String, String>)
}
class PatientDetailViewController: UIViewController,UITextFieldDelegate ,UITextViewDelegate,UITableViewDelegate,UITableViewDataSource  {
    
    @IBOutlet weak var cancelSuburbButton: UIButton!
    @IBOutlet weak var scrollView: UIScrollView!
    @IBOutlet weak var imageCancel: UIImageView!
    @IBOutlet weak var navigationBar: UINavigationBar!
    @IBOutlet weak var firstNameImage: UIImageView!
    @IBOutlet weak var lastNameImage: UIImageView!
    @IBOutlet weak var contactPhoneImage: UIImageView!
    @IBOutlet weak var surburbImage: UIImageView!
    @IBOutlet weak var dobImage: UIImageView!
    @IBOutlet weak var emailImage: UIImageView!
    @IBOutlet weak var descriptionImage: UIImageView!
    
    @IBOutlet weak var firstNameTextField: DesignableTextField!
    @IBOutlet weak var lastNameTextField: DesignableTextField!
    @IBOutlet weak var contactPhoneTextField: DesignableTextField!
    @IBOutlet weak var surburbTextField: DesignableTextField!
    @IBOutlet weak var dobTextField: DesignableTextField!
    @IBOutlet weak var emailTextField: DesignableTextField!
    @IBOutlet weak var descriptionTextView: UITextView!
    
    @IBOutlet weak var referralYesLabel: UILabel!
    @IBOutlet weak var referralNoLabel: UILabel!
    
    @IBOutlet weak var handTherapistButton: UIButton!
    @IBOutlet weak var specialistButton: UIButton!
    @IBOutlet weak var physiotherapyButton: UIButton!
    @IBOutlet weak var gpRefferralButton: UIButton!
    @IBOutlet weak var yesReferralButton: UIButton!
    @IBOutlet weak var noReferralButton: UIButton!
    
    var noneImage = UIImageView()
    var datePicker = UIDatePicker()
    var serviceType = ""
    var gPReferral:String = "Y"
    var baseUrl:String = "http://testapp.redimed.com.au:3001/api/urgent-care/urgent-request"
    var blueColorCustom:UIColor = UIColor(red: 41/255, green: 128/255, blue: 185/255, alpha: 1.0)
    var redColorCuston:UIColor = UIColor(red: 232/255, green: 145/255, blue: 147/255, alpha: 1.0)
    var phoneNumber = ""
    var checkDOB = true
    let delegate:patientDetailViewDelegate? = nil
    var informationData: Dictionary<String, String> = [:]
    var patientInformation: Dictionary<String, String> = [:]
    var numberContact: String = ""
    var checkSuccess:NSString = ""
    
    let autocompleteTableView = UITableView(frame: CGRectMake(0,180,400,300), style: UITableViewStyle.Plain)
    
    var pastUrls : [String] = [String]()
    var suburb : NSArray = []
    var autocompleteUrls = [String]()
    var checkShow:Bool = false
    
    override func viewDidLoad() {
        // Controls Initialziation
        super.viewDidLoad()
        firstNameTextField.delegate = self
        lastNameTextField.delegate = self
        contactPhoneTextField.delegate = self
        surburbTextField.delegate = self
        dobTextField.delegate = self
        emailTextField.delegate = self
        descriptionTextView.delegate = self
        

        firstNameTextField.autocapitalizationType = UITextAutocapitalizationType(rawValue: 1)!
        lastNameTextField.autocapitalizationType = UITextAutocapitalizationType(rawValue: 1)!
        
        ChangeBorderColor(descriptionTextView,color: blueColorCustom)
        DatepickerMode()
        navigationBar.topItem?.title = informationData["title"]

        autocompleteTableView.delegate = self
        autocompleteTableView.dataSource = self
        autocompleteTableView.scrollEnabled = true
        autocompleteTableView.hidden = true
        
        self.view.addSubview(autocompleteTableView)
        cancelSuburbButton.hidden = true
        imageCancel.hidden = true
        
        for var i = 0; i < suburb.count; ++i {
            let a = suburb[i]["name"] as! String
            pastUrls.append(a)
        }
    }
    
    @IBAction func cancelSuburbButton(sender: AnyObject) {
        autocompleteTableView.hidden = true
        cancelSuburbButton.hidden = true
        imageCancel.hidden = true
    }
    func textField(textField: UITextField, shouldChangeCharactersInRange range: NSRange, replacementString string: String) -> Bool
    {
        if(textField == surburbTextField){
            if(autocompleteUrls.count > 0){
                var scrollPoint : CGPoint = CGPointMake(0, self.surburbTextField.frame.origin.y - 70)
                self.scrollView.setContentOffset(scrollPoint, animated: true)
                autocompleteTableView.hidden = false
                cancelSuburbButton.hidden = false
                imageCancel.hidden = false
            }else{
                autocompleteTableView.hidden = true
                cancelSuburbButton.hidden = true
                imageCancel.hidden = true
            }
        }
        
        var substring = (textField.text as NSString).stringByReplacingCharactersInRange(range, withString: string)
        searchAutocompleteEntriesWithSubstring(substring)
        
        return true
    }
    func searchAutocompleteEntriesWithSubstring(substring: String)
    {
        let dataSource = pastUrls
        
        let searchString = substring.uppercaseString
        let predicate = NSPredicate(format: "SELF beginswith[c] %@", searchString)
        let searchDataSource = dataSource.filter { predicate.evaluateWithObject($0) }
        
        autocompleteUrls = searchDataSource
        autocompleteTableView.reloadData()

    }
    
    @IBAction func change(sender: AnyObject) {
        if(surburbTextField.text.isEmpty == true){
            autocompleteTableView.hidden = true
            cancelSuburbButton.hidden = true
            imageCancel.hidden = true
        }
    }
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return autocompleteUrls.count
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        
        let autoCompleteRowIdentifier = "AutoCompleteRowIdentifier"
        var cell = tableView.dequeueReusableCellWithIdentifier(autoCompleteRowIdentifier) as? UITableViewCell
        
        if let tempo1 = cell
        {
            let index = indexPath.row as Int
            cell!.textLabel!.text = autocompleteUrls[index]
        } else
        {
            cell = UITableViewCell(style: UITableViewCellStyle.Value1, reuseIdentifier: autoCompleteRowIdentifier)
        }
        return cell!
    }
    
    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        let selectedCell : UITableViewCell = tableView.cellForRowAtIndexPath(indexPath)!
        surburbTextField.text = selectedCell.textLabel!.text
        autocompleteTableView.hidden = true
        cancelSuburbButton.hidden = true
        imageCancel.hidden = true
    }
    
    //Choose button Yes or no of Referral
    @IBAction func ChooseReferralButton(sender: AnyObject) {
        if(sender.tag == 101){
            ChangeImageButton(yesReferralButton, nameImage: "checked")
            ChangeImageButton(noReferralButton, nameImage: "unchecked")
        }else{
            ChangeImageButton(yesReferralButton, nameImage: "unchecked")
            ChangeImageButton(noReferralButton, nameImage: "checked")
            gPReferral = "N"
        }
    }
    
    //Change Image Button
    func ChangeImageButton(nameButton:UIButton,nameImage:String){
        nameButton.setImage(UIImage(named: nameImage), forState: UIControlState.Normal)
    }
    
    //Change Border color
    func ChangeBorderColor(name:AnyObject,color:UIColor){
        name.layer.borderColor = color.CGColor
        name.layer.borderWidth = 1
        name.layer.cornerRadius = 5
    }
    
    // focus on text view
    func textViewDidBeginEditing(textView: UITextView) {
        if(textView == descriptionTextView ){
            ChangeBorderColor(descriptionTextView,color: blueColorCustom)
        }
    }
    
    //out forcus text view
    func textViewDidEndEditing(textView: UITextView) {
    }
    
    // focus text field
    func textFieldDidBeginEditing(textField: UITextField) {
        ChangeBorderColor(textField,color: blueColorCustom)
    }
    
    // out focus text field .validate data
    func textFieldDidEndEditing(textField: UITextField) {
        self.view.endEditing(true)
        
        autocompleteTableView.hidden = true
        if(textField == firstNameTextField){
            textField.text = upCaseFirstLetter(textField.text)
            OutTextField(textField, validateImage: firstNameImage)
        }
        if(textField == lastNameTextField){
            textField.text = upCaseFirstLetter(textField.text)
            OutTextField(textField, validateImage: lastNameImage)
        }
        if(textField == contactPhoneTextField){
            OutTextField(textField, validateImage: contactPhoneImage)
            CheckContactNo()
        }
        if(textField == surburbTextField){
            autocompleteTableView.hidden = true
            cancelSuburbButton.hidden = true
            imageCancel.hidden = true
            OutTextField(textField, validateImage: noneImage)
            
        }
        if(textField == dobTextField){
            OutTextField(textField, validateImage: noneImage)
            
        }
        if(textField == emailTextField){
            if(!textField.text.isEmpty){
                if(!isValidEmail(textField.text)){
                  ChangeBorderColor(textField, color: redColorCuston)
                  ///AlertShow("Notification", message: "Email is invalid", addButtonWithTitle: "OK")
               }else{
                 OutTextField(textField, validateImage: noneImage)
              }
            }else{
                textField.layer.borderWidth = 0
            }
            
        }
    }
    func upCaseFirstLetter(description:String)->String{
        if(!description.isEmpty){
            // The start index is the first letter
            let first = description.startIndex
            
            // The rest of the string goes from the position after the first letter
            // to the end.
            let rest = advance(first,1)..<description.endIndex
            let capitalised = description[first...first].uppercaseString + description[rest]
            return capitalised
        }else{
            return ""
        }
        
    }
    //when out focus text field validate data if isEmpty changeborder color is red
    func OutTextField(nameInputField:UITextField,validateImage:UIImageView){
        if(!nameInputField.text.isEmpty){
            if(validateImage != noneImage){
                validateImage.image = UIImage(named: "Checkmark")
                nameInputField.layer.borderWidth = 0
            }else{
                nameInputField.layer.borderWidth = 0
            }
            
        }else{
            if(validateImage != noneImage){
                validateImage.image = UIImage(named: "sao")
                ChangeBorderColor(nameInputField, color: redColorCuston)
            }else{
                nameInputField.layer.borderWidth = 0
            }
            
        }
        
    }
    
    //show alert
    func AlertShow(title:String,message:String,addButtonWithTitle:String){
        let alert = UIAlertView()
        alert.title = title
        alert.message = message
        alert.addButtonWithTitle(addButtonWithTitle)
        alert.show()

    }
    
    //show date picker
     func DatepickerMode(){
        dobTextField.tintColor = UIColor.clearColor()
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
        dobTextField.inputView = datePicker
        dobTextField.inputAccessoryView = toolBar
     }
    
    //Done button in datepicker
    //Done button in datepicker
    func doneClick() {
        var dateFormatter = NSDateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd"
        dobTextField.text = dateFormatter.stringFromDate(datePicker.date)
        dobTextField.resignFirstResponder()
        if(compareDate(datePicker.date)){
            checkDOB = true
            ChangeBorderColor(dobTextField, color: blueColorCustom)
        }else{
            checkDOB = false
            ChangeBorderColor(dobTextField, color: redColorCuston)
        }
        
    }
    func compareDate(dateDOB:NSDate)->Bool {
        let now = NSDate()
        if now.compare(dateDOB) == NSComparisonResult.OrderedDescending
        {
            return true
        } else
        {
            return false
        }
    }

    
    //cancel button in datepicker
    func cancelClick() {
        dobTextField.resignFirstResponder()
    }
    
    //validate email
    func isValidEmail(mail:String) -> Bool {
        let emailRegEx = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
        let emailTest = NSPredicate(format:"SELF MATCHES %@", emailRegEx)
        return emailTest.evaluateWithObject(mail)
    }

    //when check service type
    @IBAction func ChoosePSH(sender: AnyObject) {

        if(sender.tag == 203){
            if(serviceType != "PHY"){
                ChangeImageButton(physiotherapyButton, nameImage: "checked")
                ChangeImageButton(specialistButton, nameImage: "unchecked")
                ChangeImageButton(handTherapistButton, nameImage: "unchecked")
                serviceType = "PHY"
            }else{
                ChangeImageButton(physiotherapyButton, nameImage: "unchecked")
                serviceType = "null"
            }
        }
        if(sender.tag == 204){
            if(serviceType != "SPE"){
                ChangeImageButton(specialistButton, nameImage: "checked")
                ChangeImageButton(physiotherapyButton, nameImage: "unchecked")
                ChangeImageButton(handTherapistButton, nameImage: "unchecked")
                serviceType = "SPE"
            }else{
                ChangeImageButton(specialistButton, nameImage: "unchecked")
                serviceType = "null"
            }
            
        }
        if(sender.tag == 205){
            if(serviceType != "HAN"){
                ChangeImageButton(handTherapistButton, nameImage: "checked")
                ChangeImageButton(physiotherapyButton, nameImage: "unchecked")
                ChangeImageButton(specialistButton, nameImage: "unchecked")
                serviceType = "HAN"
            }else{
                ChangeImageButton(handTherapistButton, nameImage: "unchecked")
                serviceType = "null"
            }
        }
    }
    
    // check contact no wrong format
    func CheckContactNo(){
        if( contactPhoneTextField.text.length < 9 || contactPhoneTextField.text.length > 10 ){
            contactPhoneImage.image = UIImage(named: "sao")
            ChangeBorderColor(contactPhoneTextField, color: redColorCuston)
            //AlertShow("Notification",message: "Phone number is invalid",addButtonWithTitle: "OK")
            
        }else{
            if(contactPhoneTextField.text.length == 10){
                var str = contactPhoneTextField.text.substringToIndex(advance(contactPhoneTextField.text.startIndex, 1))
                if(str != "0"){
                    ChangeBorderColor(contactPhoneTextField, color: redColorCuston)
                    contactPhoneImage.image = UIImage(named: "sao")
                   // AlertShow("Notification",message: "Phone number is invalid",addButtonWithTitle: "OK")
                }
            }
        }
        
    }
    //Make appointment
    @IBAction func MakeAppointMentButton(sender: AnyObject) {
        
        self.view.endEditing(true)
        //check first name , last name , contactno is Empty
        if(firstNameTextField.text.isEmpty || lastNameTextField.text.isEmpty || contactPhoneTextField.text.isEmpty){
            AlertShow("Error", message: "Please input required information", addButtonWithTitle: "OK")
            if(firstNameTextField.text.isEmpty){
                ChangeBorderColor(firstNameTextField, color: redColorCuston)
            }
            if(lastNameTextField.text.isEmpty){
                ChangeBorderColor(lastNameTextField, color: redColorCuston)
            }
            if(contactPhoneTextField.text.isEmpty){
                ChangeBorderColor(contactPhoneTextField, color: redColorCuston)
            }
            
        }else{
            if(checkDOB == true){
                if(checkMaxLength(firstNameTextField, length: 50) && checkMaxLength(lastNameTextField, length: 255) && checkMaxLength(surburbTextField, length: 100) && checkMaxLength(dobTextField, length: 255) && checkMaxLength(emailTextField, length: 255)){
                if(!isValidEmail(emailTextField.text) && !emailTextField.text.isEmpty){
                    AlertShow("Error", message: "Email is invalid", addButtonWithTitle: "OK")
                }else{
                    if( contactPhoneTextField.text.length < 9 || contactPhoneTextField.text.length > 10 ){
                        
                        contactPhoneImage.image = UIImage(named: "sao")
                        ChangeBorderColor(contactPhoneTextField, color: redColorCuston)
                        AlertShow("Error",message: "Phone number is invalid",addButtonWithTitle: "OK")
                        
                    }else{
                        if(contactPhoneTextField.text.length == 10){
                            var str = contactPhoneTextField.text.substringToIndex(advance(contactPhoneTextField.text.startIndex, 1))
                            if(str != "0"){
                                ChangeBorderColor(contactPhoneTextField, color: redColorCuston)
                                contactPhoneImage.image = UIImage(named: "sao")
                                AlertShow("Error",message: "Phone number is invalid",addButtonWithTitle: "OK")
                            }else{
                                phoneNumber  = contactPhoneTextField.text.substringWithRange(Range<String.Index>(start: advance(contactPhoneTextField.text.startIndex, 1), end: contactPhoneTextField.text.endIndex))
                                MakeAppointMentSubmit()
                            }
                        }else{
                            phoneNumber = contactPhoneTextField.text
                            MakeAppointMentSubmit()
                        }
                        
                    }
                    
                }
            }else{
                AlertShow("Error", message: "Some field exceeds so long", addButtonWithTitle: "OK")
                }
            }else{
                AlertShow("Error", message: "Date of birth wrong", addButtonWithTitle: "OK")
            }

        }
    }
    
    func MakeAppointMentSubmit(){
       // print(patientInformation)
        view.endEditing(true)
        patientInformation["firstName"] = firstNameTextField.text
        patientInformation["lastName"] = lastNameTextField.text
        patientInformation["phoneNumber"] = "+61" + phoneNumber
        patientInformation["email"] = emailTextField.text.lowercaseString
        patientInformation["DOB"] = dobTextField.text
        patientInformation["suburb"] = surburbTextField.text
        patientInformation["GPReferal"] = gPReferral
        patientInformation["description"] = descriptionTextView.text
        patientInformation["serviceType"] = serviceType
        patientInformation["urgentRequestType"] = informationData["urgentRequestType"]
        
        if(!isConnectedToNetwork()){
            let alertController = UIAlertController(title: "No Internet Connection", message: "Make sure your device is connected to the internet ", preferredStyle: .Alert)
            
            let cancelAction = UIAlertAction(title: "Cancel", style: .Cancel) { (action) in
                // ...
            }
            alertController.addAction(cancelAction)
            
            let OKAction = UIAlertAction(title: "OK", style: .Default) { (action) in
                UIApplication.sharedApplication().openURL(NSURL(string:UIApplicationOpenSettingsURLString)!);
            }
            alertController.addAction(OKAction)
            
            self.presentViewController(alertController, animated: true) {
                // ...
            }

        }else{
            var request = NSMutableURLRequest(URL: NSURL(string: baseUrl)!)
            var session = NSURLSession.sharedSession()
            request.HTTPMethod = "POST"
            var checkSuccess:NSString = "true"
            
            let dictionary = patientInformation
            
            var error : NSError?
            var params : Dictionary<String,Dictionary<String,String>> = [
                "data":patientInformation
            ]
            
            var alert: UIAlertView = UIAlertView(title: "Make Appointment", message: "Please wait...", delegate: nil, cancelButtonTitle: nil);
            var loadingIndicator: UIActivityIndicatorView = UIActivityIndicatorView(frame: CGRectMake(50, 10, 37, 37)) as UIActivityIndicatorView
            loadingIndicator.center = self.view.center;
            loadingIndicator.hidesWhenStopped = true
            loadingIndicator.activityIndicatorViewStyle = UIActivityIndicatorViewStyle.Gray
            loadingIndicator.startAnimating();
            alert.setValue(loadingIndicator, forKey: "accessoryView")
            loadingIndicator.startAnimating()
            alert.show();
            
            var err: NSError?
            request.HTTPBody = NSJSONSerialization.dataWithJSONObject(params, options: nil, error: &err)
            request.addValue("application/json", forHTTPHeaderField: "Content-Type")
            request.addValue("application/json", forHTTPHeaderField: "Accept")
            
            var task = session.dataTaskWithRequest(request, completionHandler: {data, response, error -> Void in
                
                var strData = NSString(data: data, encoding: NSUTF8StringEncoding)
                
                var err: NSError?
                var json = NSJSONSerialization.JSONObjectWithData(data, options: .MutableLeaves, error: &err) as? NSDictionary
                
                
                
                if(err != nil) {
                    let jsonStr = NSString(data: data, encoding: NSUTF8StringEncoding)
                    alert.dismissWithClickedButtonIndex(-1, animated: true)
                    dispatch_sync(dispatch_get_main_queue(), { () -> Void in
                        NSTimer.scheduledTimerWithTimeInterval(1, target: self, selector: "showAlert", userInfo: nil, repeats: false)
                    })
                }
                else {
                    
                    // check and make sure that json has a value using optional binding.
                    if let parseJSON = json {
                        var status = parseJSON["status"] as? Int
                        if(status == 200){
                            alert.dismissWithClickedButtonIndex(-1, animated: true)
                            dispatch_sync(dispatch_get_main_queue(), { () -> Void in
                                NSTimer.scheduledTimerWithTimeInterval(1, target: self, selector: "successAlert", userInfo: nil, repeats: false)
                            })
                            
                        }else{
                            alert.dismissWithClickedButtonIndex(-1, animated: true)
                            dispatch_sync(dispatch_get_main_queue(), { () -> Void in
                                self.AlertShow("Notification", message: "Error ! Please check your connection and try again", addButtonWithTitle: "OK")
                            })
                            
                            
                        }
                    }
                    else {
                        let jsonStr = NSString(data: data, encoding: NSUTF8StringEncoding)
                        alert.dismissWithClickedButtonIndex(-1, animated: true)
                        
                    }
                }
            })
            task.resume()
        }

        }
    func successAlert(){
        
        let alertController = UIAlertController(title: "Success", message: "Please be informed that your enquiry has been received and our Redimed staff will contact you shortly.", preferredStyle: .Alert)
        
        let OKAction = UIAlertAction(title: "OK", style: .Default) { (action) in
            
            self.dismissViewControllerAnimated(true, completion: nil)
        }
        alertController.addAction(OKAction)
        
        self.presentViewController(alertController, animated: true) {
            // ...
        }
    }
    func showAlert(){
        self.AlertShow("Notification",message: "Can not connect to server",addButtonWithTitle: "OK")
    }
    func textFieldShouldReturn(textField: UITextField) -> Bool {
        
        return false
    }
    //check device connected internet
    func isConnectedToNetwork()->Bool{
        
        var Status:Bool = false
        let url = NSURL(string: "http://google.com/")
        let request = NSMutableURLRequest(URL: url!)
        request.HTTPMethod = "HEAD"
        request.cachePolicy = NSURLRequestCachePolicy.ReloadIgnoringLocalAndRemoteCacheData
        request.timeoutInterval = 10.0
        
        var response: NSURLResponse?
        
        var data = NSURLConnection.sendSynchronousRequest(request, returningResponse: &response, error: nil) as NSData?
        
        if let httpResponse = response as? NSHTTPURLResponse {
            if httpResponse.statusCode == 200 {
                Status = true
            }
        }
        
        return Status
    }
    //validate format number
    func checkMaxLength(name:UITextField,length:Int)->Bool{
        if(name.text.length > length){
            ChangeBorderColor(name, color: redColorCuston)
            return false
        }else{
            return true
        }
    }
    @IBAction func backButton(sender: AnyObject) {
        view.endEditing(true)
        dismissViewControllerAnimated(true, completion: nil)
    }
}


