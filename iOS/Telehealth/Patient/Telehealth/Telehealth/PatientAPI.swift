//
//  PatientAPI.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 1/13/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import Foundation
import Alamofire
import SwiftyJSON
class PatientAPI:TokenAPI {
    //Giap: Get information Patient by UID
    func getInformationPatientByUUID(UUID:String,completionHandler:(JSON) -> Void){
        config.setHeader()
        Alamofire.request(.GET, ConfigurationSystem.Http_3009 + UrlInformationPatient.getInformationPatientByUID + UUID,headers:config.headers).responseJSON{
            request, response, result in
            if let requireupdatetoken = response?.allHeaderFields["requireupdatetoken"] {
                if requireupdatetoken as! String == "true" {
                    print("Update token",requireupdatetoken)
                    self.getNewToken()
                }
            }
            switch result {
            case .Success(let JSONData):
                let data = JSON(JSONData)
                completionHandler(data)
            case .Failure(let data, let error):
                print("Request failed with error: \(error)")
                completionHandler(JSON(["TimeOut":ErrorMessage.TimeOut]))
                if let data = data {
                    print("Response data: \(NSString(data: data, encoding: NSUTF8StringEncoding)!)")
                }
            }
        }
    }

}