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
    var fileUploads = [FileUploadImage]()
    var patientsCompany = [PatientsCompany]()
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
    dynamic var Title = ""
    dynamic var LastName = ""
    dynamic var PhoneNumber = ""
    dynamic var HomePhoneNumber = ""
    dynamic var WorkPhoneNumber = ""
    dynamic var Suburb = ""
    dynamic var DOB = ""
    dynamic var Email = ""
    dynamic var Postcode = ""
    dynamic var PatientKinMobilePhoneNumber = ""
    dynamic var PatientKinFirstName = ""
    dynamic var PatientKinLastName = ""
    dynamic var Address1 = ""
    
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
        Postcode    <- map["Postcode"]
        PatientKinMobilePhoneNumber <- map["PatientKinMobilePhoneNumber"]
        Title <- map["Title"]
        PatientKinFirstName <- map["PatientKinFirstName"]
        PatientKinLastName <- map["PatientKinLastName"]
        Address1 <- map["Address1"]

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
    dynamic var FileLocation = ""
    dynamic var FileType = ""
    dynamic var UserAccountID = ""
    dynamic var FileName = ""
    dynamic var FileExtension = ""
    dynamic var Description = ""
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    func mapping(map: Map) {
        UID    <- map["UID"]
        FileLocation    <- map["FileLocation"]
        FileType    <- map["FileType"]
        UserAccountID    <- map["UserAccountID"]
        FileName    <- map["FileName"]
        FileExtension    <- map["FileExtension"]
        Description    <- map["Description"]
    }
    
}

class FileUploadImage : Mappable{
    
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
    var data = [DataResPonseAppointment]()
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        status    <- map["status"]
        data    <- map["data"]
    }
    
}
class DataResPonseAppointment : Mappable{
    
    dynamic var appointment : DataResPonseAppointment_appointment!
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    func mapping(map: Map) {
        appointment    <- map["appointment"]
    }
    
}
class DataResPonseAppointment_appointment : BaseModel{
    
    dynamic var ID = 0
    dynamic var Code = ""
    dynamic var UID = ""
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        ID    <- map["ID"]
        Code    <- map["Code"]
        UID    <- map["UID"]
    }
    
}
