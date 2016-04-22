//
//  RefreshCode.swift
//  UrgentCare Work
//
//  Created by Meditek on 4/13/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit
import ObjectMapper
import RealmSwift

class RefreshCode: BaseModel {
    dynamic var refreshCode = Context.getDataDefasults(Define.keyNSDefaults.RefreshCode)
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        refreshCode    <- map["refreshCode"]
    }
    
}

class RefreshCodeResponse: BaseModel {
    dynamic var refreshCode = ""
    dynamic var token = ""
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        refreshCode    <- map["refreshCode"]
        token    <- map["token"]
    }
    
}
