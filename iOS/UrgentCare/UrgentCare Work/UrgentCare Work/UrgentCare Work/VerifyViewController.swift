//
//  VerifyViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/21/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON
import ObjectMapper

enum MyError: ErrorType {
    case UserError
    case NetworkError
    case DiscoverydError
}

class VerifyViewController: UIViewController,UITextFieldDelegate {
    
    @IBOutlet weak var textFieldVerifyCode: DesignableTextField!
    //Color red
    let colorCustom = UIColor(red: 232/255, green: 145/255, blue: 147/255, alpha: 1.0)
    var phoneNumber = String()
    
    let alertView = UIAlertView()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.navigationController?.navigationBarHidden = false
        textFieldVerifyCode.delegate = self
    }
    
    //Close keyboard if out touch text field
    override func touchesBegan(touches: Set<UITouch>, withEvent event: UIEvent?) {
        view.endEditing(true)
        
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    override func viewWillDisappear(animated: Bool) {
        self.navigationController?.navigationBarHidden = true
    }
    
    @IBAction func VerifyButtonAction(sender: UIButton)  {
        view.endEditing(true)
        if textFieldVerifyCode.text == "" || textFieldVerifyCode.text?.length < 6 {
            
            textFieldVerifyCode.animation = "shake"
            textFieldVerifyCode.curve = "easeIn"
            textFieldVerifyCode.force = 2.0
            textFieldVerifyCode.duration = 0.5
            textFieldVerifyCode.animate()
            config.borderTextFieldValid(textFieldVerifyCode, color: colorCustom)
            
        } else {
            showloading("Please wait...")
            let verifyCodeRequest:VerifyCodeRequest = VerifyCodeRequest();
            let verifyCode:VerifyCode = VerifyCode();
            verifyCode.code = textFieldVerifyCode.text!
            verifyCode.phone = phoneNumber
            
            verifyCodeRequest.data = verifyCode
            
            UserService.postCheckVerifyCode(verifyCodeRequest) { [weak self] (response) in
                print(response)
                if let _ = self {
                    if response.result.isSuccess {
                        if let _ = response.result.value {
                            if let responseVerifyCode = Mapper<ResponseVerifyCode>().map(response.result.value) {
                                if(responseVerifyCode.verifyCode != ""){
                                    self?.LogInPhoneNumber(responseVerifyCode.userUID, VerificationToken: responseVerifyCode.verifyCode)
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
    }
//    func LogoutWhenLogOutFail(){
//        if( Context.getDataDefasults(Define.keyNSDefaults.UIDLogoutFail) as! String != "" ){
//            showloading("Please wait...")
//            let verifyCodeRequest:VerifyCodeRequest = VerifyCodeRequest();
//            let verifyCode:VerifyCode = VerifyCode();
//            verifyCode.code = textFieldVerifyCode.text!
//            verifyCode.phone = phoneNumber
//            
//            verifyCodeRequest.data = verifyCode
//            
//            UserService.postCheckVerifyCode(verifyCodeRequest) { [weak self] (response) in
//                print(response)
//                if let _ = self {
//                    if response.result.isSuccess {
//                        if let _ = response.result.value {
//                            if let requestVerifyPost = Mapper<ResponseVerifyPost>().map(response.result.value) {
//                                if(requestVerifyPost.verifyCode != ""){
//                                    self!.hideLoading()
//                                    self!.LogoutWhenLogOutFail()
//                                    //                                    self!.getInformationPatientBy(requestVerifyPost.patientUID)
//                                    //                                    let loginViewController :UIViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("ViewController") as! ViewController
//                                    //                                    self!.navigationController?.pushViewController(loginViewController, animated: true)
//                                }else{
//                                    self!.hideLoading()
//                                    if let errorModel = Mapper<ErrorModel>().map(response.result.value){
//                                        self!.alertView.alertMessage("Error", message:Context.getErrorMessage(errorModel.ErrorType))
//                                    }
//                                }
//                            }
//                        }
//                    } else {
//                        self!.hideLoading()
//                        self?.showMessageNoNetwork()
//                    }
//                }
//            }
//        }
//    }
    
    func LogInPhoneNumber(UserUID:String,VerificationToken:String){
       
        
        let login:Login = Login();
        login.UserUID = UserUID
        login.VerificationToken = VerificationToken

        UserService.postLogin(login) { [weak self] (response) in
            print(response)
            if let _ = self {
                if response.result.isSuccess {
                    if let _ = response.result.value {
                        if let loginResponse = Mapper<LoginResponse>().map(response.result.value) {
                            
                            if loginResponse.status == "success"  {
                                
                                self?.hideLoading()
                                
                                //Set hearder data
                                let token =  "Bearer \(loginResponse.token)"
                                Context.setDataDefaults(token, key: Define.keyNSDefaults.Authorization)
                                Context.setDataDefaults("login", key: Define.keyNSDefaults.userLogin)
                                
                                if let cookie : String = response.response!.allHeaderFields["Set-Cookie"] as? String  {
                                    Context.setDataDefaults(cookie, key: Define.keyNSDefaults.Cookie)
                                }
                                let profile = Mapper().toJSON(loginResponse)
                                Context.setDataDefaults(profile, key: Define.keyNSDefaults.userInfor)
                                //end setHeader data
                                
                                let loginViewController :UIViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("ViewController") as! ViewController
                                self!.navigationController?.pushViewController(loginViewController, animated: true)
                                
                            }else{
                                self?.hideLoading()
                                if let errorModel = Mapper<ErrorModel>().map(response.result.value){
                                    self!.alertView.alertMessage("Error", message:Context.getErrorMessage(errorModel.ErrorType))
                                }
                            }
                        }
                    }
                } else {
                    self?.showMessageNoNetwork()
                }
                
            }
        }

        
    }
    func getInformationPatientBy(patientUID:String) {
        if(Context.getDataDefasults(Define.keyNSDefaults.UIDLogoutFail) as! String != ""){
            let logoutPost : LogoutPost = LogoutPost()
            let logout : Logout = Logout()
            logout.uid = Context.getDataDefasults(Define.keyNSDefaults.UIDLogoutFail) as! String
            logoutPost.data = logout
            
            UserService.postLogin(logoutPost) { [weak self] (response) in
                print(response)
                if let _ = self {
                    if response.result.isSuccess {
                        if let _ = response.result.value {
                            
                        }
                    } else {
                        self?.showMessageNoNetwork()
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
}
