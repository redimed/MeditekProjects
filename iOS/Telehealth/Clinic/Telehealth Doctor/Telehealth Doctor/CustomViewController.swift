//
//  CustomViewController.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 9/28/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import Socket_IO_Client_Swift

class CustomViewController {
    
    /// color button login check
    let colorButtonLoginEnable : UIColor = UIColor(red: 0/255, green: 55/255, blue: 102/255, alpha: 1)
    let colorButtonLoginDisable : UIColor = UIColor(red: 0/255, green: 51/255, blue: 102/255, alpha: 0.65)
    
    /**
    set border bottom for uitextfield
    - parameter textField: UITextField Object
    */
    func TextFieldLogin(textField: UITextField!, active: Bool, imageTextField: UIImageView) {
        let bottomBorder = CALayer()
        bottomBorder.frame = CGRectMake(0.0, textField.frame.size.height - 1, textField.frame.size.width, 2.0);
        
        if(textField.tag == 1) {
            if(active) {
                bottomBorder.frame = CGRectMake(2.0, textField.frame.size.height - 1, textField.frame.size.width, 2.0);
                bottomBorder.backgroundColor = UIColor(hex: "336699").CGColor
                imageTextField.image = UIImage(named: "doctor-active")
            } else {
                bottomBorder.backgroundColor = UIColor.grayColor().CGColor
                imageTextField.image = UIImage(named: "doctor")
            }
        } else {
            if(active) {
                bottomBorder.frame = CGRectMake(2.0, textField.frame.size.height - 1, textField.frame.size.width, 2.0);
                bottomBorder.backgroundColor = UIColor(hex: "336699").CGColor
                imageTextField.image = UIImage(named: "lock-active")
            } else {
                bottomBorder.backgroundColor = UIColor.grayColor().CGColor
                imageTextField.image = UIImage(named: "lock")
            }
        }
        textField.layer.addSublayer(bottomBorder)
    }
    
    func BlurLayer(view: UIView!) -> Bool {
        view.backgroundColor = UIColor.clearColor()
        let blurEffect = UIBlurEffect(style: UIBlurEffectStyle.Light)
        let blurEffectView = UIVisualEffectView(effect: blurEffect)
        blurEffectView.frame = view.bounds
        view.addSubview(blurEffectView)
        
        return true
    }
}
