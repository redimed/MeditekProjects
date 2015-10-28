//
//  ViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/21/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON


class ViewController: UIViewController,UITextFieldDelegate {
    
    @IBOutlet weak var phoneTextField: DesignableTextField!
    @IBOutlet weak var scrollView: UIScrollView!
    @IBOutlet weak var viewPhoneNumber: DesignableView!
    var phoneNumber = String()
    
    @IBOutlet weak var versionBuildLabel: UILabel!
    
    let api = GetAndPostDataController()
    //Color is red
    let colorCustom = UIColor(red: 232/255, green: 145/255, blue: 147/255, alpha: 1.0)
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        phoneTextField.delegate = self
        
        versionBuildLabel.text = MessageString.VersionAndBuild
        
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    //Giap: Validate email and change view
    @IBAction func btnCheckPhoneAction(sender: DesignableButton)  {
        //Check email if email is valid return message
        if (phoneTextField.text == "" || validatePhoneNumber(phoneTextField.text!) == false){
            animationView(viewPhoneNumber)
            config.borderTextFieldValid(phoneTextField, color: colorCustom)
        }
        else{
            phoneTextField.layer.borderWidth = 0
            
            view.showLoading()
            
            api.SendVerifyPhoneNumber(config.deviceID!,phoneNumber: phoneTextField.text!){
                response in
                //Check status API responsed
                if(response["status"] == "success"){
                    self.view.hideLoading()
                    
                    self.performSegueWithIdentifier("phoneRegisterSegue", sender: self)
                }else {
                    self.view.hideLoading()
                    if response["TimeOut"].string ==  ErrorMessage.TimeOut {
                        self.alertMessage("Error", message: ErrorMessage.TimeOut)
                    }else {
                        print(response)
                        let message : String = String(response["ErrorsList"][0])
                        self.alertMessage("Error", message: message)
                    }
                    
                }
            }
        }
        
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if segue.identifier == "phoneRegisterSegue" {
            let destVC = segue.destinationViewController as! VerifyViewController
            destVC.phoneNumber = phoneTextField.text!
            
        }
    }
    
    
    
    //Giap:  Close keyboard if touch out textfield
    override func touchesBegan(touches: Set<UITouch>, withEvent event: UIEvent?) {
        view.endEditing(true)
    }
    
    
    //Giap: Hide navigation bar
    override func viewWillDisappear(animated: Bool) {
        self.navigationController?.navigationBarHidden = false
    }
    
    //Giap: Regex check valid phone number
    func validatePhoneNumber(value: String) -> Bool {
        //EX: 04 245 544 45 || 4 564 242 45
        let PHONE_REGEX = "^0?4[0-9]{8}$"
        
        let phoneTest = NSPredicate(format: "SELF MATCHES %@", PHONE_REGEX)
        
        let result =  phoneTest.evaluateWithObject(value)
        
        return result
        
    }
    //Giap: Animation phone view
    func animationView(view:DesignableView){
        view.animation = "shake"
        view.curve = "easeIn"
        view.force = 2.0
        view.duration = 0.5
        view.animate()
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
    
    func textField(textField: UITextField, shouldChangeCharactersInRange range: NSRange, replacementString string: String) -> Bool {
        let hashValue = string.hash
        
        let length = ((textField.text?.length)! + string.length)
        if config.validateInputOnlyNumber(hashValue) == false || length > 10 {
            
            return false
        }else{
            return true
        }
        
    }
    
}



