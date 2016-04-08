//
//  Define.swift
//  AppPromotion
//
//  Created by IosDeveloper on 29/09/15.
//  Copyright (c) 2015 Trung.vu. All rights reserved.
//


import Foundation
import UIKit

class Define: NSObject {
    
    static let appDelegate = UIApplication.sharedApplication().delegate as! AppDelegate
    static let versionBuild = "UIApplication.sharedApplication().versionBuild()"
    
    
    static let storyboardHome = UIStoryboard(name: "Home", bundle: nil)
    
    // api Key google
    static let kGoogleMapAPIiOSKey = "AIzaSyBwaTicbxV4hr1K49YDnHFPQZlf6Bolj48"
    static let kGoogleMapAPIServerKey = "AIzaSyDxAGN7lH46zvPedRH9QrCOtvYAWq2Gfc4"
    
    static let myLocation = "myLocation"
    static let LogoutFunction = "LogoutFunction"
    struct keyNSDefaults {
        static let deviceID = "deviceID"
        static let appid = "appid"
        
        static let Authorization = "Authorization"
        static let userInfor = "userInfor"
        static let Cookie = "Cookie"
        static let userLogin = "userLogin"
        static let companyInfor = "companyInfor"
        static let UIDLogoutFail = "UIDLogoutFail"
        static let UID = "UID"
    }
    
    enum UIUserInterfaceIdiom : Int
    {
        case Unspecified
        case Phone
        case Pad
    }
    
    struct ScreenSize
    {
        static let SCREEN_WIDTH         = UIScreen.mainScreen().bounds.size.width
        static let SCREEN_HEIGHT        = UIScreen.mainScreen().bounds.size.height
        static let SCREEN_MAX_LENGTH    = max(ScreenSize.SCREEN_WIDTH, ScreenSize.SCREEN_HEIGHT)
        static let SCREEN_MIN_LENGTH    = min(ScreenSize.SCREEN_WIDTH, ScreenSize.SCREEN_HEIGHT)
        static var RATIO_WIDTH          = (DeviceType.IS_IPHONE_5 ? 1.0 : ScreenSize.SCREEN_WIDTH /  320)
        static var RATIO_HEIGHT         = (DeviceType.IS_IPHONE_5 ? 1.0 : ScreenSize.SCREEN_WIDTH /  568)
        static var FONT_SCALE_IPHONE6S  = (DeviceType.IS_IPHONE_6P ? 1.27 : (DeviceType.IS_IPHONE_6 ? 1.15 : 1))
    }
    
    struct DeviceType
    {
        static let IS_IPHONE_4_OR_LESS  = UIDevice.currentDevice().userInterfaceIdiom == .Phone && ScreenSize.SCREEN_MAX_LENGTH < 568.0
        static let IS_IPHONE_5          = UIDevice.currentDevice().userInterfaceIdiom == .Phone && ScreenSize.SCREEN_MAX_LENGTH == 568.0
        static let IS_IPHONE_6          = UIDevice.currentDevice().userInterfaceIdiom == .Phone && ScreenSize.SCREEN_MAX_LENGTH == 667.0
        static let IS_IPHONE_6P         = UIDevice.currentDevice().userInterfaceIdiom == .Phone && ScreenSize.SCREEN_MAX_LENGTH == 736.0
        static let IS_IPAD              = UIDevice.currentDevice().userInterfaceIdiom == .Pad && ScreenSize.SCREEN_MAX_LENGTH == 1024.0
    }
    
    struct Version{
        static let SYS_VERSION_FLOAT = (UIDevice.currentDevice().systemVersion as NSString).floatValue
        static let iOS7 = (Version.SYS_VERSION_FLOAT < 8.0 && Version.SYS_VERSION_FLOAT >= 7.0)
        static let iOS8 = (Version.SYS_VERSION_FLOAT >= 8.0 && Version.SYS_VERSION_FLOAT < 9.0)
        static let iOS9 = (Version.SYS_VERSION_FLOAT >= 9.0 && Version.SYS_VERSION_FLOAT < 10.0)
    }
}
