//
//  TelehealthAPI.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 1/20/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import Foundation
import SwiftyJSON
import Alamofire

class TelehealthAPI : TokenAPI{
    //Get appointment Details
    func requestTelehealth(RequestDate:String,Type:String,Description:String,FirstName:String,LastName:String,PhoneNumber:String,HomePhoneNumber:String,Suburd:String,DOB:String,Email:String,FileUploads:[[String:String]], compailer:(JSON) -> Void){
        config.setHeader()
        
        //print(FileUploads)
        let parameter : [String:AnyObject] = [
            "data": [
                "RequestDate" : RequestDate,
                "Type" : Type,
                "Description": Description,
                "PatientAppointment" :
                    [
                        "FirstName" : FirstName,
                        "LastName" : LastName,
                        "PhoneNumber" : PhoneNumber,
                        "HomePhoneNumber" : HomePhoneNumber,
                        "Suburb" : Suburd,
                        "DOB" : DOB,
                        "Email" : Email
                ],
                "AppointmentData": [[
                    "Section": "Telehealth",
                    "Category": "Appointment",
                    "Type": "RequestPatient",
                    "Name": "PatientConsent1",
                    "Value": "Y"
                    ],[
                        "Section": "Telehealth",
                        "Category": "Appointment",
                        "Type": "RequestPatient",
                        "Name": "PatientConsent2",
                        "Value": "Y"
                    ],[
                        "Section": "Telehealth",
                        "Category": "Appointment",
                        "Type": "RequestPatient",
                        "Name": "PatientConsent3",
                        "Value": "Y"
                    ]],
                "FileUploads": FileUploads
            ]
        ]
        //print(parameter)
        
        Alamofire.request(.POST, ConfigurationSystem.Http_3009 + UrlTelehealth.requestTelehealth ,headers:config.headers,parameters:parameter,encoding: .JSON).responseJSON{
            response in
            switch response.result {
            case .Success(let JSONData):
                if let requireupdatetoken = response.response?.allHeaderFields["requireupdatetoken"] {
                    if requireupdatetoken as! String == "true" {
                        print("Update Token",requireupdatetoken)
                        self.getNewToken()
                    }
                }
                let data : JSON = JSON(JSONData)
               // print("---data---",data)
                compailer(data)
            case .Failure(let error):
                print("Request failed with error: \(error)")
                compailer(JSON(["status":"error","ErrorType":ErrorMessage.TimeOut]))
            }
        }
    }
}