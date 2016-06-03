//
//  ReceiveMessageData.swift
//  UrgentCare Work
//
//  Created by Meditek on 5/12/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//
import UIKit
import ObjectMapper
import RealmSwift

class ReceiveMessageData: BaseModel {
    dynamic var apiKey = ""
    dynamic var from = ""
    dynamic var fromName = ""
    dynamic var message = ""
    dynamic var sessionId = ""
    dynamic var timeCall = ""
    dynamic var to = ""
    dynamic var token = ""
    
    required convenience init?(_ map: Map) {
        self.init()
    }
    
    override func mapping(map: Map) {
        apiKey    <- map["apiKey"]
        from    <- map["from"]
        fromName    <- map["fromName"]
        message    <- map["message"]
        sessionId    <- map["sessionId"]
        timeCall    <- map["timeCall"]
        to    <- map["to"]
        token    <- map["token"]
    }
    
}

var receiveMessageData = ReceiveMessageData()
