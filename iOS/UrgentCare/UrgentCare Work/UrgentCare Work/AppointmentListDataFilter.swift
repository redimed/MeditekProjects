//
//  AppointmentListDataFilter.swift
//  UrgentCare Work
//
//  Created by Meditek on 5/16/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit
import ObjectMapper
import RealmSwift

class AppointmentListDataFilter: Mappable {
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    func mapping(map: Map) {
    }
}
class FilterAppointment: AppointmentListDataFilter {
    
    dynamic var Enable = "Y"
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        Enable    <- map["Enable"]
    }
}
class FilterPatient: AppointmentListDataFilter {
    
    dynamic var Patient : FilterPatientData!
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        Patient    <- map["Patient"]
    }
}
class FilterPatientData: BaseModel {
    
    dynamic var UID = ""
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        UID    <- map["UID"]
    }
}
class FilterTelehealthAppointment: AppointmentListDataFilter {
    
    dynamic var Type = ""
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        Type    <- map["Type"]
    }
}

var filterPatient = FilterPatient()
var filterPatientData = FilterPatientData()

