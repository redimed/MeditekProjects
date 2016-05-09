//
//  ForgetPin.swift
//  UrgentCare Work
//
//  Created by Meditek on 5/5/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//
import UIKit
import ObjectMapper
import RealmSwift

class ForgetPin: BaseModel {
    dynamic var phone = ""
    dynamic var token = ""
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        phone    <- map["phone"]
        token    <- map["token"]
    }
    
}

class LoginTelehealth: BaseModel {
    dynamic var uid = ""
    dynamic var token = ""
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        token    <- map["token"]
        uid    <- map["uid"]
    }
    
}

class LoginTelehealthReponse: BaseModel {
    dynamic var data : LoginTelehealthData!
    dynamic var message = ""

    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        data    <- map["data"]
        message    <- map["message"]
    
    }
    
}

class LoginTelehealthData: BaseModel {
    dynamic var message = ""
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        message    <- map["message"]
    
    }
    
}


