//
//  ListStaffModel.swift
//  UrgentCare Work
//
//  Created by Meditek on 4/8/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit
import ObjectMapper
import RealmSwift

class ListSite: Mappable {
    dynamic var data =  [Site]()
    dynamic var message =  ""
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    func mapping(map: Map) {
        data    <- map["data"]
        message <- map["message"]
    }
    
}

class Site: BaseModel {
    dynamic var Address1 = ""
    dynamic var Address2 = ""
    dynamic var CompanyID = 0
    dynamic var ContactName = ""
    dynamic var Country = ""
    dynamic var CreatedBy = ""
    dynamic var CreatedDate = ""
    dynamic var Enable = ""
    dynamic var FaxNumber = ""
    dynamic var HomePhoneNumber = ""
    dynamic var ID = 0
    dynamic var ModifiedBy = ""
    dynamic var ModifiedDate = ""
    dynamic var Postcode = ""
    dynamic var SiteName = ""
    dynamic var State = ""
    dynamic var Suburb = ""
    dynamic var UID = ""
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        Address1    <- map["Address1"]
        Address2    <- map["Address2"]
        CompanyID    <- map["CompanyID"]
        ContactName    <- map["ContactName"]
        Country    <- map["Country"]
        CreatedBy    <- map["CreatedBy"]
        CreatedDate    <- map["CreatedDate"]
        Enable    <- map["Enable"]
        FaxNumber    <- map["FaxNumber"]
        HomePhoneNumber    <- map["HomePhoneNumber"]
        ID    <- map["ID"]
        ModifiedBy    <- map["ModifiedBy"]
        ModifiedDate    <- map["ModifiedDate"]
        Postcode    <- map["Postcode"]
        SiteName    <- map["SiteName"]
        State    <- map["State"]
        Suburb    <- map["Suburb"]
        UID    <- map["UID"]
    }
    
}