//
//  BasicInfomation.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 10/17/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import SwiftyJSON

class Appointment: UIViewController {
    
    @IBOutlet var label: [UILabel]!
    @IBOutlet var checkBoxBtn: [UIButton]!
    
    var fullName: String!
    var fund: String!
    var patient: JSON!
    var teleAppoint: JSON!
    var appointment: JSON!
    var appointTime: NSArray!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        patient = SingleTon.detailAppointMentObj["Patients"][0]
        teleAppoint = SingleTon.detailAppointMentObj["TelehealthAppointment"]
        appointment = SingleTon.detailAppointMentObj
        
        fullName =  patient["FirstName"].stringValue + " " + patient["MiddleName"].stringValue + " " + patient["LastName"].stringValue
        fund = SingleTon.detailAppointMentObj["TelehealthAppointment"]["Fund"].stringValue
        
        var fileUploads = SingleTon.detailAppointMentObj["FileUploads"]
        
        SingleTon.imgDataMedical = []        
        for var i = 0; i < fileUploads.count; ++i {
            let uid = fileUploads[i]["UID"].stringValue
            if let url = NSURL(string: "\(DOWNLOAD_IMAGE_APPOINTMENT)\(uid)") {
                if let data = NSData(contentsOfURL: url){
                    SingleTon.imgDataMedical.append(data)
                }
            }
        }
        
        loadData()
    }
    
    func loadData() {
        for aLabel: UILabel in label {
            
            let titleLabel: String! = aLabel.text
            
            for (key,_) in appointment {
                if key == "FromTime" {
                    appointTime = formatString(appointment[titleLabel].stringValue).componentsSeparatedByString("at")
                }
            }
            
            for var i = 0; i < appointment.count; ++i {
                switch aLabel.tag {
                case 10:
                    aLabel.text = fullName
                case 11:
                    aLabel.text = appointment["TelehealthAppointment"]["Fund"].stringValue
                case 12:
                    aLabel.text = formatString(appointment[titleLabel].stringValue)
                case 13:
                    aLabel.text = appointTime[0].stringValue
                case 14:
                    aLabel.text = appointTime[1].stringValue
                case 15:
                    aLabel.text = appointment["TelehealthAppointment"][titleLabel].stringValue
                case 16:
                    aLabel.text = appointment["TelehealthAppointment"][titleLabel].stringValue
                default:
                    aLabel.text = appointment[titleLabel].stringValue
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
        
        for button: UIButton in checkBoxBtn {
            let textButton: String! = button.titleLabel!.text
            for var i = 0; i < teleAppoint.count; ++i {
                switch button.tag {
                case 0:
                    if let check: String = teleAppoint["ExaminationRequired"][textButton].stringValue {
                        if check == "Y" {
                            button.setImage(UIImage(named: "checked"), forState: UIControlState.Normal)
                        }
                    }
                case 1:
                    let preferedPlastic = teleAppoint["PreferredPractitioners"]
                    for var i = 0; i < preferedPlastic.count; ++i {
                        if let check: String = preferedPlastic[i]["Name"].stringValue {
                            if check == textButton {
                                button.setImage(UIImage(named: "checked"), forState: UIControlState.Normal)
                            }
                        }
                    }
                default:
                    if let check: String = teleAppoint[textButton].stringValue {
                        if check == "Y" {
                            button.setImage(UIImage(named: "checked"), forState: UIControlState.Normal)
                        }
                    }
                }
            }
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
}
