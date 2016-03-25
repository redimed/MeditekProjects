//
//  LoginViewController.swift
//  Telehealth
//
//  Created by Meditek on 3/24/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit

class LoginViewController : UIViewController,UITextFieldDelegate {
    
    @IBOutlet weak var textFieldVerifyCode: DesignableTextField!
    //Color red
    let colorCustom = UIColor(red: 232/255, green: 145/255, blue: 147/255, alpha: 1.0)
    var phoneNumber = String()
    
    let verifyService = VerifyService()
    let alertView = UIAlertView()
    let verifyPhoneAPI = VerifyPhoneAPI()
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
        view.endEditing(true)
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
            self.view.showLoading()
            verifyService.verifyPhoneNumber(textFieldVerifyCode.text!, phoneNumber: phoneNumber, compailer: {
                response in
                if response["message"] == "success"{
                    //Change to home view by segue
                    if(defaults.valueForKey("logoutFail") as? String != nil){
                        self.verifyPhoneAPI.logOut((defaults.valueForKey("UIDLogoutFail") as? String)!,completionHandler: {
                            response in
                            print(response)
                            if response["status"] == "success"{
                                print("logout when internet connect")
                                let defaults = NSUserDefaults.standardUserDefaults()
                                defaults.removeObjectForKey("logoutFail")
                                defaults.removeObjectForKey("UIDLogoutFail")
                                defaults.synchronize()
                            }else{
                                print("logout fail when internet connect")
                            }
                        })
                    }
                    let VerifyPhone = self.storyboard?.instantiateViewControllerWithIdentifier("HomeViewControllerID") as! HomeViewController
                    self.navigationController?.pushViewController(VerifyPhone, animated: true)
                    
                }else {
                    self.view.hideLoading()
                    self.textFieldVerifyCode.text = ""
                    if(response["internetConnection"].string == ErrorMessage.internetConnection){
                        self.alertView.alertMessage("Error", message: ErrorMessage.internetConnection)
                    }else if(response["ErrorType"] == "Activation.codeInvalid"){
                        self.alertView.alertMessage("Error", message: "Pin number Invalid")
                    }
                }
            })
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
}
