//
//  TelehealthUserModel.swift
//  UrgentCare Work
//
//  Created by Meditek on 3/28/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit
import ObjectMapper
import RealmSwift

class TelehealthUser: BaseModel {
    dynamic var ID = 0
    dynamic var UID = ""
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        ID    <- map["ID"]
        UID    <- map["UID"]
    }
    
}
