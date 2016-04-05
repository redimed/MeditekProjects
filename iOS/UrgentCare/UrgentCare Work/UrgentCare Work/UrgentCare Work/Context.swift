//
//  Context.swift
//  UrgentCare Work
//
//  Created by Meditek on 3/28/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import Foundation
var cookies :String = String()
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
        }else if(ErrorType == "Policies.isAuthenticated.Error" ){
            NSNotificationCenter.defaultCenter().postNotificationName(Define.LogoutFunction, object: self)
            message = "Please login again !"
        }
        return message
    }
    class func getDeviceID() -> String {
        let defaults = NSUserDefaults.standardUserDefaults()
        let deviceId = defaults.valueForKey("deviceID") as? String
        return deviceId!
    }
    
    class func getAppID() -> String {
        let appid =  NSBundle.mainBundle().bundleIdentifier!
        return appid
    }
    class func getCookie() -> String {
        let Cookie = ""
        return Cookie
    }
    class func setToken(tokenString : String) -> Void {
        let preferences = NSUserDefaults.standardUserDefaults()
        preferences.setObject(tokenString,forKey: "token")
        preferences.synchronize()
    }
    class func deleteToken() -> Void {
        let preferences = NSUserDefaults.standardUserDefaults()
        preferences.removeObjectForKey("token")
        preferences.synchronize()
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
    class func getToken() -> String {
        if (NSUserDefaults.standardUserDefaults().objectForKey("token") == nil){
            return ""
        }
        return NSUserDefaults.standardUserDefaults().objectForKey("token") as! String
    }
    
}
