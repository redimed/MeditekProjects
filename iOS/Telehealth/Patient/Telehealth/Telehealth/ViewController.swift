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
    
    
    let api = VerifyPhoneNumberController()
    //color is red
    let colorCustom = UIColor(red: 232/255, green: 145/255, blue: 147/255, alpha: 1.0)
    
    //-------------------------------------------------------------------------------//
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
     
        
        phoneTextField.delegate = self
                      
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        
    }
    //Validate email and change view
    @IBAction func btnCheckPhoneAction(sender: DesignableButton) {
        //Check email if email is valid return message
        if (phoneTextField.text == ""){
            config.animationTexfield(phoneTextField)
            config.borderTextFieldValid(phoneTextField, color: colorCustom)
        }
        else{
            phoneTextField.layer.borderWidth = 0
            phoneTextField.text = ""
            view.showLoading()
            
          
           

            api.SendVerifyPhoneNumber(config.deviceID!){
                response in
                //check status API responsed
                if(response["status"] == "success"){
                    self.view.hideLoading()
                   self.performSegueWithIdentifier("phoneRegisterSegue", sender: self)
                }
            }
        }
        
    }
    
    // Close keyboard if touch out textfield
    override func touchesBegan(touches: Set<UITouch>, withEvent event: UIEvent?) {
        view.endEditing(true)
    }
    
    
    //Hide navigation bar
    override func viewWillDisappear(animated: Bool) {
        self.navigationController?.navigationBarHidden = false
    }
    
  //Regex check valid phone number
  func validatePhoneNumber(value: String) -> Bool {
     //EX: (02)12341234 | (03)12341234 | (05)12341234
    let PHONE_REGEX = "^\\(0[1-9]{1}\\)[0-9]{8}$"
    
    let phoneTest = NSPredicate(format: "SELF MATCHES %@", PHONE_REGEX)
    
    let result =  phoneTest.evaluateWithObject(value)
    
    return result
    
    }
//    func textFieldDidBeginEditing(textField: UITextField) {
//        scrollView.setContentOffset(CGPointMake(0, 250), animated: true)
//    }
    
    
    
    
    
    
  
    
    
}

