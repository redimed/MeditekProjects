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
        print(patient.count)
        let bottomBorder = CALayer()
        bottomBorder.backgroundColor = UIColor.blackColor().CGColor
        for aLabel : UILabel in dataPatient {
            let currTextLabel : String! = aLabel.text
            bottomBorder.frame = CGRectMake(0.0, aLabel.frame.height - 1, aLabel.frame.size.width, 0.5)
            print(bottomBorder.frame)
            aLabel.layer.addSublayer(bottomBorder)
            for var i = 0; i < patient.count; i++ {
                aLabel.text = patient[currTextLabel].stringValue
            }
        }
    }
    
    override func viewWillAppear(animated: Bool) {
        
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
}
