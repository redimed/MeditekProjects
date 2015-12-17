//
//  ModalFilterVC.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 11/25/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import SwiftyJSON

class ModalFilterVC: UIViewController, UIPickerViewDataSource, UIPickerViewDelegate {
    
    @IBOutlet weak var aptFrom: UITextField!
    @IBOutlet weak var aptTo: UITextField!
    @IBOutlet weak var statusAptTextField: UITextField!
    
    var tagTxtField: Int!
    let datePickerView:UIDatePicker = UIDatePicker()
    
    let pickerData = ["Received", "Appointment Pending", "Appointment Time", "Attended",
        "Wait List Surgery", "Finish"]
    
    override func viewDidLoad() {
        super.viewDidLoad()
        let tap: UITapGestureRecognizer = UITapGestureRecognizer.init(target: self, action: "dismissTextField")
        self.view.addGestureRecognizer(tap)
        aptFrom.becomeFirstResponder()
        
        
        let pickerView = UIPickerView.init()
        pickerView.delegate = self
        pickerView.dataSource = self
        self.statusAptTextField.inputView = pickerView
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
        datePickerView.datePickerMode = UIDatePickerMode.Date
        sender.inputView = datePickerView
        datePickerView.addTarget(self, action: Selector("datePickerValueChanged:"), forControlEvents: UIControlEvents.ValueChanged)
    }
    
    func datePickerValueChanged(datePicker: UIDatePicker) {
        let dateFormatter = NSDateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd"
        let strDateTime = dateFormatter.stringFromDate(datePicker.date)
        if tagTxtField == 100 {
            aptFrom.text = strDateTime
        } else {
            aptTo.text = strDateTime
        }
    }
    
    func paramFilter(dataFilter:[String: String], completion: ((result: [String: String]) -> Void)?) {
        let fromtime = dataFilter["aptFrom"] == "" ? "" : "\(dataFilter["aptFrom"]! as String) \(getReFormat().timeZone)"
        let totime = dataFilter["aptTo"] == "" ? "" : "\(dataFilter["aptTo"]! as String) \(getReFormat().timeZone)"
        let data = ["aptFrom": fromtime, "aptTo": totime]
        completion!(result: data)
    }
    
    @IBAction func backToList(sender: AnyObject) {
        let txtData = ["aptFrom": aptFrom.text!, "aptTo": aptTo.text!]
        paramFilter(txtData) { (res) -> Void in
            
            if res["aptFrom"]?.characters.count > 0 || res["aptTo"]?.characters.count > 0 {
                NSNotificationCenter.defaultCenter().postNotificationName("reloadDataTable", object: self, userInfo: ["data": res])
            }
            
            self.dismissViewControllerAnimated(true, completion: nil)
        }
    }
    
    func numberOfComponentsInPickerView(pickerView: UIPickerView) -> Int {
        return 1
    }
    
    func pickerView(pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        return pickerData.count
    }
    
    func pickerView(pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
        return pickerData[row]
    }
}
