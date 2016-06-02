//
//  UploadImage.swift
//  UrgentCare Work
//
//  Created by Meditek on 5/23/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit
import ObjectMapper
import RealmSwift

class UploadImage: BaseModel {
    dynamic var fileType = ""
    dynamic var userUID = ""
    dynamic var fileUID = ""
    dynamic var status = ""
    dynamic var apptUID = ""
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        fileType    <- map["fileType"]
        userUID    <- map["userUID"]
        fileUID    <- map["fileUID"]
        status    <- map["status"]
        apptUID    <- map["apptUID"]
    }
    
}

class UploadImageRequest: BaseModel {
    dynamic var data : UploadImage!
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        data    <- map["data"]
    }
    
}

