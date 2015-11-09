//
//  DetailAppointmentWAVC.swift
//  Telehealth Doctor
//
//  Created by Huy Nguyễn on 11/6/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit

class DetailAppointmentWAVC: UIViewController, UITableViewDelegate, UITableViewDataSource {
    
    
    // declare menu detail appointment
    var arrayForMainDetail : NSMutableArray = NSMutableArray()
    var mainDetail : NSMutableArray = NSMutableArray()
    var contentDict : NSMutableDictionary = NSMutableDictionary()
    
    @IBOutlet weak var tableView: UITableView!
    override func viewDidLoad() {
        super.viewDidLoad()
        
        arrayForMainDetail = ["0","0","0","0"]
        mainDetail = ["Basic Information", "Patient", "Referral", "Clinical Details & Relevant Medical History"]
        
        let clinic: NSArray = ["Relevant Past Medical History", "Relevant Social Factors", "Allegiers", "Current Medication", "Relevant Investigation & Test", "Pathology & Radiology", "Other Note"]
        let strParse = mainDetail.objectAtIndex(3) as? String
        contentDict.setValue(clinic, forKey: strParse!)
        
        tableView.registerClass(UITableViewCell.self, forHeaderFooterViewReuseIdentifier: "cell")
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return mainDetail.count
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if arrayForMainDetail.objectAtIndex(section).boolValue == true {
            let subArrMain = mainDetail.objectAtIndex(section) as! String
            if contentDict.valueForKey(subArrMain) != nil {
                let subRow = (contentDict.valueForKey(subArrMain)) as! NSArray
                return subRow.count
            }
        }
        return 0
    }
    
    func tableView(tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        return "ABC"
    }
    
    func tableView(tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return 50
    }
    
    func tableView(tableView: UITableView, heightForFooterInSection section: Int) -> CGFloat {
        return 1
    }
    
    func tableView(tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        let headerView = UIView(frame: CGRectMake(0, 0, tableView.frame.size.width, 40))
        headerView.backgroundColor = UIColor.clearColor()
        headerView.tag = section
        
        let headerString = UILabel(frame: CGRectMake(10, 10, tableView.frame.size.width - 10, 30)) as UILabel
        headerString.text = mainDetail.objectAtIndex(section) as? String
        headerView.addSubview(headerString)
        
        let headerTapped = UITapGestureRecognizer(target: self, action: "sectionHeaderTapped:")
        headerView.addGestureRecognizer(headerTapped)
        
        return headerView
    }
    
    func sectionHeaderTapped(recognizer: UITapGestureRecognizer) {
        let indexPath: NSIndexPath = NSIndexPath(forRow: 0, inSection: (recognizer.view?.tag)! as Int)
        if indexPath.row == 0 {
            var collapsed = arrayForMainDetail.objectAtIndex(indexPath.row).boolValue
            collapsed = !collapsed
            
            for var i = 0; i < arrayForMainDetail.count; ++i {
                arrayForMainDetail.replaceObjectAtIndex(i, withObject: false)
                let range = NSMakeRange(i, 1)
                let sectionToReload = NSIndexSet(indexesInRange: range)
                self.tableView.reloadSections(sectionToReload, withRowAnimation: .None)
            }
            
            arrayForMainDetail.replaceObjectAtIndex(indexPath.section, withObject: collapsed)
            
            let range = NSMakeRange(indexPath.section, 1)
            let sectionToReload = NSIndexSet(indexesInRange: range)
            self.tableView.reloadSections(sectionToReload, withRowAnimation: .Fade)
        }
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell: UITableViewCell = self.tableView.dequeueReusableCellWithIdentifier("cell", forIndexPath: indexPath) as UITableViewCell
        let manyCells: Bool = arrayForMainDetail.objectAtIndex(indexPath.section).boolValue
        if manyCells {
            let content = contentDict.valueForKey(mainDetail.objectAtIndex(indexPath.section) as! String) as! NSArray
            cell.textLabel?.text = content.objectAtIndex(indexPath.row) as? String
            cell.backgroundColor = UIColor(hex: "DBDDDE")
        }
        return cell
    }
    
}
