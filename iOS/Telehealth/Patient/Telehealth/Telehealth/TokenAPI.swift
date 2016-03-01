//
//  TokenAPI.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 1/13/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import Foundation
import Alamofire
import SwiftyJSON
class TokenAPI {
    //Giap: Get information Patient by UID
    func getNewToken(){
        if let refreshCode = defaults.valueForKey("refreshCode") as? String{
            let parameters = [
                "refreshCode" : refreshCode
            ]
            config.setHeader()
            Alamofire.request(.POST,ConfigurationSystem.Http_3006 + UrlInformationPatient.getNewToken, headers:config.headers, parameters: parameters)
                .responseJSON {
                     response in
                    switch response.result {
                    case .Success(let JSONData):
                        let data = JSON(JSONData)
                        if data["refreshCode"].string != nil{
                            if  data["refreshCode"].string! != refreshCode{
                                
                                self.setNewToken(data["token"].string!,refreshCode: data["refreshCode"].string!)
                            }
                        }else {
                            print("----------Error------",data)
                        }
                    case .Failure(let error):
                        print("Request failed with error: \(error)")
                       
                    }
            }
        }
    }
    
    //set new token to local
    func setNewToken(token:String,refreshCode:String){
        let defaults = NSUserDefaults.standardUserDefaults()
        defaults.removeObjectForKey("token")
        defaults.removeObjectForKey("refreshCode")
        defaults.setValue(refreshCode, forKey: "refreshCode")
        defaults.setValue(token, forKey: "token")
        defaults.synchronize()
        tokens = token
    }
    
    
    
    func updateTokenPush(uuid:String,deviceToken:String){
        let parameters = [
            "data" : [
                "uid":uuid,
                "token":deviceToken
            ]
        ]
        config.setHeader()
        Alamofire.request(.POST,ConfigurationSystem.Http_3009 + UrlInformationPatient.updateTokenPush, headers:config.headers, parameters: parameters)
            .responseJSON {
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
                    print("data---",data)
                case .Failure(let error):
                    print("Request failed with error: \(error)")
                
                }
        }
    }
    
    func pushNotification(title:String,uid:String,category:String,data:String,completionHandler:(JSON) -> Void){
        config.setHeader()
        let parameters = [
            "title":title,
            "uid":uid,
            "category":category,
            "data":data
        ]
        Alamofire.request(.POST,ConfigurationSystem.Http_3009 + UrlInformationPatient.pushNotify, headers:config.headers, parameters: parameters)
            .responseJSON {
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
                    print("data---",data)
                    
                case .Failure(let error):
                    print("Request failed with error: \(error)")
                    
                }
        }
    }
}