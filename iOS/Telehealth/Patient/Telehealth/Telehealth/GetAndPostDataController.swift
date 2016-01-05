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
    
    
    var headers = [
        "Authorization": "Bearer \(tokens)",
        "Version" : "1.0",
        "systemtype": "IOS",
        "deviceId" : "",
        "useruid":"\(userUID ?? "")",
        "Cookie": cookies as String,
        "appid":UIApplication.sharedApplication().bundleID()
    ]
    
    func setHeader(){
        if let token = defaults.valueForKey("token") as? String {
            headers["Authorization"] =  "Bearer \(token)"
        }
        if let userUIDs = defaults.valueForKey("userUID") as? String{
            headers["useruid"] = "\(userUIDs ?? "")"
        }
        if let cookie = defaults.valueForKey("Set-Cookie") as? String{
            
            headers["Cookie"] = cookie as String
        }
        if let deviceId = defaults.valueForKey("deviceID") as? String{
            
            headers["deviceId"] = deviceId as String
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
    //Giap: Check phone number and send verify code
    func SendVerifyPhoneNumber (var phoneNumber:String,completionHandler:(JSON) -> Void){
        setHeader()
        //Split number 0
        phoneNumber.removeAtIndex(phoneNumber.startIndex)
        let parameters = [
            "data": [
//                              "phone":"+61"+phoneNumber,
                "phone":"+84908618694",
                "deviceType": "ios"
            ]
        ]
        Alamofire.request(.POST, ConfigurationSystem.Http_3009 + UrlAPICheckPhoneNumber.SendVerifyCodePhoneNumber ,headers:headers, parameters: parameters).responseJSON{
            request, response, result  in
            if let cookie : String = response?.allHeaderFields["Set-Cookie"] as? String  {
                let defaults = NSUserDefaults.standardUserDefaults()
                defaults.setValue(cookie, forKey: "Set-Cookie")
                defaults.synchronize()
            }
            switch result {
            case .Success(let JSONData):
                print(JSONData)
                completionHandler(JSON(JSONData))
            case .Failure(let data, let error):
                print("Request failed with error: \(error)")
                completionHandler(JSON(["TimeOut":ErrorMessage.TimeOut]))
                if let  data = data {
                    print("Response data: \(NSString(data: data, encoding: NSUTF8StringEncoding)!)")
                }
            }
        }
        
    }
    
    //Giap: Check verify code
    func CheckVerifyPhoneNumber (verifyCode:String,var phoneNumber:String,completionHandler:(JSON) -> Void){
        setHeader()
        phoneNumber.removeAtIndex(phoneNumber.startIndex)
        let parameters = [
            "data": [
                "code":verifyCode,
                "deviceType": "ios",
//                 "Phone":"+61" + phoneNumber
                "phone":"+84908618694"
            ]
        ]
        
        Alamofire.request(.POST, ConfigurationSystem.Http_3009 + UrlAPICheckPhoneNumber.CheckVerifyCode ,headers:headers, parameters: parameters).responseJSON{
            request, response, result in
            
            switch result {
            case .Success(let JSONData):
                
                var data = JSON(JSONData)
                if data["ErrorType"] == nil {
                    let verifyCode = data["verifyCode"].string! as String
                    let patientUID = data["patientUID"].string!   as String
                    let userUID = data["userUID"].string!  as String
                    self.loginApi(userUID: userUID, patientUID: patientUID, verifyCode: verifyCode){
                        dataResponse in
                        completionHandler(dataResponse)
                    }
                    
                }else {
                    completionHandler(data)
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
    
    func loginApi(userUID userUID:String,patientUID:String,verifyCode:String,completionHandler:(JSON) -> Void){
        setHeader()
        let deviceId = defaults.valueForKey("deviceID") as? String
        
        let parameters = [
            "UserName":"1",
            "Password":"2",
            "UserUID": userUID,
            "DeviceID":deviceId! as String,
            "VerificationToken":verifyCode,
            "AppID":UIApplication.sharedApplication().bundleID()
        ]
        
        Alamofire.request(.POST, ConfigurationSystem.Http_3006 + UrlAPICheckPhoneNumber.apiLogin ,headers:headers, parameters: parameters).responseJSON{
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
                print(data)
                self.informationUser(data,patientUID: patientUID){
                    dataResponse in
                    completionHandler(dataResponse)
                }
            case .Failure(let data, let error):
                completionHandler(JSON(data!))
                print("Request failed with error: \(error)")
                if let data = data {
                    print("Response data: \(NSString(data: data, encoding: NSUTF8StringEncoding)!)")
                }
            }
        }
        
    }
    
    func logOut(completionHandler:(JSON)-> Void){
         setHeader()
        Alamofire.request(.GET, ConfigurationSystem.Http_3006 + UrlInformationPatient.logOut ,headers:headers).responseJSON{
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
                completionHandler(JSON(data!))
                print("Request failed with error: \(error)")
                if let data = data {
                    print("Response data: \(NSString(data: data, encoding: NSUTF8StringEncoding)!)")
                }
            }
        }
    }
    
    
    
    func informationUser(data:JSON,patientUID:String ,completionHandler:(JSON) -> Void){
        setHeader()
        let uid = data["user"]["UID"].string! as String
        let token = data["token"].string! as String
        let refreshCode = data["refreshCode"].string! as String
        headers["Authorization"] = "Bearer \(token)"
        
        Alamofire.request(.GET, ConfigurationSystem.Http_3009 + UrlInformationPatient.getUserInfo + uid ,headers:headers).responseJSON{
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
                let userInfo = [
                    "patientUID":patientUID,
                    "token":token,
                    "refreshCode":refreshCode,
                    "userUID":uid,
                    "teleUID":data["UID"].string! as String,
                    "status":"success"
                ]
                completionHandler(JSON(userInfo))
            case .Failure(let data, let error):
                completionHandler(JSON(data!))
                print("Request failed with error: \(error)")
                if let data = data {
                    print("Response data: \(NSString(data: data, encoding: NSUTF8StringEncoding)!)")
                }
            }
        }
        
    }
    
    
    
    //Giap: Get information Patient by UID
    func getInformationPatientByUUID(UUID:String,completionHandler:(JSON) -> Void){
        setHeader()
        Alamofire.request(.GET, ConfigurationSystem.Http_3009 + UrlInformationPatient.getInformationPatientByUID + UUID,headers:headers).responseJSON{
            request, response, result in
            if let requireupdatetoken = response?.allHeaderFields["requireupdatetoken"] {
                if requireupdatetoken as! String == "true" {
                    print("Update token",requireupdatetoken)
                    self.getNewToken()
                }
            }
            switch result {
            case .Success(let JSONData):
                
                var data = JSON(JSONData)
                print("---data",data)
                let jsonInformation = data["data"][0] != nil ? data["data"][0] : ""
                if jsonInformation == "" {
                    print("error--",data)
                    completionHandler(JSON(["message":"error","ErrorType":data["ErrorType"]]))
                    
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
                    let Email1 = jsonInformation["Email1"].string ?? ""
                    let Country = jsonInformation["CountryName"].string ?? ""
                    let ID = jsonInformation["ID"].string ?? ""
                    let Address1 = jsonInformation["Address1"].string ?? ""
                    let CountryID = jsonInformation["CountryID"].string ?? ""
                    let DOB = jsonInformation["DOB"].string ?? ""
                    let Suburb = jsonInformation["Suburb"].string ?? ""
                    let HomePhoneNumber = jsonInformation["HomePhoneNumber"].string ?? ""
                    let ImageUID = jsonInformation["FileUID"].string ?? ""
                    
                    self.getImageAppointment(ImageUID, completionHandler: {
                        image in
                        var imageView = UIImage()
                        if  let images = UIImage(data: image) {
                            imageView = images
                        }else {
                            imageView = UIImage(named: "A1a Copy 2.png")!
                        }
                        PatientInfo = Patient(MiddleName: MiddleName, Address2: Address2, Title: Title, WorkPhoneNumber: WorkPhoneNumber, Enable: Enable, PhoneNumber: PhoneNumber, Occupation: Occupation, LastName: LastName, Postcode: Postcode, UID: UID, UserAccountID: UserAccountID, Gender: Gender  , FirstName: FirstName, State: State, ModifiedDate: ModifiedDate, Email1: Email1, Country: Country, ID: ID, Address1: Address1, CountryID: CountryID, DOB: DOB, Suburb: Suburb, HomePhoneNumber: HomePhoneNumber,Image:imageView)
                        completionHandler(JSON(["message":"success"]))
                        
                    })
                    
                    
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
        
        setHeader()
        Alamofire.request(.GET, ConfigurationSystem.Http_3009 + UrlInformationPatient.getAppointmentList + UID ,headers:headers).responseJSON{
            request, response, result in
            if let requireupdatetoken = response?.allHeaderFields["requireupdatetoken"] {
                if requireupdatetoken as! String == "true" {
                    print("Update token",requireupdatetoken)
                    self.getNewToken()
                }
            }
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
        setHeader()
        let imageData = UIImagePNGRepresentation(image)
        let fileType = "MedicalImage"
        Alamofire.upload(
            .POST,
            ConfigurationSystem.Http_3005 + UrlInformationPatient.uploadImage,headers:headers,
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
                        if let requireupdatetoken = response.1!.allHeaderFields["requireupdatetoken"] {
                            if requireupdatetoken as! String == "true" {
                                print("Update token",requireupdatetoken)
                                self.getNewToken()
                            }
                        }
                        completionHandler(JSON(response.2.value!))
                    }
                case .Failure(let encodingError):
                    print("error",encodingError)
                }
            }
        )
        
    }
    
    //update Image to Appointment
    func updateImageToAppointment(fileUID:String,apptID:String,completionHandler:(JSON) -> Void){
        setHeader()
        let parameters = [
            "data": [
                "fileUID" : fileUID,
                "apptUID":apptID
            ]
        ]
        Alamofire.request(.POST, ConfigurationSystem.Http_3009 + UrlInformationPatient.updateImageToAppointment,headers:headers, parameters: parameters).responseJSON{
            request, response, result in
            
            if let requireupdatetoken = response?.allHeaderFields["requireupdatetoken"] {
                if requireupdatetoken as! String == "true" {
                    print("Update token",requireupdatetoken)
                    self.getNewToken()
                }
            }
            switch result {
            case .Success(let JSONData):
                print("Update Image data",JSON(JSONData))
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
    func getAppointmentDetails(appointmentUID:String,type:String,completionHandler:(JSON) -> Void){
        setHeader()
        Alamofire.request(.GET, ConfigurationSystem.Http_3009 + UrlInformationPatient.getWAADetails + appointmentUID,headers:headers).responseJSON{
            request, response, result in
            print("Reponse getAppointmentDetails WAA",response)
            if let requireupdatetoken = response?.allHeaderFields["requireupdatetoken"] {
                if requireupdatetoken as! String == "true" {
                    print("Update Token",requireupdatetoken)
                    self.getNewToken()
                }
            }
            switch result {
            case .Success(let JSONData):
                var data : JSON = JSON(JSONData)
                var ArrayImageUID : [String] = []
                let jsonImage : JSON = data["data"]["FileUploads"] != nil ? data["data"]["FileUploads"] : ""
                let clinicalDetailImage : JSON = data["data"]["TelehealthAppointment"]["ClinicalDetails"]
                let clinicalCount : Int = clinicalDetailImage.count
                let appointmentImageCount : Int = jsonImage.count
                
                //Get uid Image in Clinical
                for var i = 0 ; i < clinicalCount ; ++i{
                    if data["data"]["TelehealthAppointment"]["ClinicalDetails"][i]["FileUploads"].count != 0 {
                        let fileUploadCount = data["data"]["TelehealthAppointment"]["ClinicalDetails"][i]["FileUploads"].count
                        for var j = 0 ; j < fileUploadCount ; ++j{
                            //check Filetype
                            if data["data"]["TelehealthAppointment"]["ClinicalDetails"][i]["FileUploads"][j]["FileType"] == "MedicalImage" {
                                let imageUID = data["data"]["TelehealthAppointment"]["ClinicalDetails"][i]["FileUploads"][j]["UID"].string
                                ArrayImageUID.append(imageUID!)
                            }
                        }
                    }
                }
                
                for var i = 0 ; i < appointmentImageCount ; ++i {
                    if jsonImage[i]["FileType"] == "MedicalImage" {
                        let appointmentImage = jsonImage[i]["UID"].string
                        ArrayImageUID.append(appointmentImage!)
                    }
                }
                
                
                if jsonImage == "" {
                    completionHandler(JSON(["message":"error"]))
                }else {
                    let parseJSON = JSON(ArrayImageUID)
                    completionHandler(parseJSON)
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
        setHeader()
        Alamofire.request(.GET,  ConfigurationSystem.Http_3005 + UrlInformationPatient.downloadImage+"/\(imageUID)", headers:headers)
            .responseData { response in
                if let requireupdatetoken = response.1?.allHeaderFields["requireupdatetoken"] {
                    
                    if requireupdatetoken as! String == "true" {
                        print("Update token",requireupdatetoken)
                        self.getNewToken()
                    }
                }
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
    func getNewToken(){
        if let refreshCode = defaults.valueForKey("refreshCode") as? String{
            let parameters = [
                "refreshCode" : refreshCode
            ]
            setHeader()
            Alamofire.request(.POST,ConfigurationSystem.Http_3006 + UrlInformationPatient.getNewToken, headers:headers, parameters: parameters)
                .responseJSON {
                    request, response, result in
                    switch result {
                    case .Success(let JSONData):
                        let data = JSON(JSONData)
                        
                        if data["refreshCode"].string != nil{
                            if  data["refreshCode"].string! != refreshCode{
                                
                                self.setNewToken(data["token"].string!,refreshCode: data["refreshCode"].string!)
                            }
                        }else {
                            print("----------Error------",data)
                        }
                        
                    case .Failure(let data, let error):
                        print("Request failed with error: \(error)")
                        if let data = data {
                            print("Response data: \(NSString(data: data, encoding: NSUTF8StringEncoding)!)")
                        }
                    }
            }
        }
    }
    func updateTokenPush(uuid:String,deviceToken:String){
//        if let deviceToken = defaults.valueForKey("deviceToken"){
            let parameters = [
                "data" : [
                    "uid":uuid,
                    "token":deviceToken
                ]
            ]
            setHeader()
            
            Alamofire.request(.POST,ConfigurationSystem.Http_3009 + UrlInformationPatient.updateTokenPush, headers:headers, parameters: parameters)
                .responseJSON {
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
                        print("data---",data)
                    case .Failure(let data, let error):
                        print("Request failed with error: \(error)")
                        if let data = data {
                            print("Response data: \(NSString(data: data, encoding: NSUTF8StringEncoding)!)")
                        }
                    }
            }
//        }
    }
    
    func pushNotification(title:String,uid:String,category:String,data:String,completionHandler:(JSON) -> Void){
        setHeader()
        let parameters = [
            "title":title,
            "uid":uid,
            "category":category,
            "data":data
        ]
        Alamofire.request(.POST,ConfigurationSystem.Http_3009 + UrlInformationPatient.pushNotify, headers:headers, parameters: parameters)
            .responseJSON {
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
                    print("data---",data)
                    
                case .Failure(let data, let error):
                    print("Request failed with error: \(error)")
                    if let data = data {
                        print("Response data: \(NSString(data: data, encoding: NSUTF8StringEncoding)!)")
                    }
                }
        }
    }
}


