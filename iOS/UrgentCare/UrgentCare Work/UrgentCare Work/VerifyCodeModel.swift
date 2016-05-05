//
//  VerifyCodeModel.swift
//  Telehealth
//
//  Created by Meditek on 4/6/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
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