//
//  GlobalConstants.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 9/25/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import Foundation

let STRING_URL_SERVER = "http://testapp.redimed.com.au:3009"

let AUTHORIZATION = STRING_URL_SERVER + "/telehealth/user/login"

let GENERATESESSION = STRING_URL_SERVER + "/telehealth/socket/generateSession"

/// Socket Emit
let GET_ONLINE_USERS : NSDictionary = ["url": "/telehealth/socket/onlineList"]

let TRANSFER_CALL = "/telehealth/socket/messageTransfer?from=%@&to=%@&message=%@"

let JOIN_ROOM = "/telehealth/socket/joinRoom?phone=%@"

func emitSocket(url: String, parameters: [String: AnyObject]){

    let parameterString = parameters.stringFromHttpParameters()
    print(url)
        print(parameterString)
    let requestURL = NSURL(string:"\(url)?\(parameterString)")!
    
//    var URL = "\(url)"
//    for var i = 0; i < param.count; ++i {
//        let paramUrl = param[i] as! String
//        URL.appendContentsOf(paramUrl)
//    }
//    let dictionNary : NSDictionary = ["url": URL]
    print(requestURL)
}

extension String {
    
    func stringByAddingPercentEncodingForURLQueryValue() -> String? {
        let characterSet = NSMutableCharacterSet.alphanumericCharacterSet()
        characterSet.addCharactersInString("-._~")
        
        return self.stringByAddingPercentEncodingWithAllowedCharacters(characterSet)
    }
    
}

extension Dictionary {
    
    func stringFromHttpParameters() -> String {
        let parameterArray = self.map { (key, value) -> String in
            let percentEscapedKey = (key as! String).stringByAddingPercentEncodingForURLQueryValue()!
            let percentEscapedValue = (value as! String).stringByAddingPercentEncodingForURLQueryValue()!
            return "\(percentEscapedKey)=\(percentEscapedValue)"
        }
        
        return parameterArray.joinWithSeparator("&")
    }
    
}


/**
*  Alert Title and Message for JSSAlertView
*/

var warning_Network = (title: "Not Connection", mess: "Unable to connect to the Internet")
var connection_Server = (title: "Error")

