//
//  UIAlertViewExtension.swift
//  UrgentCare Work
//
//  Created by Meditek on 3/28/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import Foundation
import UIKit

extension UIAlertView {
    func alertMessage(title:String,message:String){
        if(message != ""){
            let alert = UIAlertView()
            alert.title = title
            alert.message = message
            alert.addButtonWithTitle("OK")
            alert.show()
        }
    }
}