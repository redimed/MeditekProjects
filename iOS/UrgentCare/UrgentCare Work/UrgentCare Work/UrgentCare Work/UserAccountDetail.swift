//
//  UserAccountDetail.swift
//  UrgentCare Work
//
//  Created by Meditek on 4/12/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit
import ObjectMapper
import RealmSwift

class UserAccountDetail: BaseModel {
    dynamic var Activated = ""
    dynamic var CreatedBy = ""
    dynamic var Email = ""
    dynamic var Enable = ""
    dynamic var id = 0
    dynamic var ModifiedBy = ""
    dynamic var ModifiedDate = ""
    dynamic var PhoneNumber = ""
    dynamic var Token = ""
    dynamic var TokenExpired = ""
    dynamic var UID = ""
    dynamic var UserName = ""
    dynamic var UserType = ""
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        Activated    <- map["Activated"]
        CreatedBy    <- map["CreatedBy"]
        Email    <- map["Email"]
        Enable    <- map["Enable"]
        id    <- map["ID"]
        ModifiedBy    <- map["ModifiedBy"]
        ModifiedDate    <- map["ModifiedDate"]
        PhoneNumber    <- map["PhoneNumber"]
        Token    <- map["Token"]
        TokenExpired    <- map["TokenExpired"]
        UID    <- map["UID"]
        UserName    <- map["UserName"]
        UserType    <- map["UserType"]
    }
    
}