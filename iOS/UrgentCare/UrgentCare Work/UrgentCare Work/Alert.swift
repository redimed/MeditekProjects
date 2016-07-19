//
//  Alert.swift
//  UrgentCare Work
//
//  Created by Meditek on 7/13/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
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
