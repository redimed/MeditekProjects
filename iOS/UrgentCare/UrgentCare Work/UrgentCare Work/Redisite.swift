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
    dynamic var ErrorType = ""
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        ErrorType    <- map["ErrorType"]
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
 var generalData = General()