//
//  LoginModel.swift
//  UrgentCare Work
//
//  Created by Meditek on 3/28/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit
import ObjectMapper
import RealmSwift

class Login: BaseModel {
    dynamic var UserName = "1"
    dynamic var Password = "2"
    dynamic var UserUID = ""
    dynamic var DeviceID = Context.getDataDefasults(Define.keyNSDefaults.DeviceID) as! String
    dynamic var PinNumber = ""
    dynamic var AppID = UIApplication.sharedApplication().bundleID()
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        UserName    <- map["UserName"]
        Password    <- map["Password"]
        UserUID    <- map["UserUID"]
        DeviceID    <- map["DeviceID"]
        PinNumber    <- map["PinNumber"]
        AppID    <- map["AppID"]
    }
    
}

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

class Roles: BaseModel {
    dynamic var ID = 0
    dynamic var RoleCode = ""
    dynamic var RoleName = ""
    dynamic var SiteId = ""
    dynamic var UID = ""
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        
        ID    <- map["ID"]
        RoleCode    <- map["RoleCode"]
        RoleName    <- map["RoleName"]
        SiteId    <- map["SiteId"]
        UID    <- map["UID"]
    }
    
}

class LogoutResponse: BaseModel {
    dynamic var status = ""
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        status    <- map["status"]
    }
    
}