//
//  UpdatePinNumber.swift
//  UrgentCare Work
//
//  Created by Meditek on 5/12/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//
import UIKit
import ObjectMapper
import RealmSwift

class UpdatePinNumber: BaseModel {
    dynamic var oldPin = ""
    dynamic var newPin = ""
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        oldPin    <- map["oldPin"]
        newPin    <- map["newPin"]
    }
    
}