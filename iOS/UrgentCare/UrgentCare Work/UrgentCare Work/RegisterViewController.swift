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
import ObjectMapper


class RegisterViewController : BaseViewController {
    
    @IBOutlet weak var phoneTextField: DesignableTextField!
    @IBOutlet weak var scrollView: UIScrollView!
    @IBOutlet weak var viewPhoneNumber: DesignableView!
    @IBOutlet weak var versionBuildLabel: UILabel!
    
    //Color is red
    let colorCustom = UIColor(red: 232/255, green: 145/255, blue: 147/255, alpha: 1.0)
    
    var phoneNumber = String()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        phoneTextField.delegate = self
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    //Giap: Validate email and change view
    @IBAction func btnCheckPhoneAction(sender: DesignableButton)  {
        view.endEditing(true)
        //Check email if email is valid return message
        if (phoneTextField.text == "" || config.validateRegex(phoneTextField.text!,regex: Constants.Regex.MobileNumber) == false){
            animationView(viewPhoneNumber)
            config.borderTextFieldValid(phoneTextField, color: colorCustom)
        }
        else{
            phoneTextField.layer.borderWidth = 0
            showloading(Define.MessageString.PleaseWait)
            requestPhoneNumberToServer()
        }
    }
    
    //Sending phone number to server and check user in DB
    func requestPhoneNumberToServer(){
        let requestRegisterPost:RequestRegisterPost = RequestRegisterPost();
        let requestRegister:RequestRegister = RequestRegister();
        var phoneString : String = phoneTextField.text!
        phoneString.removeAtIndex(phoneString.startIndex)
        
        requestRegister.phone = Constants.StringContant.prefixesPhoneNumber + String(phoneString)
        Context.setDataDefaults(requestRegister.phone, key: Define.keyNSDefaults.PhoneLogin)
        requestRegisterPost.data = requestRegister
        
        UserService.postRequestVerify(requestRegisterPost) { [weak self] (response) in
            print(response)
            if let _ = self {
                if response.result.isSuccess {
                    if let _ = response.result.value {
                        if let responseRegister = Mapper<ResponseRegister>().map(response.result.value) {
                            
                            if(responseRegister.UserUID != ""){
                                
                                Context.setDataDefaults(responseRegister.UserUID, key: Define.keyNSDefaults.UID)
                                Context.setDataDefaults(responseRegister.PatientUID, key: Define.keyNSDefaults.PatientUID)
                                let VerifyPhone :VerifyViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("VerifyViewControllerID") as! VerifyViewController
                                VerifyPhone.UserUID = responseRegister.UserUID
                                VerifyPhone.Activated = responseRegister.Activated
                                self!.hideLoading()
                                let time = dispatch_time(DISPATCH_TIME_NOW, Int64(self!.delay))
                                dispatch_after(time, dispatch_get_main_queue(), {
                                    self?.navigationController?.pushViewController(VerifyPhone, animated: true)
                                })
                                
                            }else{
                                self!.hideLoading()
                                if let errorModel = Mapper<ErrorModel>().map(response.result.value){
                                    self!.alertView.alertMessage("Error", message:Context.getErrorMessage(errorModel.ErrorType))
                                }
                            }
                        }
                    }
                } else {
                    self!.hideLoading()
                    self?.showMessageNoNetwork()
                }
            }
        }
    }
    
    //sending data by segue
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
    }
    // Close keyboard if touch out textfield
    override func touchesBegan(touches: Set<UITouch>, withEvent event: UIEvent?) {
        print("out test")
        view.endEditing(true)
    }
    
    // Hide navigation bar
    override func viewWillDisappear(animated: Bool) {
        self.navigationController?.navigationBarHidden = false
    }
    
    @IBAction func backToHomeAction(sender: AnyObject) {
        self.navigationController?.popViewControllerAnimated(true)
    }
    
    // Animation phone view
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



