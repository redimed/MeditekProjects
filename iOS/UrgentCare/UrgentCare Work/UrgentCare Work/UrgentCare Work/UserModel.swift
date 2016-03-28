//
//  UserModel.swift
//  UrgentCare Work
//
//  Created by Meditek on 3/28/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit
import ObjectMapper
import RealmSwift

class User: BaseModel {
    dynamic var Activated = "admin_manh"
    dynamic var ID = "123456"
    var telehealthUser : TelehealthUser!
    dynamic var UID = "123456"
    dynamic var UserName = "123456"
    var roles = Roles!()
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        Activated    <- map["Activated"]
        ID    <- map["ID"]
        telehealthUser    <- map["TelehealthUser"]
        UID    <- map["UID"]
        UserName    <- map["UserName"]
        roles    <- map["Roles"]
    }
    
}