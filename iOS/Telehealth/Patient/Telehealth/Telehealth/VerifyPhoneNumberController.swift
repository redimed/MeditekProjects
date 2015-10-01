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
    
    var returnData = String()
    func GetDataAPI (url:String,completionHandler: (JSON) -> Void)  {
         
        Alamofire.request(.GET, url)
            .responseJSON { response in
                completionHandler(JSON(response.2.value!) )

        }
        
    }
    func SendVerifyPhoneNumber (deviceID:String,completionHandler:(JSON) -> Void){
        let parameters = [
            "data": [
                    "phone":"+84988880682",
                    "deviceId":deviceID,
                    "deviceType": "ios"
            ]
        ]
        Alamofire.request(.POST, config.Http + UrlAPICheckPhoneNumber.SendVerifyCodePhoneNumber.rawValue , parameters: parameters).responseJSON{
            response in
            completionHandler(JSON(response.2.value!) )
        }
    }
    func CheckVerifyPhoneNumber (verifyCode:String,deviceID:String,completionHandler:(JSON) -> Void){
        let parameters = [
            "data": [
                "code":verifyCode,
                "deviceId":deviceID,
                "deviceType": "ios"
            ]
        ]
        Alamofire.request(.POST, config.Http + UrlAPICheckPhoneNumber.CheckVerifyCode.rawValue , parameters: parameters).responseJSON{
            response in
            completionHandler(JSON(response.2.value!) )
        }


    }
    
    
    
}
