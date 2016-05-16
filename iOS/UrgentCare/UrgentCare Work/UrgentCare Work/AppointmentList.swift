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

class AppointmentListResponse: BaseModel {
    var rows = [AppointmentListResponseDetail]()
    var count = ""
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        rows    <- map["rows"]
        count    <- map["count"]
    }
    
}
class AppointmentListResponseDetail: BaseModel {
    
    dynamic var ApprovalDate = ""
    dynamic var Code = ""
    dynamic var CreatedDate = ""
    dynamic var DoctorsName = ""
    dynamic var FromTime = ""
    dynamic var RequestDate = ""
    dynamic var SiteID = ""
    dynamic var Status = ""
    dynamic var TelehealthAppointment = ""
    dynamic var ToTime = ""
    dynamic var Type = ""
    dynamic var UID = ""
    var Doctors = [DoctorsAppointment]()
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        ApprovalDate    <- map["ApprovalDate"]
        Code    <- map["Code"]
        CreatedDate    <- map["CreatedDate"]
        DoctorsName    <- map["DoctorsName"]
        FromTime    <- map["FromTime"]
        RequestDate    <- map["RequestDate"]
        SiteID    <- map["SiteID"]
        Status    <- map["Status"]
        TelehealthAppointment    <- map["TelehealthAppointment"]
        ToTime    <- map["ToTime"]
        Type    <- map["Type"]
        UID    <- map["UID"]
        Doctors <- map["Doctors"]
    }
    
}

class DoctorsAppointment: Mappable {
    var Address1 = ""
    var Address2 = ""
    var DOB = ""
    var Email = ""
    var FaxNumber = ""
    var FirstName = ""
    var HealthLink = ""
    var HomePhoneNumber = ""
    var LastName = ""
    var MiddleName = ""
    var Postcode = ""
    var ProviderNumber = ""
    var Signature = 0
    var State = ""
    var Suburb = ""
    var Title = ""
    var Type = ""
    var UID = ""
    var WorkPhoneNumber = ""
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    func mapping(map: Map) {
        Address1    <- map["Address1"]
        Address2    <- map["Address2"]
        DOB    <- map["DOB"]
        Email    <- map["Email"]
        FaxNumber    <- map["FaxNumber"]
        FirstName    <- map["FirstName"]
        HealthLink    <- map["HealthLink"]
        HomePhoneNumber    <- map["HomePhoneNumber"]
        LastName    <- map["LastName"]
        MiddleName    <- map["MiddleName"]
        Postcode    <- map["Postcode"]
        ProviderNumber    <- map["ProviderNumber"]
        Signature    <- map["Signature"]
        State    <- map["State"]
        Suburb    <- map["Suburb"]
        Title    <- map["Title"]
        Type    <- map["Type"]
        UID    <- map["UID"]
        WorkPhoneNumber    <- map["WorkPhoneNumber"]
    }
    
}

