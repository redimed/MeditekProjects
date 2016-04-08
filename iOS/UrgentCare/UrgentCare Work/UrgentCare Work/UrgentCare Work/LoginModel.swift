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
    dynamic var DeviceID = Context.getDataDefasults(Define.keyNSDefaults.deviceID)
    dynamic var VerificationToken = ""
    dynamic var AppID = UIApplication.sharedApplication().bundleID()
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        UserName    <- map["UserName"]
        Password    <- map["Password"]
        UserUID    <- map["UserUID"]
        DeviceID    <- map["DeviceID"]
        VerificationToken    <- map["VerificationToken"]
        AppID    <- map["AppID"]
    }
    
}
