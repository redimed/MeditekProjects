//
//  DetailCompanyModel.swift
//  UrgentCare Work
//
//  Created by Meditek on 4/4/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit
import ObjectMapper
import RealmSwift


class DetailCompanyResponse: BaseModel {
    
    dynamic var message = ""
    var data = [DetailCompanyData]()
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    override func mapping(map: Map) {
        data      <- map["data"]
        message    <- map["mesage"]
    }
    
}

class DetailCompanyData: Mappable {
    dynamic var Active = ""
    dynamic var CompanyName = ""
    dynamic var CreatedBy = ""
    dynamic var CreatedDate = ""
    dynamic var Description = ""
    dynamic var Enable = ""
    dynamic var ID = ""
    dynamic var ModifiedBy = ""
    dynamic var ModifiedDate = ""
    var relCompanyPatient : RelCompanyPatient!
    dynamic var UID = ""
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    func mapping(map: Map) {
        Active    <- map["Active"]
        CompanyName    <- map["CompanyName"]
        CreatedBy    <- map["CreatedBy"]
        CreatedDate    <- map["CreatedDate"]
        Description    <- map["Description"]
        Enable    <- map["Enable"]
        ID    <- map["ID"]
        ModifiedBy    <- map["ModifiedBy"]
        ModifiedDate    <- map["ModifiedDate"]
        relCompanyPatient    <- map["RelCompanyPatient"]
        UID    <- map["UID"]
    }
    
}

class RelCompanyPatient: Mappable {
    dynamic var Active = ""
    dynamic var CompanyID = ""
    dynamic var CreatedBy = ""
    dynamic var CreatedDate = ""
    dynamic var ID = ""
    dynamic var ModifiedBy = ""
    dynamic var ModifiedDate = ""
    dynamic var PatientID = ""
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    func mapping(map: Map) {
        Active      <- map["Active"]
        CompanyID    <- map["CompanyID"]
        CreatedBy      <- map["CreatedBy"]
        CreatedDate    <- map["CreatedDate"]
        ID      <- map["ID"]
        ModifiedBy    <- map["ModifiedBy"]
        ModifiedDate      <- map["ModifiedDate"]
        PatientID    <- map["PatientID"]
    }
    
}
