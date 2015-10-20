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


class GetAndPostDataController {
    
    
    
    //Giap: Check phone number and send verify code
    func SendVerifyPhoneNumber (deviceID:String,var phoneNumber:String,completionHandler:(JSON) -> Void){
        //Split number 0
        phoneNumber.removeAtIndex(phoneNumber.startIndex)
        let parameters = [
            "data": [
//                "phone":"+61"+phoneNumber,
              "phone":"+841654901590",
                "deviceId":deviceID,
                "deviceType": "ios"
            ]
        ]
        Alamofire.request(.POST, ConfigurationSystem.Http + UrlAPICheckPhoneNumber.SendVerifyCodePhoneNumber ,headers:config.headers, parameters: parameters).responseJSON{
            request, response, result  in
            print(response)
            switch result {
            case .Success(let JSONData):
                
                completionHandler(JSON(JSONData) )
                
            case .Failure(let data, let error):
                print("Request failed with error: \(error)")
                completionHandler(JSON(["TimeOut":"Request Time Out"]))
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
        Alamofire.request(.POST, ConfigurationSystem.Http + UrlAPICheckPhoneNumber.CheckVerifyCode ,headers:config.headers, parameters: parameters).responseJSON{
            request, response, result in
            switch result {
            case .Success(let JSONData):
                completionHandler(JSON(JSONData) )
                
            case .Failure(let data, let error):
                print("Request failed with error: \(error)")
                completionHandler(JSON(["TimeOut":"Request Time Out"]))
                if let data = data {
                    print("Response data: \(NSString(data: data, encoding: NSUTF8StringEncoding)!)")
                }
            }
            
            
        }
    }
    //Giap: Get information Patient by UID
    func getInformationPatientByUUID(UUID:String,completionHandler:(JSON) -> Void){
        print("UID GET:\(config.headers)")
        let parameters = [
            "data": [
                "uid" : UUID
            ]
        ]
        Alamofire.request(.POST, ConfigurationSystem.Http + UrlInformationPatient.getInformationPatientByUID ,headers:config.headers, parameters: parameters).responseJSON{
            request, response, result in
            switch result {
            case .Success(let JSONData):
                
                completionHandler(JSON(JSONData))
            case .Failure(let data, let error):
                print("Request failed with error: \(error)")
                completionHandler(JSON(["TimeOut":"Request Time Out"]))
                
                if let data = data {
                    print("Response data: \(NSString(data: data, encoding: NSUTF8StringEncoding)!)")
                }
            }
            
        } 
        
    }
    
    //Giap: Get List Appointment
    func getListAppointmentByUID(UID:String,Limit:String,completionHandler:(JSON) -> Void) {
        let parameters = [
            "data": [
                "uid" : UID,
                "limit":Limit
            ]
        ]
        Alamofire.request(.POST, ConfigurationSystem.Http + UrlInformationPatient.getAppointmentList ,headers:config.headers, parameters: parameters).responseJSON{
            request, response, result in
            switch result {
            case .Success(let JSONData):
                
                completionHandler(JSON(JSONData))
            case .Failure(let data, let error):
                print("Request failed with error: \(error)")
                completionHandler(JSON(["TimeOut":"Request Time Out"]))
                
                if let data = data {
                    print("Response data: \(NSString(data: data, encoding: NSUTF8StringEncoding)!)")
                }
            }
            
        }
        
    }
    //GIap:Upload Image
    func uploadImage(image:UIImage,PatientUID:String)
    {
        let imageData = UIImagePNGRepresentation(image)
        let fileType = "MedicalImage"
        
        Alamofire.upload(
            .POST,
            UrlInformationPatient.uploadImage,
            multipartFormData: { multipartFormData in
                
                multipartFormData.appendBodyPart(
                    data: fileType.dataUsingEncoding(NSUTF8StringEncoding,allowLossyConversion: false)!,
                    name: "fileType"
                )
                multipartFormData.appendBodyPart(
                    data: PatientUID.dataUsingEncoding(NSUTF8StringEncoding,allowLossyConversion: false)!,
                    name: "patientUID"
                )

                multipartFormData.appendBodyPart(
                    data: imageData!,
                    name: "uploadFile",
                    fileName: "testIMG.png",
                    mimeType: "image/png"
                    
                )
            },
            encodingCompletion: { encodingResult in
                print(encodingResult)
                switch encodingResult {
                case .Success(let upload, _, _):
                    upload.responseJSON { response in
                        
                        print(response)
                        
                    }
//                    print(upload)
                case .Failure(let encodingError):
                    print(encodingError)
                }
            }
        )
        
    }
    
}


