//
//  Referral InformationVC.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 11/9/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import SwiftyJSON

class Referral_InformationVC: UIViewController {
    
    @IBOutlet var labelOut: [UILabel]!
    var WAApt: JSON!
    var TELEApt: JSON!
    
    @IBOutlet var chkOutlet: [UIButton]!
    override func viewDidLoad() {
        super.viewDidLoad()
        WAApt = SingleTon.detailAppointMentObj["TelehealthAppointment"]["WAAppointment"]
        TELEApt = SingleTon.detailAppointMentObj["TelehealthAppointment"]
        loadData()
    }
    
    func loadData() {
        for label in labelOut {
            let lblTitle: String! = label.text
            
            label.text = WAApt[lblTitle].stringValue
            
            if label.text != nil && !label.text!.isEmpty {
                let border = CALayer()
                let width = CGFloat(1.0)
                border.borderColor = UIColor.blackColor().CGColor
                border.frame = CGRect(x: 0, y: label.frame.size.height - width, width:  label.frame.size.width, height: width)
                border.borderWidth = 0.5
                label.layer.addSublayer(border)
                label.layer.masksToBounds = true
            }
        }
        
        for button in chkOutlet {
            let btnTitle = button.titleLabel?.text
            
            guard let injuryType: String = WAApt["InjuryType"].stringValue else {
                print("Not read data InjuryType")
                return
            }
            
            injuryType == btnTitle ? button.setImage(UIImage(named: "checked"), forState: .Normal) : button.setImage(UIImage(named: "check"), forState: .Normal)
            
            if let resultJson: String = WAApt[btnTitle!].stringValue {
                if resultJson == "Y" && button.tag >= 50 {
                    button.setImage(UIImage(named: "checked"), forState: .Normal)
                } else if resultJson == "N" && button.tag <= 30 {
                    button.setImage(UIImage(named: "checked"), forState: .Normal)
                } else if button.tag >= 60 {
                    if button.titleLabel?.text == TELEApt["RefDurationOfReferral"].stringValue {
                        button.setImage(UIImage(named: "checked"), forState: .Normal)
                    }
                }
            }
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
}
