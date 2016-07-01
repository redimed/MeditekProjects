//
//  Redisite.swift
//  UrgentCare Work
//
//  Created by Meditek on 6/17/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit
import ObjectMapper
import RealmSwift

class Redisite: BaseModel {
    dynamic var data : RedisiteData!
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        data    <- map["data"]
    }
    
}
class RedisiteData : BaseModel{
    dynamic var templateUID = ""
    dynamic var appointmentUID = ""
    dynamic var tempData = ""
    dynamic var name = ""
    dynamic var patientUID = ""
    dynamic var userUID = ""
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    override func mapping(map: Map) {
        templateUID    <- map["templateUID"]
        appointmentUID    <- map["appointmentUID"]
        tempData    <- map["tempData"]
        name    <- map["name"]
        patientUID    <- map["patientUID"]
        userUID    <- map["userUID"]
    }
    
}
class General: BaseModel {
    var general = [EformData]()
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    override func mapping(map: Map) {
        general    <- map["general"]
    }
    
}

class EformData : Mappable{
    
    dynamic var value = ""
    dynamic var name = ""
    dynamic var ref = ""
    dynamic var type = ""
    dynamic var checked = ""
    dynamic var refRow = ""
    dynamic var moduleID = 0
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    func mapping(map: Map) {
        value    <- map["value"]
        name    <- map["name"]
        ref    <- map["ref"]
        type    <- map["type"]
        checked    <- map["checked"]
        refRow    <- map["refRow"]
        moduleID    <- map["moduleID"]
    }
}
class ResponseEform : BaseModel {
    dynamic var data : ResponseEformData!
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    override func mapping(map: Map) {
        data    <- map["data"]
    }
    
}
class ResponseEformData : BaseModel{
    dynamic var CreatedBy = 0
    dynamic var CreatedDate = ""
    dynamic var EFormTemplateID = 0
    dynamic var Enable = ""
    dynamic var ID = 0
    dynamic var ModifiedDate = 0
    dynamic var Name = ""
    dynamic var Status = ""
    dynamic var UID = ""
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    override func mapping(map: Map) {
        CreatedBy    <- map["CreatedBy"]
        CreatedDate    <- map["CreatedDate"]
        EFormTemplateID    <- map["EFormTemplateID"]
        Enable    <- map["Enable"]
        ID    <- map["ID"]
        ModifiedDate    <- map["ModifiedDate"]
        Name    <- map["Name"]
        Status    <- map["Status"]
        UID    <- map["UID"]
    }
}
var AllRedisiteData = General()
var GeneralData = General()
var PatientData = General()
var InjuryData = General()
var DataConsent = General()