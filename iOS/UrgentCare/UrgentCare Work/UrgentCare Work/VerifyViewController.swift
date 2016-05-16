//
//  VerifyViewController.swift
//  Telehealth
//
//  Created by Nguyen Duc Manh on 9/21/15.
//  Copyright © 2015 Nguyen Duc Manh. All rights reserved.
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

class VerifyViewController: BaseViewController {
    
    @IBOutlet weak var textFieldVerifyCode: DesignableTextField!
    let colorCustom = UIColor(red: 232/255, green: 145/255, blue: 147/255, alpha: 1.0)
    var UserUID = String()
    var Activated = ""
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        NSNotificationCenter.defaultCenter().addObserver(self, selector: #selector(VerifyViewController.gotEventNotification), name: Define.PushNotification.PushChangePassword, object: nil)
        self.navigationController?.navigationBarHidden = false
        textFieldVerifyCode.delegate = self
        if(Activated == "N"){
            self.showAlertWithMessageTitle("Please check your mobile device now", title: "Notification", alertStyle: DTAlertStyle.DTAlertStyleSuccess)
        }
    }
    func gotEventNotification(noti: NSNotification) -> Void {
        hideLoading()
        if let notification = Mapper<Notification>().map(noti.object) {
            self.alertView.alertMessage("Message", message:notification.message)
        }
    }
    
    override func touchesBegan(touches: Set<UITouch>, withEvent event: UIEvent?) {
        view.endEditing(true)
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    override func viewWillDisappear(animated: Bool) {
        NSNotificationCenter.defaultCenter().removeObserver(self,name:Define.PushNotification.PushChangePassword,object: nil)
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
            Context.borderTextFieldValid(textFieldVerifyCode, color: colorCustom)
            
        } else {
            showloading(Define.MessageString.PleaseWait)
            self.LogInPhoneNumber(UserUID, PinNumber: textFieldVerifyCode.text!)
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
    
    func LogInPhoneNumber(UserUID:String,PinNumber:String){
        
        let login:Login = Login();
        login.UserUID = UserUID
        login.PinNumber = PinNumber
        
        UserService.postLogin(login) { [weak self] (response) in
            print(response)
            if let _ = self {
                if response.result.isSuccess {
                    if let _ = response.result.value {
                        if let loginResponse = Mapper<LoginResponse>().map(response.result.value) {
                            if loginResponse.status == "success"  {
                                if let cookie : String = response.response!.allHeaderFields["Set-Cookie"] as? String  {
                                    Context.setDataDefaults(cookie, key: Define.keyNSDefaults.Cookie)
                                }
                                self!.LoginTeleheathUser(UserUID,loginResponse: loginResponse)
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
    
    @IBAction func ActionForgetPassword(sender: AnyObject) {
        showloading(Define.MessageString.PleaseWait)
        let forgetPin:ForgetPin = ForgetPin();
        forgetPin.token = Context.getDataDefasults(Define.keyNSDefaults.DeviceToken) as! String
        forgetPin.phone = Context.getDataDefasults(Define.keyNSDefaults.PhoneLogin) as! String
        UserService.postForgetPin(forgetPin) { [weak self] (response) in
            print(response)
            if let _ = self {
                if response.result.isSuccess {
                    if let _ = response.result.value {
                        if let responseNotifiData = Mapper<ResponseNotifiData>().map(response.result.value) {
                            if responseNotifiData.message == "success"  {
                                self?.hideLoading()
                                if(responseNotifiData.data.message.results[0].error != ""){
                                    self!.alertView.alertMessage("Error", message:Context.getErrorMessage(responseNotifiData.data.message.results[0].error))
                                }
                            }else{
                                self?.hideLoading()
                                if(responseNotifiData.status != ""){
                                    self!.alertView.alertMessage("Warning", message:responseNotifiData.status)
                                }else{
                                    if let errorModel = Mapper<ErrorModel>().map(response.result.value){
                                        self!.alertView.alertMessage("Error", message:Context.getErrorMessage(errorModel.ErrorType))
                                    }
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
    func textField(textField: UITextField, shouldChangeCharactersInRange range: NSRange, replacementString string: String) -> Bool {
        let hashValue = string.hash
        let length = ((textField.text?.length)! + string.length)
        if Context.validateInputOnlyNumber(hashValue) == false || length > 6 {
            return false
        }else{
            return true
        }
    }
}
