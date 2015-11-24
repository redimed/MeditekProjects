//
//  ReasonforPresentingVC.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 11/9/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import SwiftyJSON

class ReasonforPresentingVC: UIViewController, UITableViewDelegate, UITableViewDataSource {
    
    @IBOutlet var chkSkinCancer: [UIButton]!
    @IBOutlet weak var textViewUI: UITextView!
    @IBOutlet weak var textFieldOther: UITextField!
    @IBOutlet weak var tableView: UITableView!
    
    @IBOutlet weak var textFileOtherPNS: UITextField!
    @IBOutlet var radioBtn: [UIButton]!
    var cliniCalDetails: JSON! = SingleTon.detailAppointMentObj["TelehealthAppointment"]["ClinicalDetails"]
    var fileUpload: JSON!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        dispatch_async(dispatch_get_main_queue()) { () -> Void in
            self.loadData()
        }
        tableView.tableFooterView = UIView(frame: CGRect.zero)
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        for var i = 0; i < cliniCalDetails.count; ++i {
            if cliniCalDetails[i]["Name"].stringValue == "referralPresenting" {
                if let dataTable: JSON = cliniCalDetails[i]["FileUploads"] {
                    if dataTable.count > 0 {
                        fileUpload = dataTable
                        return dataTable.count
                    }
                }
            }
        }
        return 0
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell: UITableViewCell = UITableViewCell.init(style: .Default, reuseIdentifier: "cell")
        cell.textLabel?.text = fileUpload[0]["FileName"].stringValue
        return cell
    }
    
    func loadData() {
        for button in chkSkinCancer {
            let btnTitle = button.titleLabel!.text
            for var i = 0; i < cliniCalDetails.count; ++i {
                if btnTitle == cliniCalDetails[i]["Name"].stringValue {
                    button.setImage(UIImage(named: "checked"), forState: .Normal)
                    for rdBtn in radioBtn {
                        let rdTitle = rdBtn.titleLabel!.text
                        for var i = 0; i < cliniCalDetails.count; ++i {
                            if rdBtn.tag >= 100 && rdBtn.tag <= 102 {
                                if cliniCalDetails[i]["Value"].stringValue == rdTitle && cliniCalDetails[i]["Name"].stringValue == "BCC" {
                                    rdBtn.setImage(UIImage(named: "radio-check"), forState: .Normal)
                                }
                            }
                            if rdBtn.tag >= 103 && rdBtn.tag <= 105 {
                                if cliniCalDetails[i]["Value"].stringValue == rdTitle && cliniCalDetails[i]["Name"].stringValue == "SCC" {
                                    rdBtn.setImage(UIImage(named: "radio-check"), forState: .Normal)
                                }
                            }
                            if rdBtn.tag >= 106 && rdBtn.tag <= 108 {
                                if cliniCalDetails[i]["Value"].stringValue == rdTitle && cliniCalDetails[i]["Name"].stringValue == "Melanoma" {
                                    rdBtn.setImage(UIImage(named: "radio-check"), forState: .Normal)
                                }
                            }
                            
                            if rdBtn.tag >= 109 && rdBtn.tag <= 111 {
                                if cliniCalDetails[i]["Value"].stringValue == rdTitle && cliniCalDetails[i]["Name"].stringValue == "Merkel" {
                                    rdBtn.setImage(UIImage(named: "radio-check"), forState: .Normal)
                                }
                            }
                            
                            if cliniCalDetails[i]["Name"].stringValue == "referralPresenting" {
                                textViewUI.text = cliniCalDetails[i]["Value"].stringValue
                            }
                        }
                    }
                }
                if cliniCalDetails[i]["Name"].stringValue == "OThers" {
                    textFieldOther.text = cliniCalDetails[i]["Value"].stringValue
                }
                
                if cliniCalDetails[i]["Type"].stringValue ==  "Hand Condition" {
                    if let nameClinical: String! = cliniCalDetails[i]["Name"].stringValue {
                        if nameClinical == btnTitle {
                            button.setBackgroundImage(UIImage(named: "checked"), forState: UIControlState.Normal)
                        }
                    }
                }
                
                if cliniCalDetails[i]["Type"].stringValue == "PNS" {
                    if let nameClinical: String! = cliniCalDetails[i]["Name"].stringValue {
                        if nameClinical == btnTitle {
                            if nameClinical != "Other" {
                                button.setBackgroundImage(UIImage(named: "checked"), forState: UIControlState.Normal)
                            } else {
                                if let valueOther: String! = cliniCalDetails[i]["Value"].stringValue where !cliniCalDetails[i]["Value"].stringValue.isEmpty {
                                    button.setBackgroundImage(UIImage(named: "checked"), forState: UIControlState.Normal)
                                    textFileOtherPNS.text = cliniCalDetails[i][valueOther].stringValue
                                }
                            }
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