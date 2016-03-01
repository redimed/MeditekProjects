//
//  Call.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 10/27/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import Foundation
import SwiftyJSON

//class handle get and set data calling

struct CallContainer {
    
    var data: JSON = ""
    var apiKey : String!
    var message : String!
    var fromName : String!
    var sessionId : String!
    var token : String!
    var from : String!
    init(){}
    init(apiKey:String,message:String,fromName:String,sessionId:String,token:String,from:String){
        self.apiKey = apiKey
        self.message = message
        self.fromName = fromName
        self.sessionId = sessionId
        self.token = token
        self.from = from
    }
    

}

