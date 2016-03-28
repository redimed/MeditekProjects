//
//  BaseModel.swift
//  UrgentCare Work
//
//  Created by Meditek on 3/28/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit
import ObjectMapper
import RealmSwift

class BaseModel: Object, Mappable {
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    func mapping(map: Map) {
    }
    
}
