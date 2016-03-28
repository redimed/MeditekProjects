//
//  TelehealthUserModel.swift
//  UrgentCare Work
//
//  Created by Meditek on 3/28/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit
import ObjectMapper
import RealmSwift

class TelehealthUser: BaseModel {
    dynamic var ID = "admin_manh"
    dynamic var UID = "123456"
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        ID    <- map["ID"]
        UID    <- map["UID"]
    }
    
}
