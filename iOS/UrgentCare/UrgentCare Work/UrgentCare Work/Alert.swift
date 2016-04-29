//
//  Alert.swift
//  VgoUserApp
//
//  Created by admin on 07/02/16.
//  Copyright © 2016 Trung.Vu. All rights reserved.
//

import UIKit

class Alert {
    
    // show alert with param
    class func alert(viewController: BaseViewController, message: String, title: String, alertStyle: DTAlertStyle){
        let alertView = DTAlertView(alertStyle: alertStyle, message: message, title: title, object: viewController)
        alertView.show()
    }
    // show alert error style
    class func alert(viewController: BaseViewController, message: String, title: String, alertStyle: DTAlertErrorStyle){
        let alertView = DTAlertView(alertStyle: alertStyle, message: message, title: title, object: viewController)
        alertView.show()
    }
}
