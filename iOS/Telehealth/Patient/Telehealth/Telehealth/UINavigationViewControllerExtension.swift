//
//  UINavigationViewController+Customize.swift
//  AppPromotion
//
//  Created by IosDeveloper on 26/10/15.
//  Copyright © 2015 Trung.vu. All rights reserved.
//

import Foundation
import UIKit

extension UINavigationController {

    func pushViewControllerCustomize(viewController: UIViewController, animate:Bool)
    {
        self.pushViewController(viewController, animated: animate)
        NSLog("%@", "Custome Navi")
        
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
    
    
}

