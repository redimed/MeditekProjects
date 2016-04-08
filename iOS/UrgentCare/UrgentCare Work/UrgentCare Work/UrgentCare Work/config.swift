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

struct model{
    static let firstName = "firstName"
    static let lastName = "lastName"
    static let phonenumber = "phonenumber"
    static let email = "email"
    static let DOB = "DOB"
    static let suburb = "suburb"
}

struct messageString {
    static let SubmitInjurySuccess = "Please be informed that your enquiry has been received and our Redimed staff will contact you shortly."
    static let invalidParams = "Invalid field please check your information!"
    static let serverErr = "Server Error!"
}

struct MessageString  {
    static let CallAnswer : String = "answer"
    static let CallEndCall : String = "end"
    static let Decline : String = "decline"
    static let Call : String = "call"
    static let Cancel : String = "cancel"
    static let VersionAndBuild : String = "© REDIMED 2015 \(Define.versionBuild) – App Design by Meditek"
    static let QuestionCallPhone : String = "You want to contact us?"
    static let MessageLogout : String = "Do you want to logout the system?"
    static let StringHealthCare:String = "Personalised + Customised, HEALTHCARE anywhere"
    static let phoneNumberCallUs : String = "tel://0892300900"
    static let savedPictureMessage : String = "Your picture was saved to Camera Roll"
    static let placeHolderDescription : String = "Description of injury"
}

struct ConfigurationSystem {
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



