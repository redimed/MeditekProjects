//
//  VerifyCodeModel.swift
//  Telehealth
//
//  Created by Meditek on 4/6/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//
import UIKit
import ObjectMapper
import RealmSwift

class VerifyCode: BaseModel {
    dynamic var phone = ""
    dynamic var code = ""
    dynamic var deviceType = "ios"
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        code    <- map["code"]
        phone    <- map["phone"]
        deviceType    <- map["deviceType"]
    }
    
}

class VerifyCodeRequest: BaseModel {
    dynamic var data : VerifyCode!
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        data    <- map["data"]
    }
    
}

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