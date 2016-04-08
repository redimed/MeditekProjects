//
//  LogoutModel.swift
//  UrgentCare Work
//
//  Created by Meditek on 4/7/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//
import UIKit
import ObjectMapper
import RealmSwift

class LogoutPost: BaseModel {
    dynamic var data : Logout!
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        data    <- map["data"]
    }
    
}

class Logout: BaseModel {
    dynamic var uid = ""
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        uid    <- map["uid"]
    }
    
}