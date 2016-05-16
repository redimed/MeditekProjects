//
//  AppointmentList.swift
//  UrgentCare Work
//
//  Created by Meditek on 5/16/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit
import ObjectMapper
import RealmSwift

class AppointmentList: BaseModel {
    dynamic var data : AppointmentListData!
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        data    <- map["data"]
    }
    
}

class AppointmentListData: BaseModel {
    dynamic var Offset = ""
    var Order = [AppointmentListDataOrder]()
    dynamic var Limit = "2"
    var Filter = [AppointmentListDataFilter]()
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        Offset    <- map["Offset"]
        Order    <- map["Order"]
        Limit    <- map["Limit"]
        Filter    <- map["Filter"]
    }
    
}


var appointmentListTracking = AppointmentList()
var appointmentListTrackingData = AppointmentListData()
var appointmentListDataFilter = AppointmentListDataFilter()

