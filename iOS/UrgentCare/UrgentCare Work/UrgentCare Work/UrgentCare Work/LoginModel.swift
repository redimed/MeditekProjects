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
    dynamic var UserName = "admin_manh"
    dynamic var Password = "123456"
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        UserName    <- map["UserName"]
        Password    <- map["Password"]
    }
    
}
