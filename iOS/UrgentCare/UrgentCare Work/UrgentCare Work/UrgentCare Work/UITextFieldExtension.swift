//
//  UITextFieldExtension.swift
//  UrgentCare Work
//
//  Created by Meditek on 3/25/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
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
            target: self, action: Selector("endEditing:"))
        keyboardToolbar.items = [flexBarButton, doneBarButton]
        textField.inputAccessoryView = keyboardToolbar
    }
}