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

    
    let headers = [
        "Authorization": "Bearer \(tokens)",
        "Content-Type": "application/x-www-form-urlencoded",
        "Version" : "1.0",
        "CoreAuth": "Bearer \(coreTokens)"
    ]
    let header_3005 = [
        "Authorization": "Bearer \(coreTokens)",
        "Content-Type": "application/x-www-form-urlencoded",
        "Version" : "1.0"
    ]

    
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
        Alamofire.request(.POST, ConfigurationSystem.Http_3009 + UrlAPICheckPhoneNumber.SendVerifyCodePhoneNumber ,headers:headers, parameters: parameters).responseJSON{
            request, response, result  in
            switch result {
            case .Success(let JSONData):
                
                completionHandler(JSON(JSONData) )
                
            case .Failure(let data, let error):
                print("Request failed with error: \(error)")
                completionHandler(JSON(["TimeOut":ErrorMessage.TimeOut]))
                if let data = data {
                    print("Response data: \(NSString(data: data, encoding: NSUTF8StringEncoding)!)")
                }
            }
        }
        
    }
    //Giap: Check verify code
    func CheckVerifyPhoneNumber (verifyCode:String,deviceID:String,var phoneNumber:String,completionHandler:(JSON) -> Void){
        
        phoneNumber.removeAtIndex(phoneNumber.startIndex)
        let parameters = [
            "data": [
                "code":verifyCode,
                "deviceId":deviceID,
                "deviceType": "ios",
//                "Phone":"+61" + phoneNumber
                "phone":"+841654901590"
            ]
        ]
        Alamofire.request(.POST, ConfigurationSystem.Http_3009 + UrlAPICheckPhoneNumber.CheckVerifyCode ,headers:headers, parameters: parameters).responseJSON{
            request, response, result in
            switch result {
            case .Success(let JSONData):
                completionHandler(JSON(JSONData) )
                
            case .Failure(let data, let error):
                print("Request failed with error: \(error)")
                completionHandler(JSON(["TimeOut":ErrorMessage.TimeOut]))
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
        Alamofire.request(.POST, ConfigurationSystem.Http_3009 + UrlInformationPatient.getInformationPatientByUID ,headers:headers,parameters: parameters).responseJSON{
            request, response, result in
            switch result {
            case .Success(let JSONData):
                var data = JSON(JSONData)
                print(data)
                let jsonInformation = data["data"][0] != nil ? data["data"][0] : ""
                if jsonInformation == "" {
                    completionHandler(JSON(["message":"error"]))
                }else {
                
                    let MiddleName = jsonInformation["MiddleName"].string ?? ""
                    let Address2 = jsonInformation["Address2"].string ?? ""
                    let Title = jsonInformation["Title"].string ?? ""
                    let WorkPhoneNumber = jsonInformation["WorkPhoneNumber"].string ?? ""
                    let Enable =  jsonInformation["Enable"].string ?? ""
                    let PhoneNumber = jsonInformation["UserAccount"]["PhoneNumber"].string ?? ""
                    let Occupation = jsonInformation["Occupation"].string ?? ""
                    let LastName = jsonInformation["LastName"].string ?? ""
                    let Postcode = jsonInformation["Postcode"].string ?? ""
                    let UID = jsonInformation["UID"].string ?? ""
                    let UserAccountID = jsonInformation["UserAccountID"].string ?? ""
                    let Gender = jsonInformation["Gender"].string ?? ""
                    let FirstName = jsonInformation["FirstName"].string ?? ""
                    let State = jsonInformation["State"].string ?? ""
                    let ModifiedDate = jsonInformation["ModifiedDate"].string ?? ""
                    let Email = jsonInformation["Email"].string ?? ""
                    let Country = jsonInformation["Country"]["ShortName"].string ?? ""
                    let ID = jsonInformation["ID"].string ?? ""
                    let Address1 = jsonInformation["Address1"].string ?? ""
                    let CountryID = jsonInformation["CountryID"].string ?? ""
                    let DOB = jsonInformation["DOB"].string ?? ""
                    let Suburb = jsonInformation["Suburb"].string ?? ""
                    let HomePhoneNumber = jsonInformation["HomePhoneNumber"].string ?? ""
                    PatientInfo = Patient(MiddleName: MiddleName, Address2: Address2, Title: Title, WorkPhoneNumber: WorkPhoneNumber, Enable: Enable, PhoneNumber: PhoneNumber, Occupation: Occupation, LastName: LastName, Postcode: Postcode, UID: UID, UserAccountID: UserAccountID, Gender: Gender  , FirstName: FirstName, State: State, ModifiedDate: ModifiedDate, Email: Email, Country: Country, ID: ID, Address1: Address1, CountryID: CountryID, DOB: DOB, Suburb: Suburb, HomePhoneNumber: HomePhoneNumber)
                    completionHandler(JSON(["message":"success"]))
                }
                
            case .Failure(let data, let error):
                print("Request failed with error: \(error)")
                completionHandler(JSON(["TimeOut":ErrorMessage.TimeOut]))
                
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
        Alamofire.request(.POST, ConfigurationSystem.Http_3009 + UrlInformationPatient.getAppointmentList ,headers:headers, parameters: parameters).responseJSON{
            request, response, result in
            switch result {
            case .Success(let JSONData):
                    
                completionHandler(JSON(JSONData))
            case .Failure(let data, let error):
                print("Request failed with error: \(error)")
                completionHandler(JSON(["TimeOut":ErrorMessage.TimeOut]))
                
                if let data = data {
                    print("Response data: \(NSString(data: data, encoding: NSUTF8StringEncoding)!)")
                }
            }
            
        }
        
    }
    //GIap:Upload Image
    func uploadImage(image:UIImage,userUID:String,completionHandler:(JSON) -> Void)
    {
        let imageData = UIImagePNGRepresentation(image)
       
        let fileType = "MedicalImage"
        Alamofire.upload(
            .POST,
           ConfigurationSystem.Http_3005 + UrlInformationPatient.uploadImage,headers:header_3005,
            multipartFormData: { multipartFormData in
                
                multipartFormData.appendBodyPart(
                    data: fileType.dataUsingEncoding(NSUTF8StringEncoding)!,
                    name: "fileType"
                )
                multipartFormData.appendBodyPart(
                    data: userUID.dataUsingEncoding(NSUTF8StringEncoding)!,
                    name: "userUID"
                )
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
                        completionHandler(JSON(response.2.value!) )
                    }
                case .Failure(let encodingError):
                    print(encodingError)
                }
            }
        )
        
    }
    
    //update Image to Appointment
    func updateImageToAppointment(fileUID:String,apptID:String,completionHandler:(JSON) -> Void){
        let parameters = [
            "data": [
                "fileUID" : fileUID,
                "apptUID":apptID
            ]
        ]
        Alamofire.request(.POST, ConfigurationSystem.Http_3009 + UrlInformationPatient.updateImageToAppointment,headers:headers, parameters: parameters).responseJSON{
            request, response, result in
            switch result {
            case .Success(let JSONData):
                    completionHandler(JSON(JSONData))
            case .Failure(let data, let error):
                print("Request failed with error: \(error)")
                completionHandler(JSON(["TimeOut":ErrorMessage.TimeOut]))
                if let data = data {
                    print("Response data: \(NSString(data: data, encoding: NSUTF8StringEncoding)!)")
                }
            }
            
        }

    }
    //Get appointment Details
    func getAppointmentDetails(appointmentUID:String,completionHandler:(JSON) -> Void){
        let parameters = [
            "data": [
                "uid" : appointmentUID
            ]
        ]
        Alamofire.request(.POST, ConfigurationSystem.Http_3009 + UrlInformationPatient.getAppointmentDetails,headers:headers, parameters: parameters).responseJSON{
            request, response, result in
            switch result {
            case .Success(let JSONData):
                 var data = JSON(JSONData)
                 let jsonImage = data["data"]["FileUploads"] != nil ? data["data"]["FileUploads"] : ""
                 if jsonImage == "" {
                    completionHandler(JSON(["message":"error"]))
                 }else {
                    completionHandler(jsonImage)
                }
                

            case .Failure(let data, let error):
                print("Request failed with error: \(error)")
                completionHandler(JSON(["TimeOut":ErrorMessage.TimeOut]))
                
                if let data = data {
                    print("Response data: \(NSString(data: data, encoding: NSUTF8StringEncoding)!)")
                }
            }
            
        }
        
    }
    
    //get image by image UID
    func getImageAppointment(imageUID:String,completionHandler:(NSData) -> Void){
        Alamofire.request(.GET,  ConfigurationSystem.Http_3005 + UrlInformationPatient.downloadImage+"/\(imageUID)", headers:header_3005)
            .responseData { response in
                switch response.2 {
                case.Success(let imageData):
                    
                    completionHandler(imageData)
                case.Failure(let data, let error) :
                    print("Request failed with error: \(error)")
                    if let data = data {
                        print("Response data: \(NSString(data: data, encoding: NSUTF8StringEncoding)!)")
                    }
                }

        }

    }
    
    
    
}


