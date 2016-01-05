//
//  ContactInfoWAPatient.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 11/6/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import SwiftyJSON

class ContactInfoWAPatient: UIViewController {
    
    @IBOutlet var labelOutlet: [UILabel]!
    var patient: JSON!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        patient = SingleTon.detailAppointMentObj["Patients"][0]
        loadData()
    }
    
    func loadData() {
        for aLabel in labelOutlet {
            let tlLabel: String! = aLabel.text
            
            switch aLabel.tag {
                
            case 10:
                aLabel.text = patient["UserAccount"]["PhoneNumber"].stringValue
            case 11:
                aLabel.text = get_val_State(patient[tlLabel].stringValue)
            default:
                aLabel.text = patient[tlLabel].stringValue
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
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
}
