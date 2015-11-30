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
    
    @IBOutlet weak var noBtnHand: UIButton!
    @IBOutlet weak var yesBtnHand: UIButton!
    
    @IBOutlet weak var noBtnSkin: UIButton!
    @IBOutlet weak var yesBtnSkin: UIButton!
    
    @IBOutlet weak var textViewHandSur: UITextView!
    @IBOutlet weak var textViewSkinCancer: UITextView!
    
    @IBOutlet weak var tableViewSkin: UITableView!
    @IBOutlet weak var tableViewHand: UITableView!
    
    var fileUpload: JSON!
    var cliniCalDetails: JSON! = SingleTon.detailAppointMentObj["TelehealthAppointment"]["ClinicalDetails"]
    
    override func viewDidLoad() {
        super.viewDidLoad()
        loadData()
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        for var i = 0; i < cliniCalDetails.count; ++i {
            if cliniCalDetails[i]["Name"].stringValue == "cancersTreatmens" {
                if let dataTable: JSON = cliniCalDetails[i]["FileUploads"] {
                    if dataTable.count > 0 {
                        fileUpload = dataTable
                        return dataTable.count
                    }
                }
            }
            if cliniCalDetails[i]["Name"].stringValue == "previousHandSurgery" {
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
        for var i = 0; i < cliniCalDetails.count; ++i {
            if cliniCalDetails[i]["Name"].stringValue == "cancersTreatmens"  {
                if cliniCalDetails[i]["Value"].stringValue.characters.count > 0 {
                    yesBtnSkin.setImage(UIImage(named: "checked"), forState: .Normal)
                    textViewSkinCancer.text = cliniCalDetails[i]["Value"].stringValue
                } else {
                    noBtnSkin.setImage(UIImage(named: "checked"), forState: .Normal)
                }
            }
            if cliniCalDetails[i]["Name"].stringValue == "previousHandSurgery" {
                if cliniCalDetails[i]["Value"].stringValue.characters.count > 0 {
                    yesBtnHand.setImage(UIImage(named: "checked"), forState: .Normal)
                    textViewHandSur.text = cliniCalDetails[i]["Value"].stringValue
                } else {
                    noBtnHand.setImage(UIImage(named: "checked"), forState: .Normal)
                }
            }
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
}
