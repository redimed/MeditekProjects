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
    dynamic var ID = "admin_manh"
    dynamic var RoleCode = "123456"
    dynamic var RoleName = "123456"
    dynamic var SiteId = "123456"
    dynamic var UID = "123456"
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        ID    <- map["ID"]
        RoleCode    <- map["RoleCode"]
        SiteId    <- map["SiteId"]
        UID    <- map["UID"]
    }
    
}