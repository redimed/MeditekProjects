//
//  ClinicalMedical.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 10/17/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit

class ClinicalMedical: UIViewController {
    
    @IBOutlet var buttonCollect: [UIButton]!
    @IBOutlet var textFieldCollect: [UITextField]!
    @IBOutlet var textView: UITextView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        let clinicalDetails = SingleTon.detailAppointMentObj["TelehealthAppointment"]["ClinicalDetails"]
        
        for button: UIButton in buttonCollect {
            if let textBtn: String! = button.titleLabel!.text {
                for var i=0; i<clinicalDetails.count; ++i {
                    if let typeClinical: String! = clinicalDetails[i]["Type"].stringValue {
                        switch typeClinical {
                        case "Trauma":
                            if let nameClinical: String! = clinicalDetails[i]["Name"].stringValue {
                                if nameClinical == textBtn {
                                    button.setBackgroundImage(UIImage(named: "checked"), forState: UIControlState.Normal)
                                    if nameClinical == "Fracture" {
                                        for textField: UITextField in textFieldCollect {
                                            switch textField.tag {
                                            case 10:
                                                textField.text = clinicalDetails[i]["Value"].stringValue
                                            default:
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                            
                        case "Lacerations":
                            if let nameClinical: String! = clinicalDetails[i]["Name"].stringValue {
                                if nameClinical == textBtn {
                                    if nameClinical != "Others" {
                                        button.setBackgroundImage(UIImage(named: "checked"), forState: UIControlState.Normal)
                                    } else {
                                        if let valueOther: String! = clinicalDetails[i]["Value"].stringValue where !clinicalDetails[i]["Value"].stringValue.isEmpty {
                                            button.setBackgroundImage(UIImage(named: "checked"), forState: UIControlState.Normal)
                                            for textField: UITextField in textFieldCollect {
                                                switch textField.tag {
                                                case 11:
                                                    textField.text = clinicalDetails[i][valueOther].stringValue
                                                default:
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            
                        case "Skin cancer":
                            if let nameClinical: String! = clinicalDetails[i]["Name"].stringValue {
                                if nameClinical == textBtn {
                                    if nameClinical != "Other" {
                                        button.setBackgroundImage(UIImage(named: "checked"), forState: UIControlState.Normal)
                                    } else {
                                        if let valueOther: String! = clinicalDetails[i]["Value"].stringValue where !clinicalDetails[i]["Value"].stringValue.isEmpty {
                                            button.setBackgroundImage(UIImage(named: "checked"), forState: UIControlState.Normal)
                                            for textField: UITextField in textFieldCollect {
                                                switch textField.tag {
                                                case 11:
                                                    textField.text = clinicalDetails[i][valueOther].stringValue
                                                default:
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        case "Hand Condition":
                            if let nameClinical: String! = clinicalDetails[i]["Name"].stringValue {
                                if nameClinical == textBtn {
                                    button.setBackgroundImage(UIImage(named: "checked"), forState: UIControlState.Normal)
                                }
                            }
                            
                        case "PNS":
                            if let nameClinical: String! = clinicalDetails[i]["Name"].stringValue {
                                if nameClinical == textBtn {
                                    if nameClinical != "Other" {
                                        button.setBackgroundImage(UIImage(named: "checked"), forState: UIControlState.Normal)
                                    } else {
                                        if let valueOther: String! = clinicalDetails[i]["Value"].stringValue where !clinicalDetails[i]["Value"].stringValue.isEmpty {
                                            button.setBackgroundImage(UIImage(named: "checked"), forState: UIControlState.Normal)
                                            for textField: UITextField in textFieldCollect {
                                                switch textField.tag {
                                                case 11:
                                                    textField.text = clinicalDetails[i][valueOther].stringValue
                                                default:
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        default:
                            break
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
