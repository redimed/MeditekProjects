//
//  VerifyService.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 1/14/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import Foundation
import SwiftyJSON
class VerifyService{
    let api = VerifyPhoneAPI()
    let socketService = SocketService()
    func checkPhoneNumber(phoneNumber:String, compailer:(JSON) -> Void){
        api.SendVerifyPhoneNumber(phoneNumber){
            response in
           
            //Check status API responsed
            if(response["status"] == "success"){
                if let cookie = defaults.valueForKey("Set-Cookie") as? String{
                    cookies = cookie
                }
                compailer(["message":"success"])
            }else {
                print(response)
                if response["TimeOut"].string ==  ErrorMessage.TimeOut {
                    compailer(["message":"error","ErrorType":ErrorMessage.TimeOut])
                }else if(response["internetConnection"].string == ErrorMessage.internetConnection){
                    compailer(["message":"error","ErrorType":ErrorMessage.internetConnection])
                }else{
                    let message : String = String(response["ErrorsList"][0])
                    compailer(["message":"error","ErrorType":message])
                }
            }
        }
        
    }
    
    
    func verifyPhoneNumber(verifyNumber:String,phoneNumber:String,compailer:(JSON) -> Void){
        api.CheckVerifyPhoneNumber(verifyNumber,phoneNumber:phoneNumber){
            response in
            print(response)
            if response["status"] == "success"{
                let defaults = NSUserDefaults.standardUserDefaults()
                let uid = response["teleUID"].string! as String
                let token = response["token"].string! as String
                let patientUID = response["patientUID"].string! as String
                let userUID = response["userUID"].string! as String
                let refreshCode = response["refreshCode"].string! as String
                
                //Save activated in localstorage
                defaults.setValue("Verified", forKey: "verifyUser")
                defaults.setValue(uid, forKey: "uid")
                defaults.setValue(token, forKey: "token")
                defaults.setValue(patientUID, forKey: "patientUID")
                defaults.setValue(userUID, forKey: "userUID")
                defaults.setValue(refreshCode, forKey: "refreshCode")
                
                defaults.synchronize()
                
                compailer(["message":"success"])
                
            }else {
                if response["TimeOut"].string ==  ErrorMessage.TimeOut || response["ErrorsList"][0].string == nil {
                    compailer(["message":"error","ErrorType":ErrorMessage.TimeOut])
                }else {
                    let message : String = String(response["ErrorsList"][0])
                    compailer(["message":"error","ErrorType":message])
                    
                }
                
            }
        }
    }
    
}