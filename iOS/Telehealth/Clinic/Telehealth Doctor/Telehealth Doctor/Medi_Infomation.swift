//
//  Medi_Infomation.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 11/16/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import SwiftyJSON

class Medi_Infomation: UIViewController {
    
    @IBOutlet var labelOutlet: [UILabel]!
    @IBOutlet var chkOutlet: [UIButton]!
    var patientAppointment: JSON!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        patientAppointment = SingleTon.detailAppointMentObj["TelehealthAppointment"]["PatientAppointment"]
        loadData()
    }
    
    func loadData() {
        for aLabel in labelOutlet {
            let tlLabel: String! = aLabel.text
            
            if tlLabel == "ExpiryDate" {
                let dateFormatter = NSDateFormatter()
                dateFormatter.timeZone = NSTimeZone(name: "UTC")
                dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.000Z"
                if let datePublished = dateFormatter.dateFromString(patientAppointment[tlLabel].stringValue) {
                    dateFormatter.dateFormat = "dd/MM/yyyy"
                    let dateFormated = dateFormatter.stringFromDate(datePublished)
                    dateFormatter.timeZone = NSTimeZone(name: "UTC")
                    aLabel.text = dateFormated
                }
                
            } else {
                aLabel.text = patientAppointment[tlLabel].stringValue
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
        
        for button in chkOutlet {
            
            guard let medicareEligible: String = patientAppointment["MedicareEligible"].stringValue else {
                print("Not read data MedicareEligible")
                return
            }
            
            medicareEligible == "Y" && button.tag == 10 ? button.setBackgroundImage(UIImage(named: "checked"), forState: UIControlState.Normal) :             medicareEligible == "N" && button.tag == 11 ? button.setBackgroundImage(UIImage(named: "checked"), forState: UIControlState.Normal) : button.setBackgroundImage(UIImage(named: "check"), forState: UIControlState.Normal)
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
}
