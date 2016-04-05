//
//  LoginResponse.swift
//  UrgentCare Work
//
//  Created by Meditek on 3/28/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit
import ObjectMapper
import RealmSwift

class LoginResponse: BaseModel {
    dynamic var message = ""
    dynamic var refreshCode = ""
    dynamic var status = ""
    dynamic var token = ""
    var user : User?
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        message    <- map["message"]
        refreshCode    <- map["refreshCode"]
        status    <- map["status"]
        token    <- map["token"]
        user    <- map["user"]
    }
    
}
