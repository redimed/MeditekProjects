//
//  VerifyViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/21/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit

enum MyError: ErrorType {
    case UserError
    case NetworkError
    case DiscoverydError
}
class VerifyViewController: UIViewController,UITextFieldDelegate {
    
    @IBOutlet weak var textFieldVerifyCode: DesignableTextField!
    //Color red
    let colorCustom = UIColor(red: 232/255, green: 145/255, blue: 147/255, alpha: 1.0)
    
    
    let verifyPhoneNumberController = VerifyPhoneNumberController()
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        textFieldVerifyCode.delegate = self
        
        
    }
    //Giap: Close keyboard if out touch text field
    override func touchesBegan(touches: Set<UITouch>, withEvent event: UIEvent?) {
        view.endEditing(true)
        
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    override func viewWillDisappear(animated: Bool) {
        self.navigationController?.navigationBarHidden = true
    }
    
    //Giap: Handle verify code and check field is valid
    @IBAction func VerifyButtonAction(sender: UIButton)  {
        if textFieldVerifyCode.text == "" || textFieldVerifyCode.text?.length < 6 {
            //Start animation
            textFieldVerifyCode.animation = "shake"
            textFieldVerifyCode.curve = "easeIn"
            textFieldVerifyCode.force = 2.0
            textFieldVerifyCode.duration = 0.5
            textFieldVerifyCode.animate()
            //End Animation
            
            //Change border textfield is red
            config.borderTextFieldValid(textFieldVerifyCode, color: colorCustom)
            
        } else {
            
            view.showLoading()
            //Send request phone number to server
            verifyPhoneNumberController.CheckVerifyPhoneNumber(textFieldVerifyCode.text!,deviceID: config.deviceID!){
                response in
                print(response)
                if response["status"] == "success"{
                    self.view.hideLoading()
                    let defaults = NSUserDefaults.standardUserDefaults()
                    let uid = response["uid"].string
                    let token = response["token"].string
                    
                    //Save activated in localstorage
                    defaults.setValue("Verified", forKey: "verifyUser")
                    defaults.setValue(uid, forKey: "uid")
                    defaults.setValue(token, forKey: "token")
                    defaults.synchronize()
                    //Change to home view by segue
                    self.performSegueWithIdentifier("VerifyToHomeSegue", sender: self)
                }else {
                    self.view.hideLoading()
                    if response["TimeOut"] ==  "Request Time Out" {
                        self.alertMessage("Error", message: "Request Time Out")
                    }else {
                        let message : String = String(response["message"]["message"])
                        self.alertMessage("Error", message: message)
                    }
                    
                }
            }
            
        }
        
    }
    
    //Giap: Check textfield maxlength == 6
    func textField(textField: UITextField, shouldChangeCharactersInRange range: NSRange, replacementString string: String) -> Bool {
        let hashValue = string.hash
        let length = ((textField.text?.length)! + string.length)
        if config.validateInputOnlyNumber(hashValue) == false || length > 6 {
            return false
        }else{
            return true
        }
    }
    //Giap: Show alert message
    func alertMessage(title : String,message : String){
        let alertController = UIAlertController(title: title, message: message, preferredStyle: .Alert)
        let OKAction = UIAlertAction(title: "OK", style: .Default) { (action) in
            
        }
        alertController.addAction(OKAction)
        
        self.presentViewController(alertController, animated: true) {
            
        }
    }
    
    
    
    
    
    
}
