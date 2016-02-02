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
    @IBOutlet weak var versionBuildLabel: UILabel!
    
    //Color is red
    let colorCustom = UIColor(red: 232/255, green: 145/255, blue: 147/255, alpha: 1.0)
    let verifyService = VerifyService()
    let alertView = UIAlertView()
    var phoneNumber = String()
    
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
        view.endEditing(true)
        //Check email if email is valid return message
        if (phoneTextField.text == "" || config.validateRegex(phoneTextField.text!,regex: Regex.PHONE_REGEX) == false){
            animationView(viewPhoneNumber)
            config.borderTextFieldValid(phoneTextField, color: colorCustom)
        }
        else{
            phoneTextField.layer.borderWidth = 0
            view.showLoading()
            requestPhoneNumberToServer()
        }
    }
    
    //Sending phone number to server and check user in DB
    func requestPhoneNumberToServer(){
        verifyService.checkPhoneNumber(phoneTextField.text!, compailer: {
            response in
            print("---",response)
            if(response["message"] == "success"){
                self.view.hideLoading()
                self.performSegueWithIdentifier("phoneRegisterSegue", sender: self)
            }else {
                self.view.hideLoading()
                let message : String = String(response["ErrorType"])
                self.alertView.alertMessage("Error", message: message)
            }
            
        })
    }
    
    //sending data by segue
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
    
    @IBAction func backToHomeAction(sender: AnyObject) {
        self.dismissViewControllerAnimated(true, completion: nil)
    }
    
    //Giap: Animation phone view
    func animationView(view:DesignableView){
        view.animation = "shake"
        view.curve = "easeIn"
        view.force = 2.0
        view.duration = 0.5
        view.animate()
    }
    
    //Validate lenght textfield
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



