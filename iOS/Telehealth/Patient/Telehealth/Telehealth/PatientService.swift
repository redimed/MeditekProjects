//
//  Patient.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 10/27/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import Foundation
import SwiftyJSON

class PatientService{
    let patientAPI = PatientAPI()
    let appointmentAPI = AppointmentAPI()
    
    func getInformationPatientByUUID(UUID:String,completionHandler:(JSON,PatientContainer?) -> Void){
        
        patientAPI.getInformationPatientByUUID(UUID){
            response in
            print(response)
            let jsonInformation = response["data"][0] != nil ? response["data"][0] : ""
            if response["TimeOut"] == "Request Time Out" {
                let errorJSON = JSON(["message":"error","ErrorType":response["TimeOut"]])
                completionHandler(errorJSON,PatientContainer.init())
            }else {
                let MiddleName = jsonInformation["MiddleName"].string ?? ""
                let Address2 = jsonInformation["Address2"].string ?? ""
                let Title = jsonInformation["Title"].string ?? ""
                let WorkPhoneNumber = jsonInformation["WorkPhoneNumber"].string ?? ""
                let Enable =  jsonInformation["Enable"].string ?? ""
                let PhoneNumber = jsonInformation["PhoneNumber"].string ?? ""
                let Occupation = jsonInformation["Occupation"].string ?? ""
                let LastName = jsonInformation["LastName"].string ?? ""
                let Postcode = jsonInformation["Postcode"].string ?? ""
                let UID = jsonInformation["UID"].string ?? ""
                let UserAccountID = jsonInformation["UserAccountID"].string ?? ""
                let Gender = jsonInformation["Gender"].string ?? ""
                let FirstName = jsonInformation["FirstName"].string ?? ""
                let State = jsonInformation["State"].string ?? ""
                let ModifiedDate = jsonInformation["ModifiedDate"].string ?? ""
                let Email1 = jsonInformation["Email"].string ?? ""
                let Country = jsonInformation["CountryName"].string ?? ""
                let ID = jsonInformation["ID"].string ?? ""
                let Address1 = jsonInformation["Address1"].string ?? ""
                let CountryID = jsonInformation["CountryID"].string ?? ""
                let DOB = jsonInformation["DOB"].string ?? ""
                let Suburb = jsonInformation["Suburb"].string ?? ""
                let HomePhoneNumber = jsonInformation["HomePhoneNumber"].string ?? ""
                let ImageUID = jsonInformation["FileUID"].string ?? ""
                let patientData  = PatientContainer(MiddleName: MiddleName, Address2: Address2, Title: Title, WorkPhoneNumber: WorkPhoneNumber, Enable: Enable, PhoneNumber: PhoneNumber, Occupation: Occupation, LastName: LastName, Postcode: Postcode, UID: UID, UserAccountID: UserAccountID, Gender: Gender, FirstName: FirstName, State: State, ModifiedDate: ModifiedDate, Email1: Email1, Country: Country, ID: ID, Address1: Address1, CountryID: CountryID, DOB: DOB, Suburb: Suburb, HomePhoneNumber: HomePhoneNumber, ImageUID: ImageUID)
                let message = JSON(["message":"success"])
                completionHandler(message,patientData)
                
            }
        }
        
    }
    
    func getImage(ImageUID:String,completionHandler:(UIImage) -> Void) {
        
        appointmentAPI.getImage(ImageUID, completionHandler: {
            image in
            if  let images = UIImage(data: image) {
                completionHandler(images)
            }else {
                completionHandler(UIImage(named: "A1a Copy 2.png")!)
            }
        })
        
    }
    
    func updateInfomationPatient(infoPatient:PatientContainer, completionHandler:(JSON) -> Void){
        let parameters = [
            "data": [
                "UID" : infoPatient.UID,
                "FirstName" : infoPatient.FirstName,
                "LastName" : infoPatient.LastName,
                "HomePhoneNumber" : infoPatient.HomePhoneNumber,
                "DOB" : infoPatient.DOB,
                "Email1" : infoPatient.Email1,
                "Address1" : infoPatient.Address1,
                "Suburb" : infoPatient.Suburb,
                "Postcode" : infoPatient.Postcode,
                "Country" : infoPatient.Country
            ]
        ]
        print(parameters)
        patientAPI.updateInfomationPatient(parameters, completionHandler: {
            response in
            
            completionHandler(response)
        })
        
    }
    
    func logOut(){
        let defaults = NSUserDefaults.standardUserDefaults()
        defaults.removeObjectForKey("verifyUser")
        defaults.removeObjectForKey("uid")
        defaults.removeObjectForKey("token")
        defaults.removeObjectForKey("patientUID")
        defaults.removeObjectForKey("userUID")
        defaults.removeObjectForKey("refreshCode")
        defaults.synchronize()
        sharedSocket.socket.disconnect()
    }
    
    
    
    
}