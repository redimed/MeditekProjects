//
//  GlobalConstants.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 9/25/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import Foundation
import SwiftyJSON

let STRING_URL_SERVER = "http://192.168.1.130:3009"

let AUTHORIZATION = STRING_URL_SERVER + "/telehealth/user/login"

let GENERATESESSION = STRING_URL_SERVER + "/telehealth/socket/generateSession"

/// Socket Emit
let GET_ONLINE_USERS : NSDictionary = ["url": "/telehealth/socket/onlineList"]

let TRANSFER_CALL = "/telehealth/socket/messageTransfer?from=%@&to=%@&message=%@"

let JOIN_ROOM = "/telehealth/socket/joinRoom?phone=%@"


func emitSocket(url: String, param: NSArray) -> NSDictionary {

    var URL = "\(url)"
    for var i = 0; i < param.count; ++i {
        let paramUrl = param[i] as! String
        URL.appendContentsOf(paramUrl)
    }
    let dictionNary : NSDictionary = ["url": URL]
    return dictionNary
}


