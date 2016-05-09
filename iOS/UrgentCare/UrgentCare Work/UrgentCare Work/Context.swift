//
//  Context.swift
//  UrgentCare Work
//
//  Created by Meditek on 3/28/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import Foundation
import SystemConfiguration
var cookies :String = String()
import UIKit

struct FAIcon {
    static let volume_off : String = "\u{f026}"
    static let volume_up : String = "\u{f028}"
    static let pause : String = "\u{f04c}"
    static let play : String = "\u{f04b}"
    static let fa_close : String = "\u{f00d}"
    static let microphone_on : String = "\u{f130}"
    static let microphone_off : String = "\u{f131}"
    
}
class Context {
    class func getTokenHeader() -> [String : String]{
        if (NSUserDefaults.standardUserDefaults().objectForKey("token") == nil){
            return ["x-access-token" : ""]
        }
        return["x-access-token" : (NSUserDefaults.standardUserDefaults().objectForKey("token") as! String),]
        
    }
    
    class func getHeader()->[String: String] {
        let defaults = NSUserDefaults.standardUserDefaults()
        let deviceId = defaults.valueForKey("deviceID") as? String
        let headers: [String: String] = [
            "content-type" : "application/json",
            "systemtype" : "IOS",
            "Cookie" : "",
            "deviceID": deviceId!,
            "appid": NSBundle.mainBundle().bundleIdentifier!
        ]
        return headers
    }
    
    class func getErrorMessage(ErrorType:String)->String {
        var message :String = ""
        if(ErrorType == "User.notFound"){
            message = "User Not Found !"
        }else if(ErrorType == "Password.Invalid"){
            message = "Password Invalid !"
        }else if(ErrorType == "DetailCompanyByUser.error"){
            message = "Detail Company By User Error"
        }else if(ErrorType == "UserActivation.Error"){
            message = "User Is Not Exist"
        }else if(ErrorType == "Activation.Error"){
            message = "Activation Code Invalid"
        }else if(ErrorType == "PinNumber.Invalid"){
            message = "Pin Number Invalid"
        }else if(ErrorType == "PinNumber.Expired"){
            message = "Pin Number Expired"
        }else if(ErrorType == "NotRegistered"){
            message = "Not Registered "
        }else if(ErrorType == "GetListStaff.error"){
            message = "User is Not Admin"
        }else if(ErrorType == "Policies.isAuthenticated.Error" ){
            NSNotificationCenter.defaultCenter().postNotificationName(Define.LogoutFunction, object: self)
            message = "Please login again !"
        }
        return message
    }
    
    class func getAppID() -> String {
        let appid =  NSBundle.mainBundle().bundleIdentifier!
        return appid
    }
    
    class func setDataDefaults(data :AnyObject, key:String) {
        let defaults = NSUserDefaults.standardUserDefaults()
        defaults.setObject(data, forKey: key)
        defaults.synchronize()
    }
    
    class func deleteDatDefaults(key:String) -> Void {
        let preferences = NSUserDefaults.standardUserDefaults()
        preferences.removeObjectForKey(key)
        preferences.synchronize()
    }
    
    class func getDataDefasults(key:String)->AnyObject{
        if (NSUserDefaults.standardUserDefaults().objectForKey(key) == nil){
            return ""
        }
        return NSUserDefaults.standardUserDefaults().objectForKey(key)! as AnyObject
    }
    
    class func NowDate()->String{
        let nowdate = NSDate()
        var DateString:String = ""
        let dateFormatter = NSDateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd HH:mm:ss Z"
        DateString = dateFormatter.stringFromDate(nowdate)
        return DateString
    }
    
    class func isConnectedToNetwork() -> Bool {
        
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
    
    //Check date
    class func compareDate(dateDOB:NSDate)->Bool {
        let now = NSDate()
        if now.compare(dateDOB) == NSComparisonResult.OrderedDescending
        {
            return true
        } else
        {
            return false
        }
    }
    
    //check validate
    class func validatePhoneNumber(value: String,regex:String) -> Bool {
        
        let PHONE_REGEX = regex
        let phoneTest = NSPredicate(format: "SELF MATCHES %@", PHONE_REGEX)
        let result =  phoneTest.evaluateWithObject(value)
        
        return result
        
    }
    class func checkMaxLength(textField:UITextField,length:Int)->Bool{
        if textField.text?.characters.count > length {
            return false
        }else{
            return true
        }
    }

}
