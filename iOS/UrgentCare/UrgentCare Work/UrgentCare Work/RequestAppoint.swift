//
//  RequestAppointModel.swift
//  UrgentCare Work
//
//  Created by Meditek on 4/13/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit
import ObjectMapper
import RealmSwift


class RequestAppointData: BaseModel {
    
    dynamic var RequestDate = ""
    dynamic var Type = ""
    dynamic var Description = ""
    dynamic var patientAppointment : PatientAppointment!
    var appointmentData = [AppointmentData]()
    var fileUploads = [FileUploads]()
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        RequestDate    <- map["RequestDate"]
        Type    <- map["Type"]
        Description <- map["Description"]
        patientAppointment    <- map["PatientAppointment"]
        appointmentData    <- map["AppointmentData"]
        fileUploads    <- map["FileUploads"]
    }
    
}

class RequestAppointPost: BaseModel {
    
    dynamic var data : RequestAppointData!
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        data    <- map["data"]
    }
    
}

class PatientAppointment : BaseModel{
    
    dynamic var FirstName = ""
    dynamic var LastName = ""
    dynamic var PhoneNumber = ""
    dynamic var HomePhoneNumber = ""
    dynamic var Suburb = ""
    dynamic var DOB = ""
    dynamic var Email = ""
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        FirstName    <- map["FirstName"]
        LastName    <- map["LastName"]
        PhoneNumber    <- map["PhoneNumber"]
        HomePhoneNumber    <- map["HomePhoneNumber"]
        Suburb    <- map["Suburb"]
        DOB    <- map["DOB"]
        Email    <- map["Email1"]
    }
}

class AppointmentData : Mappable{
    
    dynamic var Section = "Telehealth"
    dynamic var Category = "Appointment"
    dynamic var Type = "RequestPatient"
    dynamic var Name = ""
    dynamic var Value = ""
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    func mapping(map: Map) {
        Section    <- map["Section"]
        Category    <- map["Category"]
        Type    <- map["Type"]
        Name    <- map["Name"]
        Value    <- map["Value"]
    }
    
}

class FileUploads : Mappable{
    
    dynamic var UID = ""
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    func mapping(map: Map) {
        UID    <- map["UID"]
    }
    
}

class RequestAppointResponse : BaseModel{
    
    dynamic var status = ""
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        status    <- map["status"]
    }
    
}
