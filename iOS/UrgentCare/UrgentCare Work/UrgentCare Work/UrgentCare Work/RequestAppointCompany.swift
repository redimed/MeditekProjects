//
//  RequestAppointModel.swift
//  UrgentCare Work
//
//  Created by Meditek on 4/13/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit
import ObjectMapper
import RealmSwift


class RequestAppointDataCompany: Mappable {
    
    dynamic var RequestDate = ""
    dynamic var Type = ""
    dynamic var Description = ""
    dynamic var patientAppointment : PatientAppointment!
    var appointmentData = [AppointmentData]()
    var fileUploads = [FileUploads]()
    var doctorsCompany = [DoctorsCompany]()
    var patientsCompany = [PatientsCompany]()
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    func mapping(map: Map) {
        RequestDate    <- map["RequestDate"]
        Type    <- map["Type"]
        Description <- map["Description"]
        patientAppointment    <- map["PatientAppointment"]
        appointmentData    <- map["AppointmentData"]
        fileUploads    <- map["FileUploads"]
        doctorsCompany    <- map["Doctors"]
        patientsCompany    <- map["Patients"]
    }
    
}

class RequestAppointPostCompany: BaseModel {
    
    var dataCompany : DataCompany!
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        dataCompany    <- map["data"]
    }
    
}
class DataCompany: Mappable {
    
    var appointmentsCompany = [RequestAppointDataCompany]()
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    func mapping(map: Map) {
        appointmentsCompany    <- map["Appointments"]
    }
    
}
class PatientsCompany :Mappable{
    
    dynamic var UID = ""
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    func mapping(map: Map) {
        UID    <- map["UID"]
    }
    
}

class DoctorsCompany :Mappable{
    
    dynamic var UID = ""
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    func mapping(map: Map) {
        UID    <- map["UID"]
    }
    
}

