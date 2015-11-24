//
//  HistorySkinHandVC.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 11/9/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import SwiftyJSON

class HistorySkinHandVC: UIViewController, UITableViewDelegate, UITableViewDataSource {
    
    @IBOutlet weak var labelTitle: UILabel!
    @IBOutlet weak var textView: UITextView!
    @IBOutlet weak var yesBtn: UIButton!
    @IBOutlet weak var noBtn: UIButton!
    @IBOutlet weak var tableView: UITableView!
    var fileUpload: JSON!
    var cliniCalDetails: JSON! = SingleTon.detailAppointMentObj["TelehealthAppointment"]["ClinicalDetails"]
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        if self.title != "CancerandTreatments" {
            labelTitle.text = "History of Previous hand surgery"
        }
        tableView.tableFooterView = UIView(frame: CGRect.zero)
        loadData()
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        for var i = 0; i < cliniCalDetails.count; ++i {
            if self.title != "CancerandTreatments" {
                if cliniCalDetails[i]["Name"].stringValue == "cancersTreatmens" {
                    if let dataTable: JSON = cliniCalDetails[i]["FileUploads"] {
                        if dataTable.count > 0 {
                            fileUpload = dataTable
                            return dataTable.count
                        }
                    }
                }
            } else {
                if cliniCalDetails[i]["Name"].stringValue == "previousHandSurgery" {
                    if let dataTable: JSON = cliniCalDetails[i]["FileUploads"] {
                        if dataTable.count > 0 {
                            fileUpload = dataTable
                            return dataTable.count
                        }
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
        for var i = 0; i < cliniCalDetails.count; ++i {
            if self.title == "CancerandTreatments" && cliniCalDetails[i]["Name"].stringValue == "cancersTreatmens"  {
                textView.hidden = false
                yesBtn.setImage(UIImage(named: "radio-check"), forState: .Normal)
                textView.text = cliniCalDetails[i]["Value"].stringValue
            }
            if self.title != "CancerandTreatments" && cliniCalDetails[i]["Name"].stringValue == "previousHandSurgery" {
                yesBtn.setImage(UIImage(named: "radio-check"), forState: .Normal)
                textView.hidden = false
                textView.text = cliniCalDetails[i]["Value"].stringValue
            }
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
}
