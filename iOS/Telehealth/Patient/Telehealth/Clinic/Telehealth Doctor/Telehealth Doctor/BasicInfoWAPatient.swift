//
//  BasicInfoWAPatient.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 11/6/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import SwiftyJSON

class BasicInfoWAPatient: UIViewController {
    
    var patient: JSON!
    var patientAppointment: JSON!
    @IBOutlet var aLabel: [UILabel]!
    @IBOutlet var chkCollect: [UIButton]!
    
    override func viewDidLoad() {
        patient = SingleTon.detailAppointMentObj["Patients"][0]
        patientAppointment = SingleTon.detailAppointMentObj["TelehealthAppointment"]["PatientAppointment"]
        super.viewDidLoad()
        
        loadData()
    }
    
    func loadData() {
        for aLabel: UILabel in self.aLabel {
            
            let titleLabel: String! = aLabel.text
            
            for var i = 0; i < patient.count; ++i {
                if patient[titleLabel].stringValue.isEmpty {
                    
                } else {
                    aLabel.text = patient[titleLabel].stringValue
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
            
            for var i = 0; i < patient.count; ++i {
                aLabel.text = patient[titleLabel].stringValue
            }
            
            if aLabel.tag == 100 {
                aLabel.text = patientAppointment["InterpreterLanguage"].stringValue
            } else if aLabel.tag == 101 {
                aLabel.text = patientAppointment["OtherSpecialNeed"].stringValue
            }
        }
        
        for button in chkCollect {
            let titleButton = button.titleLabel?.text
            
            guard let nameIndigenous: String = patientAppointment["Indigenous"].stringValue, let interRequired: String = patientAppointment["InterpreterRequired"].stringValue else {
                print("Not read data Indigenous and InterpreterRequired")
                return
            }
            nameIndigenous == titleButton ? button.setImage(UIImage(named: "checked"), forState: .Normal) : button.setImage(UIImage(named: "check"), forState: .Normal)
            
            interRequired == "Y" && button.tag == 12 ? button.setBackgroundImage(UIImage(named: "checked"), forState: UIControlState.Normal) :             interRequired == "N" && button.tag == 13 ? button.setBackgroundImage(UIImage(named: "checked"), forState: UIControlState.Normal) : button.setBackgroundImage(UIImage(named: "check"), forState: UIControlState.Normal)
        }
        
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
}
