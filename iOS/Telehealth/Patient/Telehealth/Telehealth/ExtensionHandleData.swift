//
//  ExtensionHandleData.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 10/12/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import Foundation
import SystemConfiguration
import SwiftyJSON
import Alamofire
//Extension Handle
extension String
{
    func toDateTimeZone(time:String,format:String) -> String
    {
        
        let dateFormatter = NSDateFormatter()
        dateFormatter.dateFormat = time//this your string date format
        dateFormatter.timeZone = NSTimeZone(name: "UTC")
        let date = dateFormatter.dateFromString(self)
        
        dateFormatter.dateFormat = format///this is you want to convert format
        dateFormatter.timeZone = NSTimeZone(name: "UTC")
        let timeStamp = dateFormatter.stringFromDate(date!)
        //Return Parsed Date
        return String(timeStamp)
    }

    //Change format Male or Female
    func toGender() -> String
    {
        var gender = String()
        if self == "F" {
            gender = "Female"
        }else {
            gender = "Male"
        }
        return gender
    }
    
    
  
}

extension UIApplication {
    //get version info
    func applicationVersion() -> String {
        
        return NSBundle.mainBundle().objectForInfoDictionaryKey("CFBundleShortVersionString") as! String
    }
    //get build info
    func applicationBuild() -> String {
        
        return NSBundle.mainBundle().objectForInfoDictionaryKey(kCFBundleVersionKey as String) as! String
    }
    //Get version and buid
    func versionBuild() -> String {
        
        let version = self.applicationVersion()
        let build = self.applicationBuild()
        
        return "v\(version)(\(build))"
    }
    func bundleID() -> String{
        let bundleIdentifier = NSBundle.mainBundle().bundleIdentifier
        return bundleIdentifier!
    }
    
    
    func isConnectedToNetwork() -> Bool {
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
