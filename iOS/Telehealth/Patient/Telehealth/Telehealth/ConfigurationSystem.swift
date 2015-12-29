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


let config  = ConfigurationSystem()
var savedData  = saveData()
let defaults = NSUserDefaults.standardUserDefaults()
var tokens :String = String()
var userUID :String = String()
var cookies :String = String()
var PatientInfo : Patient!
let phoneNumberCallUs : String = "0892300900"
var statusCallingNotification : String = String()
var EnterBackground : Bool = false

//var deviceID = String()
struct ConfigurationSystem {
    static let http :String = "http://telehealthvietnam.com.vn"
    
    static let Http_3009 :String = "\(http):3009"
    static let Http_3005 :String =  "\(http):3005"
    static let Http_3006 :String =  "\(http):3006"
    
    

    //change border color textfield
    func borderTextFieldValid(textField:DesignableTextField,color:UIColor){
        textField.layer.borderColor = color.CGColor
        textField.layer.borderWidth = 1
        textField.cornerRadius = 4
    }
    
    func emitDataToServer(message:String,uidFrom:String,uuidTo:String){
        let modifieldURLString = NSString(format: UrlAPISocket.emitAnswer,uidFrom,uuidTo,message) as String
        let dictionNary : NSDictionary = ["url": modifieldURLString]
        sharedSocket.socket.emit("get", dictionNary)
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






