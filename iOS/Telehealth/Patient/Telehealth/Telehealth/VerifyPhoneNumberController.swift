//
//  VerifyPhoneNumberController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/25/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON


class VerifyPhoneNumberController {
    
    func GetDataAPI (url:String,completionHandler: (JSON) -> Void)  {
        
        Alamofire.request(.GET, url)
            .responseJSON { response in
                completionHandler(JSON(response.2.value!) )
                
        }
        
    }
    //Giap: Check phone number and send verify code
    func SendVerifyPhoneNumber (deviceID:String,completionHandler:(JSON) -> Void){
        let parameters = [
            "data": [
                "phone":"+84988880682",
                "deviceId":deviceID,
                "deviceType": "ios"
            ]
        ]
        Alamofire.request(.POST, config.Http + UrlAPICheckPhoneNumber.SendVerifyCodePhoneNumber.rawValue , parameters: parameters).responseJSON{
            request, response, result  in
            switch result {
            case .Success(let JSONData):
                completionHandler(JSON(JSONData) )
                
            case .Failure(let data, let error):
                print("Request failed with error: \(error)")
                
                if let data = data {
                    print("Response data: \(NSString(data: data, encoding: NSUTF8StringEncoding)!)")
                }
            }
        }

    }
    //Giap: Check verify code
    func CheckVerifyPhoneNumber (verifyCode:String,deviceID:String,completionHandler:(JSON) -> Void){
        let parameters = [
            "data": [
                "code":verifyCode,
                "deviceId":deviceID,
                "deviceType": "ios"
            ]
        ]
        Alamofire.request(.POST, config.Http + UrlAPICheckPhoneNumber.CheckVerifyCode.rawValue , parameters: parameters).responseJSON{
            request, response, result in
            switch result {
            case .Success(let JSONData):
                completionHandler(JSON(JSONData) )
                
            case .Failure(let data, let error):
                print("Request failed with error: \(error)")
                
                if let data = data {
                    print("Response data: \(NSString(data: data, encoding: NSUTF8StringEncoding)!)")
                }
            }

            
        }
    }
    func getInformationPatientByUUID(UUID:String,completionHandler:(JSON) -> Void){
        print("UID GET:\(UUID)")
        let parameters = [
            "data": [
                "uid" : UUID
            ]
        ]
        Alamofire.request(.POST, config.Http + UrlInformationPatient.getInformationPatientByUID.rawValue , parameters: parameters).responseJSON{
            request, response, result in
            switch result {
            case .Success(let JSONData):
                print("JSON Data---:\(JSON(JSONData))")
                
            case .Failure(let data, let error):
                print("Request failed with error: \(error)")
                print("data:\(String(error))")
                if let data = data {
                    print("Response data: \(NSString(data: data, encoding: NSUTF8StringEncoding)!)")
                }
            }

        }
     
        
 
    }
    
}


