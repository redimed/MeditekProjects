//
//  GlobalConstants.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 9/25/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import Foundation

let STRING_URL_SERVER = "http://192.168.1.130:3009"

let AUTHORIZATION = STRING_URL_SERVER + "/api/telehealth/user/login"

let GENERATESESSION = STRING_URL_SERVER + "/api/telehealth/socket/generateSession"

/// Socket Emit
let GET_ONLINE_USERS : NSDictionary = ["url": "/api/telehealth/socket/onlineList"]

let TRANSFER_IN_CALL = "/api/telehealth/socket/messageTransfer?from=%@&to=%@&message=%@"

let MAKE_CALL = "/api/telehealth/socket/messageTransfer?from=%@&to=%@&message=%@&sessionId=%@&fromName=%@"

let JOIN_ROOM = "/api/telehealth/socket/joinRoom?uid=%@"

/**
*  Alert Title and Message for JSSAlertView
*/

var warning_Network = (title: "Not Connection", mess: "Unable to connect to the Internet")
var connection_Server = (title: "Error")

