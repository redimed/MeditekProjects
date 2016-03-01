//
//  Appointment.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 10/27/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import Foundation
import SwiftyJSON
class AppointmentService {
    let api = AppointmentAPI()
    let appointmentContainer = AppointmentContainer()
    
    func getAppointmentByID(UID:String,Limit:String,Offset:String,completionHandler:(JSON,[AppointmentContainer],String) -> Void){
        api.getListAppointmentByUID(UID, Limit: Limit,Offset:Offset ,completionHandler: {
            response in
            var AppointmentArr = [AppointmentContainer]()
            var message : JSON!
            if response["ErrorsList"] != nil {
                message = JSON(["message":"error","ErrorType":response["ErrorType"]])
                completionHandler(message,[AppointmentContainer()],"")
            }else if response["TimeOut"] ==  "Request Time Out" {
                message = JSON(["message":"error","ErrorType":ErrorMessage.TimeOut])
                completionHandler(message,[AppointmentContainer()],"")
            }
            else {
                var UIDApointment : String!
                var FromTime : String!
                var ToTime : String!
                var Status : String!
                var NameDoctor : String!
                var Type:String!
                var refName:String!
                var data = response["rows"]
                let countAppointment = data.count
                var lastName : String!
                var firstName : String!
                let sumPage = response["count"]
                var CreatedDate : String!
                
                for var i = 0 ; i < countAppointment ;i++ {
                    refName = data[i]["TelehealthAppointment"]["RefName"].string ?? ""
                    UIDApointment = data[i]["UID"].string ?? ""
                    FromTime = data[i]["FromTime"].string ?? ""
                    ToTime = data[i]["ToTime"].string ?? ""
                    Status = data[i]["Status"].string ?? ""
                    lastName = data[i]["Doctors"][0]["LastName"].string ?? ""
                    firstName = data[i]["Doctors"][0]["FirstName"].string ?? ""
                    NameDoctor = "\(firstName) \(lastName)"
                    Type = data[0]["TelehealthAppointment"]["Type"].string ?? ""
                    CreatedDate = data[i]["CreatedDate"].string ?? ""
                    let appointment = AppointmentContainer.init(UIDApointment: UIDApointment, ToTime: ToTime, Status: Status, FromTime: FromTime, NameDoctor: NameDoctor, Type: Type, refName: refName,CreatedDate:CreatedDate)
                    
                    AppointmentArr.append(appointment)
                }
                message = JSON(["message":"success"])
                completionHandler(message,AppointmentArr,String(sumPage))
            }
        })
    }
    
    func getAppointmentDetails(UIDAppointment:String,Type:String,compailer:(JSON) -> Void){
        api.getAppointmentDetails(UIDAppointment,type:Type, completionHandler: {
            response in
            if response["TimeOut"] ==  "Request Time Out" {
                let message = JSON(["message":"error","ErrorType":ErrorMessage.TimeOut])
                compailer(message)
            }else {
                let message = JSON(["message":"success","data":response])
                compailer(message)
            }
            
            
        })
        
    }
    func getInformationAppointment(dataAP:JSON)-> AppointmentContainer{
        
        let app = dataAP["data"]["Patients"][0] == nil ? "" : dataAP["data"]["Patients"][0]
        let FirstName = app["FirstName"] == nil ? "" : app["FirstName"].string
        let LastName = app["LastName"] == nil ? "" : app["LastName"].string
        let Suburb = app["Suburb"] == nil ? "" : app["Suburb"].string
        let Email =  app["UserAccount"]["Email"] ? "" : app["UserAccount"]["Email"].string
        let DOB =  app["DOB"] == nil ? "" : app["DOB"].string
        let HomePhoneNumber = app["HomePhoneNumber"] == nil ? "" : app["HomePhoneNumber"].string
        let PhoneNumber = app["UserAccount"]["PhoneNumber"] == nil ? "" : app["UserAccount"]["PhoneNumber"].string
        
        let appointment = AppointmentContainer.init(FirstName: FirstName!, LastName: LastName!, Suburb: Suburb!, HomePhoneNumber: HomePhoneNumber!, PhoneNumber:PhoneNumber!, Email:Email!, DOB:DOB! )
        return appointment
        
    }
    
    func getAllImageInAppointmentDetails(AppointmentDetail:JSON,compailer:([String] -> Void)){
        var ArrayImageUID : [String] = []
        let jsonImage : JSON = AppointmentDetail["data"]["FileUploads"] != nil ? AppointmentDetail["data"]["FileUploads"] : ""
        let clinicalDetailImage : JSON = AppointmentDetail["data"]["TelehealthAppointment"]["ClinicalDetails"]
        let clinicalCount : Int = clinicalDetailImage.count
        let appointmentImageCount : Int = jsonImage.count

        //Get uid Image in Clinical
        for var i = 0 ; i < clinicalCount ; ++i{
            if AppointmentDetail["data"]["TelehealthAppointment"]["ClinicalDetails"][i]["FileUploads"].count != 0 {
                let fileUploadCount = AppointmentDetail["data"]["TelehealthAppointment"]["ClinicalDetails"][i]["FileUploads"].count
                for var j = 0 ; j < fileUploadCount ; ++j{
                    print(AppointmentDetail["data"]["TelehealthAppointment"]["ClinicalDetails"][i]["FileUploads"][j]["FileType"])
                    //check Filetype
                    if AppointmentDetail["data"]["TelehealthAppointment"]["ClinicalDetails"][i]["FileUploads"][j]["FileType"] == "MedicalImage" {
                        let imageUID = AppointmentDetail["data"]["TelehealthAppointment"]["ClinicalDetails"][i]["FileUploads"][j]["UID"].string
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
        compailer(ArrayImageUID)
        
    }
    
    
    func uploadImage(image:UIImage,userUID:String,compailer:(JSON) -> Void){
//        let ima = UIImage(data: (image.lowestQualityJPEGNSData))
//        let data = UIImageJPEGRepresentation(ima!, 1)
//        _ = data?.length
        api.uploadImage(image,userUID: userUID){
            response in
            print("aaa--",response)
           
            if response["status"] == "success"{
                let fileUID =  response["fileUID"].string!
                compailer(["message":"success","data":fileUID])
            }else {
                print("error",response["ErrorType"])
                
                if let error = response["ErrorType"].string {
                    compailer(["message":"error","ErrorType":error])
                }else {
                    compailer(["message":"error","ErrorType":"Can't upload Image"])
                }
                
            }
            
        }
    }
    
    func updateImageToAppointment(fileUID:String,appointmentID:String,compailer:(JSON) -> Void) {
        api.updateImageToAppointment(fileUID, apptID:appointmentID){
            response in
            if response["status"] == "success"{
                compailer(["message":"success"])
            }else {
                compailer(["message":"error"])
            }
        }
        
    }
    
    
}


