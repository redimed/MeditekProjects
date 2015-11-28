//
//  ModalFilterVC.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 11/25/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit

class ModalFilterVC: UIViewController {
    
    @IBOutlet weak var aptFrom: UITextField!
    @IBOutlet weak var aptTo: UITextField!
    var tagTxtField: Int!
    let datePickerView:UIDatePicker = UIDatePicker()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        let tap: UITapGestureRecognizer = UITapGestureRecognizer.init(target: self, action: "dismissTextField")
        self.view.addGestureRecognizer(tap)
        aptFrom.becomeFirstResponder()
    }
    
    func dismissTextField() {
        aptFrom.resignFirstResponder()
        aptTo.resignFirstResponder()
        
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    @IBAction func textFieldEndEditing(sender: AnyObject) {
        aptFrom.resignFirstResponder()
    }
    
    @IBAction func textFieldEditing(sender: UITextField) {
        tagTxtField = sender.tag
        datePickerView.datePickerMode = UIDatePickerMode.DateAndTime
        sender.inputView = datePickerView
        datePickerView.addTarget(self, action: Selector("datePickerValueChanged:"), forControlEvents: UIControlEvents.ValueChanged)
    }
    
    func datePickerValueChanged(datePicker: UIDatePicker) {
        let dateFormatter = NSDateFormatter()
        dateFormatter.dateStyle = NSDateFormatterStyle.ShortStyle
        dateFormatter.timeStyle = NSDateFormatterStyle.ShortStyle
        let strDateTime = dateFormatter.stringFromDate(datePicker.date)
        if tagTxtField == 100 {
            aptFrom.text = strDateTime
        } else {
            aptTo.text = strDateTime
        }
    }
}
