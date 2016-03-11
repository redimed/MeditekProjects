//
//  VerifyPhoneAPI.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 1/13/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import Foundation
import Alamofire
import SwiftyJSON




class VerifyPhoneAPI:TokenAPI {
    //Giap: Check phone number and send verify code
    func SendVerifyPhoneNumber (var phoneNumber:String,completionHandler:(JSON) -> Void){
        config.setHeader()
        //Split number 0
        phoneNumber.removeAtIndex(phoneNumber.startIndex)
        var phoneConfig : String!
        if ConfigurationSystem.http == httpUrl.httpTestApp {
            phoneConfig = "+61"+phoneNumber
        }else {
            phoneConfig = "+61412345678"
            //  phoneConfig = "+61400000002"
        }
        let parameters = [
            "data": [
                "phone":phoneConfig,
                "deviceType": "ios"
            ]
        ]
      
        Alamofire.request(.POST, ConfigurationSystem.Http_3009 + UrlAPICheckPhoneNumber.SendVerifyCodePhoneNumber ,headers:config.headers, parameters: parameters).responseJSON{
             response  in
            switch response.result {
            case .Success(let JSONData):
                if let cookie : String = response.response!.allHeaderFields["Set-Cookie"] as? String  {
                    let defaults = NSUserDefaults.standardUserDefaults()
                    defaults.setValue(cookie, forKey: "Set-Cookie")
                    defaults.synchronize()
                }
                completionHandler(JSON(JSONData))
            case .Failure( let error):
                print("Request failed with error: \(error)")
                completionHandler(JSON(["TimeOut":ErrorMessage.TimeOut]))
            }
        }
        
    }
    
    //Giap: Check verify code
    func CheckVerifyPhoneNumber (verifyCode:String,var phoneNumber:String,completionHandler:(JSON) -> Void){
        config.setHeader()
        phoneNumber.removeAtIndex(phoneNumber.startIndex)
        var phoneConfig : String!
        if ConfigurationSystem.http == httpUrl.httpTestApp {
            phoneConfig = "+61"+phoneNumber
        }else {
            phoneConfig = "+61412345678"
            //phoneConfig = "+61400000002"
        }
        let parameters = [
            "data": [
                "code":verifyCode,
                "deviceType": "ios",
                "Phone":phoneConfig
            ]
        ]
        
        Alamofire.request(.POST, ConfigurationSystem.Http_3009 + UrlAPICheckPhoneNumber.CheckVerifyCode ,headers:config.headers, parameters: parameters).responseJSON{
             response in
            
            switch response.result {
            case .Success(let JSONData):
                var data = JSON(JSONData)
                if data["ErrorType"] == nil {
                    let verifyCode = data["verifyCode"].string! as String
                    let patientUID = data["patientUID"].string!   as String
                    let userUID = data["userUID"].string!  as String
                    self.loginApi(userUID: userUID, patientUID: patientUID, verifyCode: verifyCode){
                        dataResponse in
                        completionHandler(dataResponse)
                    }
                    
                }else {
                    completionHandler(data)
                }
                
            case .Failure(let error):
                print("Request failed with error: \(error)")
                completionHandler(JSON(["TimeOut":ErrorMessage.TimeOut]))
            }
        }
    }
    
    func loginApi(userUID userUID:String,patientUID:String,verifyCode:String,completionHandler:(JSON) -> Void){
        config.setHeader()
        let deviceId = defaults.valueForKey("deviceID") as? String
        
        let parameters = [
            "UserName":"1",
            "Password":"2",
            "UserUID": userUID,
            "DeviceID":deviceId! as String,
            "VerificationToken":verifyCode,
            "AppID":UIApplication.sharedApplication().bundleID()
        ]
        
        Alamofire.request(.POST, ConfigurationSystem.Http_3006 + UrlAPICheckPhoneNumber.apiLogin ,headers:config.headers, parameters: parameters).responseJSON{
             response in
            
            switch response.result {
            case .Success(let JSONData):
                if let requireupdatetoken = response.response?.allHeaderFields["requireupdatetoken"] {
                    if requireupdatetoken as! String == "true" {
                        print("Update token",requireupdatetoken)
                        self.getNewToken()
                    }
                }
                let data = JSON(JSONData)
                //print(data)
                self.informationUser(data,patientUID: patientUID){
                    dataResponse in
                    completionHandler(dataResponse)
                }
            case .Failure(let error):
                completionHandler(JSON(error))
                print("Request failed with error: \(error)")
            
            }
        }
        
    }
    
    func logOut(completionHandler:(JSON)-> Void){
        config.setHeader()
        Alamofire.request(.GET, ConfigurationSystem.Http_3006 + UrlInformationPatient.logOut ,headers:config.headers).responseJSON{
             response in
           
            switch response.result {
            case .Success(let JSONData):
                if let requireupdatetoken = response.response?.allHeaderFields["requireupdatetoken"] {
                    if requireupdatetoken as! String == "true" {
                        print("Update token",requireupdatetoken)
                        self.getNewToken()
                    }
                }
                let data = JSON(JSONData)
                completionHandler(data)
            case .Failure(let error):
                completionHandler(JSON(error))
                print("Request failed with error: \(error)")
            }
        }
    }
    
    
    
    func informationUser(data:JSON,patientUID:String ,completionHandler:(JSON) -> Void){
        config.setHeader()
        let uid = data["user"]["UID"].string! as String
        let token = data["token"].string! as String
        let refreshCode = data["refreshCode"].string! as String
        config.headers["Authorization"] = "Bearer \(token)"
        
        Alamofire.request(.GET, ConfigurationSystem.Http_3009 + UrlInformationPatient.getUserInfo + uid ,headers:config.headers).responseJSON{
             response in
            switch response.result {
            case .Success(let JSONData):
                if let requireupdatetoken = response.response?.allHeaderFields["requireupdatetoken"] {
                    if requireupdatetoken as! String == "true" {
                        print("Update token",requireupdatetoken)
                        self.getNewToken()
                    }
                }
                let data = JSON(JSONData)
                let userInfo = [
                    "patientUID":patientUID,
                    "token":token,
                    "refreshCode":refreshCode,
                    "userUID":uid,
                    "teleUID":data["UID"].string! as String,
                    "status":"success"
                ]
                completionHandler(JSON(userInfo))
            case .Failure(let error):
                completionHandler(JSON(error))
                print("Request failed with error: \(error)")
                
            }
        }
    }
}