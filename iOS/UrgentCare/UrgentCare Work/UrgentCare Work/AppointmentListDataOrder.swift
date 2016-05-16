//
//  AppointmentListDataOrder.swift
//  UrgentCare Work
//
//  Created by Meditek on 5/16/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit
import ObjectMapper
import RealmSwift

class AppointmentListDataOrder: Mappable {
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    func mapping(map: Map) {
    }
}

class OrderAppointment: AppointmentListDataOrder {
    
    dynamic var Appointment : OrderAppointmentData!
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        Appointment    <- map["Appointment"]
    }
}
class OrderAppointmentData: BaseModel {
    
    dynamic var CreatedDate = "DESC"
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        CreatedDate    <- map["CreatedDate"]
    }
}

var orderAppointment = OrderAppointment()
var orderAppointmentData = OrderAppointmentData()
