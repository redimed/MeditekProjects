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
                //  "phone":"+61"+phoneNumber,
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
        let parameters = [
            "data": [
                "uid" : UUID
            ]
        ]
        Alamofire.request(.POST, ConfigurationSystem.Http + UrlInformationPatient.getInformationPatientByUID ,headers:config.headers, parameters: parameters).responseJSON{
            request, response, result in
            switch result {
            case .Success(let JSONData):
                var data = JSON(JSONData)
                let jsonInformation = data["data"][0]
                let MiddleName = jsonInformation["MiddleName"].string != nil ? jsonInformation["MiddleName"].string : ""
                let Address2 = jsonInformation["Address2"].string != nil ? jsonInformation["Address2"].string : ""
                let Title = jsonInformation["Title"].string != nil ? jsonInformation["Title"].string : ""
                let WorkPhoneNumber = jsonInformation["WorkPhoneNumber"].string != nil ? jsonInformation["WorkPhoneNumber"].string : ""
                let Enable =  jsonInformation["Enable"].string != nil ? jsonInformation["Enable"].string : ""
                let PhoneNumber = jsonInformation["UserAccount"]["PhoneNumber"].string != nil ? jsonInformation["UserAccount"]["PhoneNumber"].string : ""
                let Occupation = jsonInformation["Occupation"].string != nil ? jsonInformation["Occupation"].string : ""
                let LastName = jsonInformation["LastName"].string != nil ? jsonInformation["LastName"].string : ""
                let Postcode = jsonInformation["Postcode"].string != nil ? jsonInformation["Postcode"].string : ""
                let UID = jsonInformation["UID"].string != nil ? jsonInformation["UID"].string : ""
                let UserAccountID = jsonInformation["UserAccountID"].string != nil ? jsonInformation["UserAccountID"].string : ""
                let Gender = jsonInformation["Gender"].string != nil ? jsonInformation["Gender"].string : ""
                let FirstName = jsonInformation["FirstName"].string != nil ? jsonInformation["FirstName"].string : ""
                let State = jsonInformation["State"].string != nil ? jsonInformation["State"].string : ""
                let ModifiedDate = jsonInformation["ModifiedDate"].string != nil ? jsonInformation["ModifiedDate"].string : ""
                let Email = jsonInformation["Email"].string != nil ? jsonInformation["Email"].string : ""
                let Country = jsonInformation["Country"]["ShortName"].string != nil ? jsonInformation["Country"]["ShortName"].string : ""
                let ID = jsonInformation["ID"].string != nil ? jsonInformation["ID"].string : ""
                let Address1 = jsonInformation["Address1"].string != nil ? jsonInformation["Address1"].string : ""
                let CountryID = jsonInformation["CountryID"].string != nil ? jsonInformation["CountryID"].string : ""
                let DOB = jsonInformation["DOB"].string != nil ? jsonInformation["DOB"].string : ""
                let Suburb = jsonInformation["Suburb"].string != nil ? jsonInformation["Suburb"].string : ""
                let HomePhoneNumber = jsonInformation["HomePhoneNumber"].string != nil ? jsonInformation["HomePhoneNumber"].string : ""
                PatientInfo = Patient(MiddleName: MiddleName!, Address2: Address2!, Title: Title!, WorkPhoneNumber: WorkPhoneNumber!, Enable: Enable!, PhoneNumber: PhoneNumber!, Occupation: Occupation!, LastName: LastName!, Postcode: Postcode!, UID: UID!, UserAccountID: UserAccountID!, Gender: Gender!  , FirstName: FirstName!, State: State!, ModifiedDate: ModifiedDate!, Email: Email!, Country: Country!, ID: ID!, Address1: Address1!, CountryID: CountryID!, DOB: DOB!, Suburb: Suburb!, HomePhoneNumber: HomePhoneNumber!)
                completionHandler(JSON(["message":"success"]))
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
    func uploadImage(image:UIImage,userUID:String)
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
                    data: userUID.dataUsingEncoding(NSUTF8StringEncoding,allowLossyConversion: false)!,
                    name: "userUID"
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


