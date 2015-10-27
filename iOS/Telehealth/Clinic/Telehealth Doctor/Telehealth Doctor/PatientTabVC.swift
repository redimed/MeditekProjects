//
//  PatientTabVC.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 10/19/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit

class PatientTabVC: UIViewController {
    
    @IBOutlet var dataPatient: [UILabel]!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let patient = SingleTon.detailAppointMentObj["Patients"][0]
        if patient.count != 0 {
            for aLabel : UILabel in dataPatient {
                let currTextLabel : String! = aLabel.text
                for var i = 0; i < patient.count; i++ {
                    aLabel.text = patient[currTextLabel].stringValue
                    if currTextLabel == "DOB" {
                        let dateFormatter = NSDateFormatter()
                        dateFormatter.timeZone = NSTimeZone(name: "UTC")
                        dateFormatter.dateFormat = "yyyy-MM-dd' 'HH:mm:ss"
                        if let datePublished = dateFormatter.dateFromString(patient[currTextLabel].stringValue) {
                            dateFormatter.dateFormat = "MMM dd, yyyy"
                            let dateFormated = dateFormatter.stringFromDate(datePublished)
                            aLabel.text = dateFormated
                        }
                    } else if currTextLabel == "PhoneNumber" {
                        aLabel.text = patient["UserAccount"][currTextLabel].stringValue
                    }
                    if aLabel.text != nil && !aLabel.text!.isEmpty {
                        let border = CALayer()
                        let width = CGFloat(1.0)
                        border.borderColor = UIColor.blackColor().CGColor
                        border.frame = CGRect(x: 0, y: aLabel.frame.size.height - width, width:  aLabel.frame.size.width, height: width)
                        border.borderWidth = 0.5
                        aLabel.layer.addSublayer(border)
                        aLabel.layer.masksToBounds = true
                    }
                    
                }
            }
        }
    }
    
    override func viewWillAppear(animated: Bool) {
        
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
}
