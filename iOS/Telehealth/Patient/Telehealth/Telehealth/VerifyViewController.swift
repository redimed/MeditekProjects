//
//  VerifyViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/21/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
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
        self.navigationController?.navigationBarHidden = false
        textFieldVerifyCode.delegate = self
        if(Activated == "N"){
            self.showAlertWithMessageTitle("Please check your mobile device now", title: "Notification", alertStyle: DTAlertStyle.DTAlertStyleSuccess)
        }
    }
    
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
            showloading(Define.MessageString.PleaseWait)
            self.LogInPhoneNumber(UserUID, PinNumber: textFieldVerifyCode.text!)
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
                            print(response.result.value)
                            if loginResponse.status == "success"  {
                                Context.setDataDefaults((loginResponse.user?.telehealthUser.UID)!, key: "uid")
                                Context.setDataDefaults(loginResponse.token, key: Define.keyNSDefaults.Authorization)
                                Context.setDataDefaults(loginResponse.token, key: "token")
                                Context.setDataDefaults(loginResponse.refreshCode, key: "refreshCodes")
                                
                                if let cookie : String = response.response!.allHeaderFields["Set-Cookie"] as? String  {
                                    Context.setDataDefaults(cookie, key: Define.keyNSDefaults.Cookie)
                                }
                                
                                let loginViewController :UIViewController = UIStoryboard(name: "Main", bundle:nil).instantiateViewControllerWithIdentifier("HomeViewControllerID") as! HomeViewController
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
