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


let config = ConfigurationSystem()
var savedData  = saveData()
let defaults = NSUserDefaults.standardUserDefaults()
var tokens = String()
var coreTokens = String()
var userUID = String()
var cookies = String()
var PatientInfo : Patient!
let phoneNumberCallUs = "0892300900"
var statusCallingNotification = ""
struct ConfigurationSystem {
    static let http = "http://testapp.redimed.com.au"
    
    
    static let Http_3009 = "\(http):3009"
    static let Http_3005 =  "\(http):3005"
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
    


}






