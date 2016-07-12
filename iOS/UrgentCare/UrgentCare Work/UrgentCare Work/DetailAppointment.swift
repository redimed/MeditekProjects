//
//  DetailAppointment.swift
//  UrgentCare Work
//
//  Created by Meditek on 5/23/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//
import UIKit
import ObjectMapper
import RealmSwift

class DetailAppointment: BaseModel {
    
    dynamic var AppointmentData = ""
    dynamic var UID = ""
    dynamic var ApprovalDate = ""
    dynamic var FromTime = ""
    dynamic var TelehealthAppointment = ""
    var PatientAppointments = [PatientInformation]()
    dynamic var RequestDate = ""
    dynamic var CreatedDate = ""
    dynamic var SiteID = ""
    dynamic var ToTime = ""
    dynamic var OnsiteAppointments = ""
    var Doctors = [DoctorsAppointment]()
    dynamic var Status = ""
    dynamic var Type = ""
    dynamic var Code = ""
    var Patients = [PatientInformation]()
    var fileUploads = [FileUploads]()
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        AppointmentData    <- map["AppointmentData"]
        UID    <- map["UID"]
        ApprovalDate    <- map["ApprovalDate"]
        FromTime    <- map["FromTime"]
        TelehealthAppointment    <- map["TelehealthAppointment"]
        PatientAppointments    <- map["PatientAppointments"]
        RequestDate    <- map["RequestDate"]
        CreatedDate    <- map["CreatedDate"]
        SiteID    <- map["SiteID"]
        ToTime    <- map["ToTime"]
        OnsiteAppointments    <- map["OnsiteAppointments"]
        Doctors    <- map["Doctors"]
        Status    <- map["Status"]
        Type    <- map["Type"]
        Code    <- map["Code"]
        Patients    <- map["Patients"]
        fileUploads    <- map["FileUploads"]
    }
}