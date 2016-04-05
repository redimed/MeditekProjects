//
//  UserModel.swift
//  UrgentCare Work
//
//  Created by Me   ditek on 3/28/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit
import ObjectMapper
import RealmSwift

class User: Mappable {
    
    dynamic var roles =  [Roles]()
    dynamic var Activated = ""
    dynamic var ID = ""
    var telehealthUser : TelehealthUser!
    dynamic var UID = ""
    dynamic var UserName = ""
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    func mapping(map: Map) {
        Activated    <- map["Activated"]
        ID    <- map["ID"]
        telehealthUser    <- map["TelehealthUser"]
        UID    <- map["UID"]
        UserName    <- map["UserName"]
        roles    <- map["roles"]
    }
    
}