import UIKit

class InformationViewController: UIViewController,UITextFieldDelegate ,UITextViewDelegate {
    

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
    
    override func viewDidLoad() {
        super.viewDidLoad()
        descriptionTextView.delegate = self
        firstNametxt.delegate = self
        lastNametxt.delegate = self
        contactNotxt.delegate = self
        firstNametxt.autocapitalizationType  = UITextAutocapitalizationType(rawValue: 1)!
        lastNametxt.autocapitalizationType  = UITextAutocapitalizationType(rawValue: 1)!
        descriptionTextView.layer.borderColor = UIColor(red: 41/255, green: 128/255, blue: 185/255, alpha: 1.0).CGColor
        descriptionTextView.layer.borderWidth = 1
        countryCode.text = "+(061)"
        
    }

    @IBAction func femaleClickButton(sender: AnyObject) {
        //change image for femaleButton
         gender = "F"
        let image = UIImage(named: "checked.png") as UIImage!
        femaleButton.setImage(image, forState: UIControlState.Normal)
        let imageUnChecked = UIImage(named: "unchecked.png") as UIImage!
        maleButton.setImage(imageUnChecked, forState: UIControlState.Normal)
    }
    
    @IBAction func maleClickButton(sender: AnyObject) {
        //change image for maleButton 
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
            
            AlertShow("Notification",message: "Please enter information",addButtonWithTitle: "OK")
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
            //var alert: UIAlertView = UIAlertView(title: "Make Appointment", message: "Please wait...", delegate: nil, cancelButtonTitle: "Cancel");
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
                }
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
    
}
