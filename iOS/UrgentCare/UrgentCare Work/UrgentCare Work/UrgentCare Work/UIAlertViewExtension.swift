//
//  UIAlertViewExtension.swift
//  UrgentCare Work
//
//  Created by Meditek on 3/28/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import Foundation
import UIKit

extension UIAlertView {
    func alertMessage(title:String,message:String){
        let alert = UIAlertView()
        alert.title = title
        alert.message = message
        alert.addButtonWithTitle("OK")
        alert.show()
    }
}