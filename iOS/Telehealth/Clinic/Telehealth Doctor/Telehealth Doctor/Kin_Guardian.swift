//
//  Kin_Guardian.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 11/9/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import SwiftyJSON

class Kin_Guardian: UIViewController {

    @IBOutlet var labelOutlet: [UILabel]!
    var patientAppointment: JSON!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        patientAppointment = SingleTon.detailAppointMentObj["TelehealthAppointment"]["PatientAppointment"]
        loadData()
    }
    
    func loadData() {
        for aLabel in labelOutlet {
            let tlLabel: String! = aLabel.text
             aLabel.text = patientAppointment[tlLabel].stringValue
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
