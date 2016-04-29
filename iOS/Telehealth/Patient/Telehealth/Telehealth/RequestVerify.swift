//
//  RequestVerify.swift
//  Telehealth
//
//  Created by Meditek on 3/31/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//


import UIKit
import ObjectMapper
import RealmSwift

class RequestRegister: BaseModel {
    dynamic var phone = ""
    //dynamic var deviceType = "ios"
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        phone    <- map["phone"]
        //deviceType    <- map["deviceType"]
    }
    
}

class RequestRegisterPost: BaseModel {
    dynamic var data : RequestRegister!
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        data    <- map["data"]
    }
    
}

class ResponseVerifyCode: BaseModel {
    dynamic var patientUID = ""
    dynamic var userUID =  ""
    dynamic var verifyCode =  ""
    
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        patientUID    <- map["patientUID"]
        userUID     <- map["userUID"]
        verifyCode    <- map["verifyCode"]
    }
    
}

class ResponseRegister: BaseModel {
    dynamic var PinNumber = ""
    dynamic var Activated = ""
    dynamic var UserUID =  ""
    dynamic var PatientUID = ""
    
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        UserUID    <- map["UserUID"]
        Activated     <- map["Activated"]
        PinNumber     <- map["PinNumber"]
        PatientUID    <- map["PatientUID"]
    }
    
}