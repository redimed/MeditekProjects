//
//  config.swift
//  UrgentCare Sport
//
//  Created by Giap Vo Duc on 11/3/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

//
//  config.swift
//  UrgentCare Sport
//
//  Created by Giap Vo Duc on 11/3/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import Foundation
import SystemConfiguration
import SwiftyJSON
import Alamofire
var config  = ConfigurationSystem()

let headers = [
    "Version" : "1.0",
    "systemtype": "ios",
]
struct RegexString  {
    
    static let PhoneNumber = "[0-9]{6,10}$"
    static let MobileNumber = "^(\\+61|0061|0)?4[0-9]{8}$"
    
    static let Email = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}"
}

struct api{
    static let submitInjury = "http://meditek.redimed.com.au:3001/api/urgent-care/urgent-request"
}
struct httpUrl{
    static let httpTestApp :String = "https://testapp.redimed.com.au"
    static let httpMeditek :String = "https://meditek.redimed.com.au"
    static let httpChien : String = "http://192.168.1.238"
}
struct ConfigurationSystem {
    static let http :String = httpUrl.httpChien
    static let Http_3009 :String = "\(http):3009"
    static let Http_3005 :String =  "\(http):3005"
    static let Http_3006 :String =  "\(http):3006"

    
    func validateInputOnlyNumber(value: Int) -> Bool {
        switch value {
        case Constants.numberHashValue.number0 :
            return true
        case Constants.numberHashValue.number1 :
            return true
        case Constants.numberHashValue.number2 :
            return true
        case Constants.numberHashValue.number3 :
            return true
        case Constants.numberHashValue.number4 :
            return true
        case Constants.numberHashValue.number5 :
            return true
        case Constants.numberHashValue.number6 :
            return true
        case Constants.numberHashValue.number7 :
            return true
        case Constants.numberHashValue.number8 :
            return true
        case Constants.numberHashValue.number9 :
            return true
        case Constants.numberHashValue.delete :
            return true
        default:
            return false
        }
    }
    func validateRegex(value: String,regex:String) -> Bool {
        
        let REGEX = regex
        
        let checkRegex = NSPredicate(format: "SELF MATCHES %@", REGEX)
        
        let result =  checkRegex.evaluateWithObject(value)
        
        return result
    }
    
    func borderTextFieldValid(textField:DesignableTextField,color:UIColor){
        textField.layer.borderColor = color.CGColor
        textField.layer.borderWidth = 1
        textField.cornerRadius = 4
    }
}



