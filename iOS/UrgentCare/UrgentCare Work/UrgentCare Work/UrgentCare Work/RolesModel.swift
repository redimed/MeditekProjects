//
//  Roles.swift
//  UrgentCare Work
//
//  Created by Meditek on 3/28/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit
import ObjectMapper
import RealmSwift

class Roles: BaseModel {
    dynamic var ID = ""
    dynamic var RoleCode = ""
    dynamic var RoleName = ""
    dynamic var SiteId = ""
    dynamic var UID = ""
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        
        ID    <- map["ID"]
        RoleCode    <- map["RoleCode"]
        RoleName    <- map["RoleName"]
        SiteId    <- map["SiteId"]
        UID    <- map["UID"]
    }
    
}