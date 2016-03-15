//
//  AppointmentAPI.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 1/13/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import Foundation
import SwiftyJSON
import Alamofire
class AppointmentAPI:TokenAPI {
    //Giap: Get List Appointment
    func getListAppointmentByUID(UID:String,Limit:String,Offset:String,completionHandler:(JSON) -> Void) {
        config.setHeader()
        
        let parameter =  [
            "data": [
                "Offset": Offset,
                "Order": [[
                    "Appointment": [
                        "CreatedDate": "DESC"
                    ]
                    ]],
                "Limit": Limit,
                "Filter": [
                    [
                        "Appointment": [
                            "Enable": "Y"
                        ]
                    ],
                    [
                        "Patient": [
                            "UID": UID
                        ]
                    ],
                    ["TelehealthAppointment": [
                        "Type": ""
                        ]
                    ]
                ]
            ]
        ]
        

        Alamofire.request(.POST, ConfigurationSystem.Http_3009 + UrlInformationPatient.getAppointmentList,headers:config.headers, parameters:parameter,encoding: .JSON).responseJSON{
            response in
            switch response.result {
            case .Success(let JSONData):
                if let requireupdatetoken = response.response?.allHeaderFields["requireupdatetoken"] {
                    if requireupdatetoken as! String == "true" {
                        print("Update token",requireupdatetoken)
                        self.getNewToken()
                    }
                }
                        
                completionHandler(JSON(JSONData))
            case .Failure(let error):
                print("Request failed with error: \(error)")
                completionHandler(JSON(["TimeOut":ErrorMessage.TimeOut]))
                
            }
            
        }
        
    }
    //
    func uploadImageNotLogin(image:UIImage,userUID:String,fileType:String = "MedicalImage",completionHandler:(JSON) -> Void)
    {
        config.invalidSertificate()
        print(fileType)
        print(userUID)
        
        config.setHeader()
        config.headers["fileType"] = fileType
        config.headers["useruid"] = userUID
        print(config.headers)
        let imageData = UIImageJPEGRepresentation(image,1.0)
        
        
        Alamofire.upload(
            .POST,
            ConfigurationSystem.Http_3005 + UrlInformationPatient.uploadImageNotLogin,headers:config.headers,
            multipartFormData: { multipartFormData in
                
                multipartFormData.appendBodyPart(data: fileType.dataUsingEncoding(NSUTF8StringEncoding, allowLossyConversion: false)!, name: "fileType")
                multipartFormData.appendBodyPart(data: userUID.dataUsingEncoding(NSUTF8StringEncoding, allowLossyConversion: false)!, name: "userUID")
                
                multipartFormData.appendBodyPart(
                    data: imageData!,
                    name: "uploadFile",
                    fileName: "SignatureImage_\(image.hash).png",
                    mimeType: "image/png"
                )
                
            },
            encodingCompletion: { encodingResult in
                switch encodingResult {
                case .Success(let upload, _, _):
                    upload.responseJSON { response in
                        if let requireupdatetoken = response.response!.allHeaderFields["requireupdatetoken"] {
                            if requireupdatetoken as! String == "true" {
                                print("Update token",requireupdatetoken)
                            }
                        }
                        if (response.response?.statusCode)!  == 200 {
                            completionHandler(JSON(response.result.value!))
                            print("result:",response.result.value)
                        }else {
                            print("result:",response.result.debugDescription)
                        }
                    }
                case .Failure(let encodingError):
                    print("error11",encodingError)
                }
            }
        )
        
    }

    
    //GIap:Upload Image
    func uploadImage(image:UIImage,userUID:String,fileType:String = "MedicalImage",completionHandler:(JSON) -> Void)
    {
        config.invalidSertificate()
        print(fileType)
        print(userUID)
        
        config.setHeader()
        config.headers["fileType"] = fileType
        config.headers["useruid"] = userUID
        print(config.headers)
        let imageData = UIImageJPEGRepresentation(image,1.0)
    
        
        Alamofire.upload(
            .POST,
            ConfigurationSystem.Http_3005 + UrlInformationPatient.uploadImage,headers:config.headers,
            multipartFormData: { multipartFormData in
                
                multipartFormData.appendBodyPart(data: fileType.dataUsingEncoding(NSUTF8StringEncoding, allowLossyConversion: false)!, name: "fileType")
                multipartFormData.appendBodyPart(data: userUID.dataUsingEncoding(NSUTF8StringEncoding, allowLossyConversion: false)!, name: "userUID")
                
                multipartFormData.appendBodyPart(
                    data: imageData!,
                    name: "uploadFile",
                    fileName: "AppointmentImg_\(image.hash).png",
                    mimeType: "image/png"
                )
         
            },
            encodingCompletion: { encodingResult in
                switch encodingResult {
                case .Success(let upload, _, _):
                    upload.responseJSON { response in
                        if let requireupdatetoken = response.response!.allHeaderFields["requireupdatetoken"] {
                            if requireupdatetoken as! String == "true" {
                                print("Update token",requireupdatetoken)
                                self.getNewToken()
                            }
                        }
                        if (response.response?.statusCode)!  == 200 {
                            completionHandler(JSON(response.result.value!))
                            print("result:",response.result.value)
                        }else {
                            print("result:",response.result.debugDescription)
                        }
                    }
                case .Failure(let encodingError):
                    print("error11",encodingError)
                }
            }
        )
        
    }
    
    //update Image to Appointment
    func updateImageToAppointment(fileUID:String,apptID:String,completionHandler:(JSON) -> Void){
        config.setHeader()
        let parameters = [
            "data": [
                "fileUID" : fileUID,
                "apptUID":apptID
            ]
        ]
        Alamofire.request(.POST, ConfigurationSystem.Http_3009 + UrlInformationPatient.updateImageToAppointment,headers:config.headers, parameters: parameters,encoding: .JSON).responseJSON{
            response in
            
            
            switch response.result {
            case .Success(let JSONData):
                if let requireupdatetoken = response.response?.allHeaderFields["requireupdatetoken"] {
                    if requireupdatetoken as! String == "true" {
                        print("Update token",requireupdatetoken)
                        self.getNewToken()
                    }
                }
                print("Update Image data",JSON(JSONData))
                completionHandler(JSON(JSONData))
            case .Failure(let error):
                print("Request failed with error: \(error)")
                completionHandler(JSON(["TimeOut":ErrorMessage.TimeOut]))
                
            }
        }
    }
    //Get appointment Details
    func getAppointmentDetails(appointmentUID:String,type:String,completionHandler:(JSON) -> Void){
        config.setHeader()
        Alamofire.request(.GET, ConfigurationSystem.Http_3009 + UrlInformationPatient.getWAADetails + appointmentUID,headers:config.headers).responseJSON{
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
                completionHandler(data)
            case .Failure( let error):
                print("Request failed with error: \(error)")
                completionHandler(JSON(["TimeOut":ErrorMessage.TimeOut]))
                
            }
        }
    }
    
    //get image by image UID
    func getImage(imageUID:String,completionHandler:(NSData) -> Void){
        config.setHeader()
        Alamofire.request(.GET,  ConfigurationSystem.Http_3005 + UrlInformationPatient.downloadImage+"/\(imageUID)", headers:config.headers)
            .responseData { response in
                
                
                switch response.result {
                case.Success(let imageData):
                    if let requireupdatetoken = response.response?.allHeaderFields["requireupdatetoken"] {
                        
                        if requireupdatetoken as! String == "true" {
                            print("Update token",requireupdatetoken)
                            self.getNewToken()
                        }
                    }
                    completionHandler(imageData)
                case.Failure(let error) :
                    print("Request failed with error: \(error)")
                }
        }
        
    }
}