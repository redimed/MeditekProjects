import UIKit

class InformationViewController: UIViewController,UITextFieldDelegate ,UITextViewDelegate ,moreDetailDelegate {
    

    @IBOutlet weak var descriptionImage: UIImageView!
    @IBOutlet weak var contactImage: UIImageView!
    @IBOutlet weak var lastNameImage: UIImageView!
    @IBOutlet weak var firstNameImage: UIImageView!
    @IBOutlet weak var descriptionTextView: UITextView!
    @IBOutlet weak var countryCode: DesignableTextField!
    @IBOutlet weak var contactNotxt: DesignableTextField!
    @IBOutlet weak var lastNametxt: DesignableTextField!
    @IBOutlet weak var firstNametxt: DesignableTextField!
    @IBOutlet weak var femaleButton: UIButton!
    @IBOutlet weak var maleButton: UIButton!
    var gender:String = "M"
    
    var submitInformationData: Dictionary<String, String> = [:]
    var numberContact: String = ""
    var checkSuccess:NSString = ""
    override func viewDidLoad() {
        // Controls Initialziation
        super.viewDidLoad()
        descriptionTextView.delegate = self
        firstNametxt.delegate = self
        lastNametxt.delegate = self
        contactNotxt.delegate = self
        firstNametxt.autocapitalizationType  = UITextAutocapitalizationType(rawValue: 1)!
        lastNametxt.autocapitalizationType  = UITextAutocapitalizationType(rawValue: 1)!
        descriptionTextView.layer.borderColor = UIColor(red: 41/255, green: 128/255, blue: 185/255, alpha: 1.0).CGColor
        descriptionTextView.layer.borderWidth = 1
        countryCode.text = "+(061)" // Default contry Code : Australia
    }
    
    @IBAction func femaleClickButton(sender: AnyObject) {
        // Validation: gender
        gender = "F"
        let image = UIImage(named: "checked.png") as UIImage!
        femaleButton.setImage(image, forState: UIControlState.Normal)
        let imageUnChecked = UIImage(named: "unchecked.png") as UIImage!
        maleButton.setImage(imageUnChecked, forState: UIControlState.Normal)
    }
    
    @IBAction func maleClickButton(sender: AnyObject) {
        // 
        gender = "M"
        let image = UIImage(named: "checked.png") as UIImage!
        maleButton.setImage(image, forState: UIControlState.Normal)
        let imageUnChecked = UIImage(named: "unchecked.png") as UIImage!
        femaleButton.setImage(imageUnChecked, forState: UIControlState.Normal)
    }
    
    func changeBorderColor(name:AnyObject){
        name.layer.borderColor = UIColor(red: 232/255, green: 145/255, blue: 147/255, alpha: 1.0).CGColor
        name.layer.borderWidth = 1
        name.layer.cornerRadius = 5
    }
    
    @IBAction func submitButton(sender: AnyObject) {
        
        if(firstNametxt.text.isEmpty || lastNametxt.text.isEmpty || contactNotxt.text.isEmpty){
            
            AlertShow("Notification",message: "Please enter information required *",addButtonWithTitle: "OK")
            if(firstNametxt.text.isEmpty){
                changeBorderColor(firstNametxt)
            }
            if(lastNametxt.text.isEmpty){
                changeBorderColor(lastNametxt)
            }
            if(contactNotxt.text.isEmpty){
                changeBorderColor(contactNotxt)
            }
            if(descriptionTextView.text.isEmpty){
                changeBorderColor(descriptionTextView)
            }
        }else{
            
            var checkSuccess:NSString = "true"
            var alert: UIAlertView = UIAlertView(title: "Make Appointment", message: "Please wait...", delegate: nil, cancelButtonTitle: nil);
            var loadingIndicator: UIActivityIndicatorView = UIActivityIndicatorView(frame: CGRectMake(50, 10, 37, 37)) as UIActivityIndicatorView
            loadingIndicator.center = self.view.center;
            loadingIndicator.hidesWhenStopped = true
            loadingIndicator.activityIndicatorViewStyle = UIActivityIndicatorViewStyle.Gray
            loadingIndicator.startAnimating();
            
            alert.setValue(loadingIndicator, forKey: "accessoryView")
            loadingIndicator.startAnimating()
            
            submitInformationData["firstName"] = firstNametxt.text
            submitInformationData["lastName"] = lastNametxt.text
            submitInformationData["phoneNumber"] = contactNotxt.text
            submitInformationData["gender"] = gender
            submitInformationData["email"] = "nguyenduc.manhit@gmail.com"
            submitInformationData["description"] = descriptionTextView.text
            alert.show();
            
            //
            var request = NSMutableURLRequest(URL: NSURL(string: "http://192.168.1.70:8080/api/urgent-care/urgent-request")!)
            var session = NSURLSession.sharedSession()
            request.HTTPMethod = "POST"
            let dictionary = submitInformationData
            let theJSONData = NSJSONSerialization.dataWithJSONObject(dictionary ,options: NSJSONWritingOptions(0),error: nil)
            let theJSONText = NSString(data: theJSONData!,encoding: NSASCIIStringEncoding)
            
            
            var params: Dictionary<String, String> = [:]
            params["data"] = theJSONText as? String
            
            var err: NSError?
            request.HTTPBody = NSJSONSerialization.dataWithJSONObject(params, options: nil, error: &err)
            request.addValue("application/json", forHTTPHeaderField: "Content-Type")
            request.addValue("application/json", forHTTPHeaderField: "Accept")
            
            var task = session.dataTaskWithRequest(request, completionHandler: {data, response, error -> Void in
                println("Response: \(response)")
                var strData = NSString(data: data, encoding: NSUTF8StringEncoding)
                println("Body: \(strData)")
                var err: NSError?
                var json = NSJSONSerialization.JSONObjectWithData(data, options: .MutableLeaves, error: &err) as? NSDictionary
                
                // Did the JSONObjectWithData constructor return an error? If so, log the error to the console
                if(err != nil) {
                    println(err!.localizedDescription)
                    let jsonStr = NSString(data: data, encoding: NSUTF8StringEncoding)
                    println("Error could not parse JSON: '\(jsonStr)'")
                    checkSuccess = "false"
                }
                else {
                    // The JSONObjectWithData constructor didn't return an error. But, we should still
                    // check and make sure that json has a value using optional binding.
                    if let parseJSON = json {
                        // Okay, the parsedJSON is here, let's get the value for 'success' out of it
                        var success = parseJSON["success"] as? Int
                        checkSuccess = "false"
                        println("Succes: \(success)")
                    }
                    else {
                        // Woa, okay the json object was nil, something went worng. Maybe the server isn't running?
                        let jsonStr = NSString(data: data, encoding: NSUTF8StringEncoding)
                        println("Error could not parse JSON: \(jsonStr)")
                        checkSuccess = "false"
                    }
                }
            })
            
            task.resume()

            //
            
//            RestApiManager.sharedInstance.makeHTTPPostRequest("request", dictData: submitInformationData, postCompleted: { (succeeded) -> () in
//                
//                if(succeeded){
//                    self.checkSuccess == "success"
//                    alert.dismissWithClickedButtonIndex(0, animated: true)
//                    self.AlertShow("", message: "Success", addButtonWithTitle: "OK")
//                }else
//                {
//                    self.checkSuccess == "error"
//                    self.AlertShow("", message: "Error", addButtonWithTitle: "OK")
//                    alert.dismissWithClickedButtonIndex(0, animated: true)
//                    
//                }
//            })
            
        }
    }
    
    func changeColorClicktxtField(name:AnyObject){
        name.layer.borderColor = UIColor(red: 41/255, green: 128/255, blue: 185/255, alpha: 1.0).CGColor
        name.layer.borderWidth = 1
    }
    
    func changeColorOuttxtField(name:AnyObject){
        name.layer.borderWidth = 0
    }
    
    @IBAction func contactNoClick(sender: AnyObject) {
        changeColorClicktxtField(contactNotxt)
    }
    
    @IBAction func lastNameClick(sender: AnyObject) {
       changeColorClicktxtField(lastNametxt)
    }
    
    @IBAction func firstNameButton(sender: AnyObject) {
       changeColorClicktxtField(firstNametxt)
    }
    func textViewDidBeginEditing(textView: UITextView) {
        if(textView == descriptionTextView ){
            descriptionTextView.layer.borderColor = UIColor(red: 41/255, green: 128/255, blue: 185/255, alpha: 1.0).CGColor
            descriptionTextView.layer.borderWidth = 1
        }
    }
    
    func textViewDidChange(textView: UITextView) {
        if(textView  == descriptionTextView){
            if(!descriptionTextView.text.isEmpty){
                descriptionImage.image = UIImage(named: "Checkmark")
            }else{
                descriptionImage.image = UIImage(named: "*")
            }
            descriptionTextView.layer.borderColor = UIColor(red: 41/255, green: 128/255, blue: 185/255, alpha: 1.0).CGColor
            descriptionTextView.layer.borderWidth = 1
        }
    }
    
    func textFieldDidBeginEditing(textField: UITextField) {
        changeColorClicktxtField(textField)
    }
    
    func textFieldDidEndEditing(textField: UITextField) {
        if(textField == firstNametxt){
            if(!firstNametxt.text.isEmpty){
                firstNameImage.image = UIImage(named: "Checkmark")
            }else{
                firstNameImage.image = UIImage(named: "*")
            }
            changeColorOuttxtField(firstNametxt)
        }
        if(textField == lastNametxt){
            if(!lastNametxt.text.isEmpty){
                lastNameImage.image = UIImage(named: "Checkmark")
            }else{
                lastNameImage.image = UIImage(named: "*")
            }
            changeColorOuttxtField(lastNametxt)
        }
        if(textField == contactNotxt){
            if(!contactNotxt.text.isEmpty){
                contactImage.image = UIImage(named: "Checkmark")
                CheckContactNo()
            }else{
                contactImage.image = UIImage(named: "*")
            }
             changeColorOuttxtField(contactNotxt)
            
        }
    }
    
    func CheckContactNo(){
        if( contactNotxt.text.length < 9 || contactNotxt.text.length > 10 ){
            contactImage.image = UIImage(named: "*")
            AlertShow("Notification",message: "Contact is invalid",addButtonWithTitle: "OK")
            
        }else{
            if(contactNotxt.text.length == 10){
                var str = contactNotxt.text.substringToIndex(advance(contactNotxt.text.startIndex, 1))
                if(str != "0"){
                    contactImage.image = UIImage(named: "*")
                    AlertShow("Notification",message: "Contact is invalid",addButtonWithTitle: "OK")
                }else{
                    numberContact = contactNotxt.text.substringWithRange(Range<String.Index>(start: advance(contactNotxt.text.startIndex, 1), end: contactNotxt.text.endIndex))
                }
            }else{
                numberContact = contactNotxt.text
            }
        }

    }
    
    func AlertShow(title:String,message:String,addButtonWithTitle:String){
        let alert = UIAlertView()
        alert.title = title
        alert.message = message
        alert.addButtonWithTitle(addButtonWithTitle)
        alert.show()
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
             submitInformationData["firstName"] = firstNametxt.text
             submitInformationData["lastName"] = lastNametxt.text
             submitInformationData["phoneNumber"] = "061" + numberContact
             submitInformationData["gender"] = gender
             submitInformationData["description"] = descriptionTextView.text
            if(segue.identifier == "information"){
                
                var moreDetail  = segue.destinationViewController as! MoreDetail
                moreDetail.informationData = submitInformationData
                moreDetail.delegateInfor = self
            }
    }
 
    func tranferDataController(copntroller: MoreDetail, moreData: Dictionary<String, String>) {
        submitInformationData = moreData
        print(moreData)
    }
    
    @IBAction func btnOption(sender: AnyObject) {
        if(firstNametxt.text.isEmpty || lastNametxt.text.isEmpty || contactNotxt.text.isEmpty){
            
            AlertShow("Notification",message: "Please enter information required *",addButtonWithTitle: "OK")
            if(firstNametxt.text.isEmpty){
                changeBorderColor(firstNametxt)
            }
            if(lastNametxt.text.isEmpty){
                changeBorderColor(lastNametxt)
            }
            if(contactNotxt.text.isEmpty){
                changeBorderColor(contactNotxt)
            }
            if(descriptionTextView.text.isEmpty){
                changeBorderColor(descriptionTextView)
            }
        }else{
        performSegueWithIdentifier("information", sender: self)
        }
    }
   
    func checkWhenMakeApp(){
        
    }
}
    

