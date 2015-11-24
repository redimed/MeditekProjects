//
//  PathologyProviderVC.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 11/9/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import SwiftyJSON

class PathologyProviderVC: UIViewController {

    var WAApt: JSON!
    var cliniCalDetails: JSON!
    @IBOutlet weak var txtView: UITextView!
    @IBOutlet var lblCollect: [UILabel]!
    override func viewDidLoad() {
        super.viewDidLoad()
        WAApt = SingleTon.detailAppointMentObj["TelehealthAppointment"]["WAAppointment"]
        cliniCalDetails = SingleTon.detailAppointMentObj["TelehealthAppointment"]["ClinicalDetails"]
        loadData()
    }
    
    func loadData() {
        for label in lblCollect {
            let txtLbl = label.text!
            
            if let dataLbl: String = WAApt[txtLbl].stringValue {
                label.text = dataLbl
            }
            
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
        
        for var i = 0; i < cliniCalDetails.count; ++i {
            if cliniCalDetails[i]["Name"].stringValue == "OtherNotes" {
                if let data: String = cliniCalDetails[i]["Value"].stringValue {
                    txtView.text = data
                }
            }
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
}
