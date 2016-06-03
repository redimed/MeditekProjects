//
//  LoginViewController.swift
//  UrgentCare Work
//
//  Created by Meditek on 5/26/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit
import ObjectMapper

class LoginViewController: BaseViewController {
    
    @IBOutlet weak var btnCompany: UIButton!
    @IBOutlet weak var btnPersonal: UIButton!
    
    @IBOutlet weak var viewPersonal: UIView!
    @IBOutlet weak var viewCompany: UIView!
    
    @IBOutlet weak var viewLogin: DesignableView!
    @IBOutlet weak var txtPhoneNumber: DesignableTextField!
    @IBOutlet weak var txtPassword: DesignableTextField!
    @IBOutlet weak var txtUserName: DesignableTextField!
    let colorCustom = UIColor(red: 232/255, green: 145/255, blue: 147/255, alpha: 1.0)
    
    override func viewDidLoad() {
        super.viewDidLoad()
        txtPhoneNumber.delegate = self
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    override func viewWillAppear(animated: Bool) {
    }
    
    @IBAction func actionLogin(sender: AnyObject) {
        showloading(Define.MessageString.PleaseWait)
        LoginUserNamePassword()
    }
    @IBAction func actionContinue(sender: AnyObject) {
        
        view.endEditing(true)
        if (txtPhoneNumber.text == "" || Context.validateRegex(txtPhoneNumber.text!,regex: Define.Regex.MobileNumber) == false){
            animationView(viewLogin)
            Context.borderTextFieldValid(txtPhoneNumber, color: colorCustom)
        }
        else{
            txtPhoneNumber.layer.borderWidth = 0
            showloading(Define.MessageString.PleaseWait)
            requestPhoneNumberToServer()
        }
    }
    @IBAction func ActionCompany(sender: AnyObject) {
        viewCompany.hidden = false
        viewPersonal.hidden = true
        btnPersonal.titleLabel?.textColor = UIColor(hex:Define.ColorCustom.grayBack)
        btnCompany.setTitleColor(UIColor.whiteColor(), forState: .Normal)
        btnCompany.backgroundColor = UIColor(hex:Define.ColorCustom.grayBack)
        btnPersonal.backgroundColor = UIColor.whiteColor()
    }
    @IBAction func ActionPersonal(sender: AnyObject) {
        viewCompany.hidden = true
        viewPersonal.hidden = false
        btnCompany.backgroundColor = UIColor.whiteColor()
        btnPersonal.backgroundColor = UIColor(hex:Define.ColorCustom.grayBack)
        btnCompany.titleLabel?.textColor = UIColor(hex:Define.ColorCustom.grayBack)
    }
    
    func textField(textField: UITextField, shouldChangeCharactersInRange range: NSRange, replacementString string: String) -> Bool {
        if(textField.tag == 101){
            let hashValue = string.hash
            let length = ((textField.text?.length)! + string.length)
            if Context.validateInputOnlyNumber(hashValue) == false || length > 10 {
                return false
            }else{
                return true
            }
        }else if(textField.tag == 102){
            return true
        }else{
            return true
        }
    }
    
    func requestPhoneNumberToServer(){
        let requestRegisterPost:RequestRegisterPost = RequestRegisterPost();
        let requestRegister:RequestRegister = RequestRegister();
        var phoneString : String = txtPhoneNumber.text!
        phoneString.removeAtIndex(phoneString.startIndex)
        
        requestRegister.phone = Define.StringContant.prefixesPhoneNumber + String(phoneString)
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
    func LoginTeleheathUser(UID:String,loginResponse:LoginResponse){
        Context.setDataDefaults(loginResponse.refreshCode, key: Define.keyNSDefaults.RefreshCode)
        let token =  "Bearer \(loginResponse.token)"
        Context.setDataDefaults(token, key: Define.keyNSDefaults.Authorization)
        
        let loginTelehealth:LoginTelehealth = LoginTelehealth();
        loginTelehealth.uid = UID
        loginTelehealth.token = Context.getDataDefasults(Define.keyNSDefaults.DeviceToken) as! String
        
        UserService.postTelehealthUser(loginTelehealth) { [weak self] (response) in
            print(response)
            if let _ = self {
                if response.result.isSuccess {
                    if let _ = response.result.value {
                        
                        if let loginTelehealthReponse = Mapper<LoginTelehealthReponse>().map(response.result.value) {
                            
                            if loginTelehealthReponse.message == "success"  {
                                
                                for var i = 0; i < loginResponse.user?.roles.count; i += 1 {
                                    if(loginResponse.user?.roles[i].ID == Define.StringContant.RolesCompanyID){
                                        Context.setDataDefaults("true",key: Define.keyNSDefaults.IsCompanyAccount)
                                    }
                                }
                                //Set hearder data
                                
                                Context.setDataDefaults((loginResponse.user?.UID)!, key: Define.keyNSDefaults.UserUID)
                                Context.setDataDefaults((loginResponse.user?.telehealthUser.UID)!, key: Define.keyNSDefaults.TelehealthUserUID)
                                
                                Context.setDataDefaults("login", key: Define.keyNSDefaults.userLogin)
                                
                                let profile = Mapper().toJSON(loginResponse)
                                Context.setDataDefaults(profile, key: Define.keyNSDefaults.userInfor)
                                //end setHeader data
                                
                                let loginViewController :UIViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("ViewControllerID") as! ViewController
                                self?.hideLoading()
                                let time = dispatch_time(DISPATCH_TIME_NOW, Int64(self!.delay))
                                dispatch_after(time, dispatch_get_main_queue(), {
                                    self?.navigationController?.pushViewController(loginViewController, animated: true)
                                })
                            }else{
                                self?.hideLoading()
                                if let errorModel = Mapper<ErrorModel>().map(response.result.value){
                                    self!.alertView.alertMessage("Error", message:Context.getErrorMessage(errorModel.ErrorType))
                                }
                            }
                        }
                    }
                } else {
                    self?.hideLoading()
                    self?.showMessageNoNetwork()
                }
                
            }
            
        }
    }
    func LoginUserNamePassword(){
        
        let login:Login = Login();
        login.UserName = txtUserName.text! as String
        login.Password = txtPassword.text! as String
        
        UserService.postLogin(login) { [weak self] (response) in
            print(response)
            if let _ = self {
                if response.result.isSuccess {
                    if let _ = response.result.value {
                        if let loginResponse = Mapper<LoginResponse>().map(response.result.value) {
                            if loginResponse.status == "success"  {
                                if let cookie : String = response.response!.allHeaderFields["Set-Cookie"] as? String  {
                                    Context.setDataDefaults(cookie, key: Define.keyNSDefaults.Cookie)
                                    self!.LoginTeleheathUser((loginResponse.user?.UID)!,loginResponse: loginResponse)
                                }
                            }else{
                                self?.hideLoading()
                                if let errorModel = Mapper<ErrorModel>().map(response.result.value){
                                    self!.alertView.alertMessage("Error", message:Context.getErrorMessage(errorModel.ErrorType))
                                }
                            }
                        }
                    }
                } else {
                    self?.hideLoading()
                    self?.showMessageNoNetwork()
                }
                
            }
        }
    }
    @IBAction func backToHomeAction(sender: AnyObject) {
        self.navigationController?.popViewControllerAnimated(true)
    }

}
