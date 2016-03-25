//
//  Utilities.swift
//  VgoUserApp
//
//  Created by admin on 31/01/16.
//  Copyright © 2016 Trung.Vu. All rights reserved.
//

import UIKit

class Utility {
    class var sharedInstance: Utility {
        struct Static {
            static var onceToken: dispatch_once_t = 0
            static var instance: Utility? = nil
        }
        dispatch_once(&Static.onceToken) {
            Static.instance = Utility()
        }
        return Static.instance!
    }
    class func getTopViewController()-> BaseViewController? {
        if let adelegate : AppDelegate = UIApplication.sharedApplication().delegate as? AppDelegate {
            if let nvc: UINavigationController = adelegate.window?.rootViewController as? UINavigationController {
                return nvc.topViewController as? BaseViewController
            } else {
                return adelegate.window?.rootViewController as! BaseViewController?
            }
        }
        return nil
    }
    
}
