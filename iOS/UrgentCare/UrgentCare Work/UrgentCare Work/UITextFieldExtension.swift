//
//  UITextFieldExtension.swift
//  UrgentCare Work
//
//  Created by Meditek on 3/25/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import Foundation
import UIKit
extension UITextField {
    func addDoneButton(textField:UITextField) {
        let keyboardToolbar = UIToolbar()
        keyboardToolbar.sizeToFit()
        let flexBarButton = UIBarButtonItem(barButtonSystemItem: .FlexibleSpace,
                                            target: nil, action: nil)
        let doneBarButton = UIBarButtonItem(barButtonSystemItem: .Done,
                                            target: self, action: #selector(UIView.endEditing(_:)))
        keyboardToolbar.items = [flexBarButton, doneBarButton]
        textField.inputAccessoryView = keyboardToolbar
    }
    func textFiledOnlyLine(textField:UITextField){
        let border = CALayer()
        let width = CGFloat(1.0)
        border.borderColor = UIColor(hex: Define.ColorCustom.greenColor).CGColor
        border.frame = CGRect(x: 0, y: textField.frame.size.height - width, width:  1000, height: textField.frame.size.height)
        if(textField.placeholder != nil){
        textField.attributedPlaceholder = NSAttributedString(string: textField.placeholder!, attributes:[ NSForegroundColorAttributeName: UIColor(hex:Define.ColorCustom.placehoderColor)])
        }
        border.borderWidth = width
        textField.layer.addSublayer(border)
        textField.layer.masksToBounds = true
    }
    func txtError(textField:UITextField){
        let border = CALayer()
        let width = CGFloat(1.0)
        border.borderColor = UIColor.redColor().CGColor
        border.frame = CGRect(x: 0, y: textField.frame.size.height - width, width:  1000, height: textField.frame.size.height)
        if(textField.placeholder != nil){
            textField.attributedPlaceholder = NSAttributedString(string: textField.placeholder!, attributes:[ NSForegroundColorAttributeName: UIColor(hex:Define.ColorCustom.placehoderColor)])
        }
        border.borderWidth = width
        textField.layer.addSublayer(border)
        textField.layer.masksToBounds = true
    }
    
    func CheckTextFieldIsEmpty(textField:UITextField)->Bool{
        if textField.text!.isEmpty {
            textField.txtError(textField)
            return true
        }else{
            textField.textFiledOnlyLine(textField)
            return false
        }
    }

}