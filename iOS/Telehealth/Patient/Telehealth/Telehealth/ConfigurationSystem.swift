//
//  ConfigurationSystem.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/24/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit

var device : String?
let config = ConfigurationSystem()

class ConfigurationSystem: UIViewController {
    let Http = "http://192.168.1.130:3000"
   
    let deviceID = UIDevice.currentDevice().identifierForVendor?.UUIDString
  


    
    //create and start animation textfield
      func animationTexfield(textfield:DesignableTextField){
        textfield.animation = "shake"
        textfield.curve = "easeIn"
        textfield.force = 2.0
        textfield.duration = 0.5
        textfield.animate()
    }
    //change border color textfield
     func borderTextFieldValid(textField:DesignableTextField,color:UIColor){
        textField.layer.borderColor = color.CGColor
        textField.layer.borderWidth = 1
        textField.cornerRadius = 4
    }


}
