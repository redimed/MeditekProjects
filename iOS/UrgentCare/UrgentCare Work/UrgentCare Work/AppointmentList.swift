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
    dynamic var Limit = ""
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
    var count = 0
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        rows    <- map["rows"]
        count    <- map["count"]
    }
    
}


class AppointmentListResponseDetail: Mappable {
    
    dynamic var ApprovalDate = ""
    dynamic var Code = ""
    dynamic var CreatedDate = ""
    dynamic var DoctorsName = ""
    dynamic var FromTime = ""
    dynamic var RequestDate = ""
    dynamic var SiteID = ""
    dynamic var Status = ""
    var patientAppointments = [PatientsAppointment]()
    dynamic var ToTime = ""
    dynamic var Type = ""
    dynamic var UID = ""
    var Patients = [PatientsAppointment]()
    var Doctors = [DoctorsAppointment]()
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
     func mapping(map: Map) {
        ApprovalDate    <- map["ApprovalDate"]
        Code    <- map["Code"]
        CreatedDate    <- map["CreatedDate"]
        DoctorsName    <- map["DoctorsName"]
        FromTime    <- map["FromTime"]
        RequestDate    <- map["RequestDate"]
        SiteID    <- map["SiteID"]
        Status    <- map["Status"]
        patientAppointments    <- map["PatientAppointments"]
        ToTime    <- map["ToTime"]
        Type    <- map["Type"]
        UID    <- map["UID"]
        Doctors <- map["Doctors"]
        Patients <- map["Patients"]
    }
    
}
class TelehealthsAppointment: BaseModel {
    var Allergy = ""
    var Correspondence = ""
    var Description = ""
    var Fund = ""
    var FundType = ""
    var PresentComplain = ""
    var RefAddress = ""
    var RefDate = ""
    var RefDurationOfReferral = ""
    var RefHealthLink = ""
    var RefName = ""
    var RefPostCode = ""
    var RefProviderNumber = ""
    var RefSignature = ""
    var RefTelePhone = ""
    var Type = ""
    var UID = ""
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        Allergy    <- map["Allergy"]
        Correspondence    <- map["Correspondence"]
        Description    <- map["Description"]
        Fund    <- map["Fund"]
        FundType    <- map["FundType"]
        PresentComplain    <- map["PresentComplain"]
        RefAddress    <- map["RefAddress"]
        RefDate    <- map["RefDate"]
        RefDurationOfReferral    <- map["RefDurationOfReferral"]
        RefHealthLink    <- map["RefHealthLink"]
        RefName    <- map["RefName"]
        RefPostCode    <- map["RefPostCode"]
        RefProviderNumber    <- map["RefProviderNumber"]
        RefSignature    <- map["RefSignature"]
        RefTelePhone    <- map["RefTelePhone"]
        Type    <- map["Type"]
        UID    <- map["UID"]
    }
    
}
class PatientsAppointment: Mappable {
    var Address1 = ""
    var Address2 = ""
    var DOB = ""
    var Email1 = ""
    var Email2 = ""
    var FaxNumber = ""
    var FirstName = ""
    var Gender = ""
    var HomePhoneNumber = ""
    var Indigenous = ""
    var InterperterLanguage = ""
    var InterpreterRequired = ""
    var LastName = ""
    var MiddleName = ""
    var Postcode = ""
    var PreferredName = ""
    var PreviousName = ""
    var Occupation = ""
    var OtherSpecialNeed = ""
    var State = ""
    var Suburb = ""
    var Title = ""
    var UID = ""
    var WorkPhoneNumber = ""
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    func mapping(map: Map) {
        Address1    <- map["Address1"]
        Address2    <- map["Address2"]
        DOB    <- map["DOB"]
        Email1    <- map["Email1"]
        Email2    <- map["Email2"]
        FaxNumber    <- map["FaxNumber"]
        FirstName    <- map["FirstName"]
        Gender    <- map["Gender"]
        HomePhoneNumber    <- map["HomePhoneNumber"]
        Indigenous    <- map["Indigenous"]
        InterperterLanguage    <- map["InterperterLanguage"]
        InterpreterRequired    <- map["InterpreterRequired"]
        LastName    <- map["LastName"]
        MiddleName    <- map["MiddleName"]
        Postcode    <- map["Postcode"]
        PreferredName    <- map["PreferredName"]
        PreviousName    <- map["PreviousName"]
        Occupation    <- map["Occupation"]
        OtherSpecialNeed    <- map["OtherSpecialNeed"]
        State    <- map["State"]
        Suburb    <- map["Suburb"]
        Title    <- map["Title"]
        UID    <- map["UID"]
        WorkPhoneNumber    <- map["WorkPhoneNumber"]
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

