//
//  ConfigurationSystem.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/24/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import SwiftyJSON
import Alamofire
import SystemConfiguration

let config = ConfigurationSystem()
var savedData  = saveData()
let defaults = NSUserDefaults.standardUserDefaults()
var tokens = String()
var coreTokens = String()
var PatientInfo : Patient!

struct ConfigurationSystem {
    static let Http_3009 = "http://testapp.redimed.com.au:3009"
    static let Http_3005 =  "http://testapp.redimed.com.au:3005"
    let deviceID = UIDevice.currentDevice().identifierForVendor?.UUIDString
    

    //change border color textfield
    func borderTextFieldValid(textField:DesignableTextField,color:UIColor){
        textField.layer.borderColor = color.CGColor
        textField.layer.borderWidth = 1
        textField.cornerRadius = 4
    }
    //Giap: Check input only number
    func validateInputOnlyNumber(value: Int) -> Bool {
        switch value {
        case numberHashValue.number0 :
            return true
        case numberHashValue.number1 :
            return true
        case numberHashValue.number2 :
            return true
        case numberHashValue.number3 :
            return true
        case numberHashValue.number4 :
            return true
        case numberHashValue.number5 :
            return true
        case numberHashValue.number6 :
            return true
        case numberHashValue.number7 :
            return true
        case numberHashValue.number8 :
            return true
        case numberHashValue.number9 :
            return true
        case numberHashValue.delete :
            return true
        default:
            return false
        }
    }
    
    static func isConnectedToNetwork() -> Bool {
        var zeroAddress = sockaddr_in()
        zeroAddress.sin_len = UInt8(sizeofValue(zeroAddress))
        zeroAddress.sin_family = sa_family_t(AF_INET)
        let defaultRouteReachability = withUnsafePointer(&zeroAddress) {
            SCNetworkReachabilityCreateWithAddress(nil, UnsafePointer($0))
        }
        var flags = SCNetworkReachabilityFlags()
        if !SCNetworkReachabilityGetFlags(defaultRouteReachability!, &flags) {
            return false
        }
        let isReachable = (flags.rawValue & UInt32(kSCNetworkFlagsReachable)) != 0
        let needsConnection = (flags.rawValue & UInt32(kSCNetworkFlagsConnectionRequired)) != 0
        return (isReachable && !needsConnection)
    }
    

}






