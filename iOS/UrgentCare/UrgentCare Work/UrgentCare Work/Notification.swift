//
//  Notification.swift
//  UrgentCare Work
//
//  Created by Meditek on 5/6/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit
import ObjectMapper
import RealmSwift

class Notification: BaseModel {
    dynamic var aps = ""
    dynamic var message = ""
    dynamic var gcmmessageid = ""
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    override func mapping(map: Map) {
        aps    <- map["aps"]
        message    <- map["message"]
        gcmmessageid    <- map["gcm.message_id"]
    }
    
}
class NotificationData: BaseModel {
    dynamic var name = ""
    dynamic var object : Notification!
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        name    <- map["name"]
        object    <- map["object"]
    }
    
}
class ResponseNotifiData: BaseModel {
    dynamic var data : ResponseNoti!
    dynamic var message = ""
    dynamic var status = ""
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        data    <- map["data"]
        message    <- map["message"]
        status    <- map["status"]
    }
    
}
class ResponseNoti: BaseModel {
    dynamic var message : ResponseNotiMessage!
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        message    <- map["message"]
    }
    
}

class ResponseNotiMessage: BaseModel {
    var results = [ResponseNotiResults]()
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        results    <- map["results"]
    }
    
}
class ResponseNotiResults: Mappable {
    dynamic var error = ""
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    func mapping(map: Map) {
        error    <- map["error"]
    }
    
}

