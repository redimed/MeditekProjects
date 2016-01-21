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
    var AppointmentArr = [AppointmentContainer]()
    func getAppointmentByID(UID:String,Limit:String,completionHandler:(JSON,[AppointmentContainer]) -> Void){
        api.getListAppointmentByUID(UID, Limit: Limit, completionHandler: {
            response in
            var message : JSON!
            if response["ErrorsList"] != nil {
                message = JSON(["message":"error","ErrorType":response["ErrorType"]])
                completionHandler(message,[AppointmentContainer()])
            }else if response["TimeOut"] ==  "Request Time Out" {
                message = JSON(["message":"error","ErrorType":ErrorMessage.TimeOut])
                completionHandler(message,[AppointmentContainer()])
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
                    let appointment = AppointmentContainer.init(UIDApointment: UIDApointment, ToTime: ToTime, Status: Status, FromTime: FromTime, NameDoctor: NameDoctor, Type: Type, refName: refName)
                    self.AppointmentArr.append(appointment)
                }
                message = JSON(["message":"success"])
                completionHandler(message,self.AppointmentArr)
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
        let ima = UIImage(data: (image.lowestQualityJPEGNSData))
        let data = UIImageJPEGRepresentation(ima!, 1)
        _ = data?.length
        api.uploadImage(ima!,userUID: userUID){
            response in
            let fileUID =   response["fileUID"].string!
            if response["status"] == "success"{
                compailer(["message":"success","data":fileUID])
            }else {
                print("error",response["ErrorType"])
                let error = response["ErrorType"].string
                compailer(["message":"error","ErrorType":error!])
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


