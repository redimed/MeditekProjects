//
//  ListReasonsViewController.swift
//  VGODriverApp
//
//  Created by Meditek on 4/16/16.
//  Copyright © 2016 Vu Dinh Trung. All rights reserved.
//

import UIKit
import ObjectMapper

class CustomTableViewController: BaseViewController ,UITableViewDelegate, UITableViewDataSource {
    
    @IBOutlet weak var tableView: UITableView!
    
    var titles : [[String]] = []
    var listID : Array<Int>! = []
    var type : String = ""
    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.delegate = self
        tableView.dataSource = self
        loadData()
    }
    func loadData() {
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated)
        
    }
    
    func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return 1
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return titles.count
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        if(type == "radio"){
            return cellForRowAtIndexPathRadio(tableView, indexPath: indexPath)
            
        }else {
            return cellForRowAtIndexPathCheckBox(tableView, indexPath: indexPath)
        }
        
    }
    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        tableView.deselectRowAtIndexPath(indexPath, animated: true)
        if(type == "radio"){
            for (i,row) in titles.enumerate() {
                if(i == indexPath.row){
                    for general in AllRedisiteData.general {
                        if(general.ref == row[1]){
                            general.checked = "true"
                        }
                    }
                }else{
                    for general in AllRedisiteData.general {
                        if(general.ref == row[1]){
                            general.checked = "false"
                        }
                    }
                }
            }
            didSelectRowAtIndexPathRadio(tableView, indexPath: indexPath)
        }else{
            for (i,row) in titles.enumerate() {
                if(i == indexPath.row){
                    for general in AllRedisiteData.general {
                        if(general.ref == row[1]){
                            if(general.checked == "true"){
                                general.checked = "false"
                            }else{
                                general.checked = "true"
                            }
                        }
                    }
                }
            }
            didSelectRowAtIndexPathCheckBox(tableView, indexPath: indexPath)
        }
        tableView.reloadData()
    }
    override func willMoveToParentViewController(parent: UIViewController?) {
        if(listID.count != 0){
            // Context.setDataDefaults("\(listID[0])", key: Define.keyNSDefaults.SelectReason)
        }
    }
    func didSelectRowAtIndexPathRadio(tableView: UITableView, indexPath: NSIndexPath){
        listID.removeAll()
        listID.append(indexPath.row)
    }
    func cellForRowAtIndexPathRadio(tableView: UITableView, indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("CustomPatientCell", forIndexPath: indexPath) as! CustomPatientCell
        cell.preservesSuperviewLayoutMargins = false
        cell.separatorInset = UIEdgeInsetsZero
        cell.layoutMargins = UIEdgeInsetsZero
        cell.lbInformation.textColor = UIColor.blackColor()
        ///for
        for (i,row) in titles.enumerate() {
            if(i == indexPath.row){
                cell.lbInformation.text = row[0]
            }
        }
        cell.backgroundColor = UIColor.whiteColor()
        cell.btCheck.setImage(UIImage(named: Define.imageName.RadioOffGreen), forState: UIControlState.Normal)
        
        for i in 0 ..< listID.count {
            if(listID[i] == indexPath.row){
                cell.lbInformation.textColor = UIColor.whiteColor()
                cell.btCheck.setImage(UIImage(named: Define.imageName.RadioOnWhite), forState: UIControlState.Normal)
                cell.backgroundColor = UIColor(hex: Define.ColorCustom.greenColor)
            }
        }
        
        return cell
    }
    func didSelectRowAtIndexPathCheckBox(tableView: UITableView, indexPath: NSIndexPath){
        var checkExits = 0
        for i in 0 ..< listID.count {
            if(i < listID.count){
                if(listID[i] == indexPath.row){
                    listID.removeAtIndex(i)
                    checkExits += 1
                }
            }
        }
        if(checkExits == 0){
            listID.append(indexPath.row)
        }
    }
    func cellForRowAtIndexPathCheckBox(tableView: UITableView, indexPath: NSIndexPath) -> UITableViewCell {
        
        let cell = tableView.dequeueReusableCellWithIdentifier("CustomPatientCell", forIndexPath: indexPath) as! CustomPatientCell
        cell.preservesSuperviewLayoutMargins = false
        cell.separatorInset = UIEdgeInsetsZero
        cell.layoutMargins = UIEdgeInsetsZero
        cell.lbInformation.textColor = UIColor.blackColor()
        for (i,row) in titles.enumerate() {
            if(i == indexPath.row){
                cell.lbInformation.text = row[0]
            }
        }
        cell.backgroundColor = UIColor.whiteColor()
        cell.btCheck.setImage(UIImage(named: Define.imageName.UnCheckedGreen), forState: UIControlState.Normal)
        
        for i in 0 ..< listID.count {
            if(listID[i] == indexPath.row){
                cell.lbInformation.textColor = UIColor.whiteColor()
                cell.btCheck.setImage(UIImage(named: Define.imageName.CheckedGreen), forState: UIControlState.Normal)
                cell.backgroundColor = UIColor(hex: Define.ColorCustom.greenColor)
            }
        }
        
        return cell
    }
}
