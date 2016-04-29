//
//  BaseViewController.swift
//  Telehealth
//
//  Created by Meditek on 3/11/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit

class BaseViewController: UIViewController,DTAlertViewDelegate,UITextFieldDelegate {
    
    var alertView = UIAlertView()
    var alertDTAlertView: DTAlertView!
    let delay = 0.5 * Double(NSEC_PER_SEC)

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    func addDoneButtontextView(textView:UITextView) {
        let keyboardToolbar = UIToolbar()
        keyboardToolbar.sizeToFit()
        let flexBarButton = UIBarButtonItem(barButtonSystemItem: .FlexibleSpace,
            target: nil, action: nil)
        let doneBarButton = UIBarButtonItem(barButtonSystemItem: .Done,
            target: view, action: #selector(UIView.endEditing(_:)))
        keyboardToolbar.items = [flexBarButton, doneBarButton]
        textView.inputAccessoryView = keyboardToolbar
    }
    
    func addDoneButton(textField:UITextField) {
        let keyboardToolbar = UIToolbar()
        keyboardToolbar.sizeToFit()
        let flexBarButton = UIBarButtonItem(barButtonSystemItem: .FlexibleSpace,
            target: nil, action: nil)
        let doneBarButton = UIBarButtonItem(barButtonSystemItem: .Done,
            target: view, action: #selector(UIView.endEditing(_:)))
        keyboardToolbar.items = [flexBarButton, doneBarButton]
        textField.inputAccessoryView = keyboardToolbar
    }
    //MARK: - deletate DT ALERT
    func willPresentDTAlertView(alertView: DTAlertView) {
        NSLog("%@", "will present")
    }
    func didPresentDTAlertView(alertView: DTAlertView) {
        NSLog("%@", "Did present")
    }
    func DTAlertViewWillDismiss(alertView: DTAlertView) {
        NSLog("%@", "Will Dismiss")
    }
    func DTAlertViewDidDismiss(alertView: DTAlertView) {
        NSLog("%@", "did Dismiss")
    }
    func showAlertWithMessageTitle(message: String, title: String, alertStyle: DTAlertStyle){
        self.alertDTAlertView = DTAlertView(alertStyle: alertStyle, message: message, title: title, object: self)
        self.alertDTAlertView.show()
    }


}
