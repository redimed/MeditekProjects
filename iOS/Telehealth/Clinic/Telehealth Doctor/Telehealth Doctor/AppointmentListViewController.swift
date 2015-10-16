//
//  AppointmentListViewController.swift
//  Telehealth Doctor
//
//  Created by Giap Vo Duc on 9/22/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON

class AppointmentListViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {
    
    @IBOutlet weak var tableView: UITableView!
    var refreshControl : UIRefreshControl!
    let userDefaults = NSUserDefaults.standardUserDefaults().valueForKey("infoDoctor") as! NSDictionary
    
    override func viewDidLoad() {
        super.viewDidLoad()
        navigationController?.navigationBar.tintColor = UIColor.whiteColor()
        /**
        Reload table view with new data receive from socket
        */
        NSNotificationCenter.defaultCenter().removeObserver(self, name: "reloadDataTable", object: nil)
        NSNotificationCenter.defaultCenter().addObserver(self, selector: "reloadTable:", name: "reloadDataTable", object: nil)
        
        self.refreshControl = UIRefreshControl()
        self.refreshControl.attributedTitle = NSAttributedString(string: "Refresh Appointment List")
        self.refreshControl.addTarget(self, action: "emitOnlineUser:", forControlEvents: UIControlEvents.ValueChanged)
        self.tableView.addSubview(refreshControl)
    }
    
    
    
    override func viewWillAppear(animated: Bool) {
        navigationController?.setNavigationBarHidden(false, animated: true)
        
        request(.GET, GENERATESESSION, headers: SingleTon.headers).responseJSON() { response in
            let data = response.2.value!["data"] as! NSDictionary
            SingleTon.infoOpentok = JSON(data)
        }
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return SingleTon.onlineUser_Singleton.count
    }
    
    /**
    Reload data func for notification
    
    - parameter notification: notification name "reloadDataTable"
    */
    func reloadTable(notification: NSNotification){
        self.tableView.reloadData()
        tableView.tableFooterView = UIView(frame: CGRectZero)
        
    }
    
    func emitOnlineUser(sender: AnyObject) {
        SingleTon.socket.emit("get", GET_ONLINE_USERS)
        self.refreshControl?.endRefreshing()
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("cell", forIndexPath: indexPath) as! AppointmentTableViewCell
        
        let singletonOnlineUser = SingleTon.onlineUser_Singleton[indexPath.row]
        cell.noRows.text = singletonOnlineUser.userId
        cell.callButton.tag = Int(indexPath.row)
        cell.viewDetailButton.tag = Int(indexPath.row)
        cell.patientName.text = singletonOnlineUser.fullNamePatient
        cell.doctorName.text = singletonOnlineUser.fullNameDoctor
        cell.submitDate.text = formatString(singletonOnlineUser.requestDateAppoinment)
        cell.appoinmentDate.text = formatString(singletonOnlineUser.appoinmentDate)
        if let status = singletonOnlineUser.status {
            if status != 0 {
                cell.callButton.enabled = true
                cell.statusImageView.hidden = false
            } else {
                cell.callButton.enabled = false
                cell.statusImageView.hidden = true
            }
        }
        return cell
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if segue.identifier == "callAction" {
            if let indexPath = sender!.tag {
                let destinationController = segue.destinationViewController as! MakeCallViewController
                destinationController.idOnlineUser = indexPath
            }
        } else if segue.identifier == "detailAppoinment" {
            if let indexPath = sender!.tag {
                let destinationController = segue.destinationViewController as! DetailAppointmentVC
                destinationController.uidUser = indexPath
            }
        }
    }
    @IBAction func detailAppointment(sender: AnyObject) {
        let initViewController : UISplitViewController = UIStoryboard(name: "Main", bundle: nil).instantiateViewControllerWithIdentifier("splitViewController") as! UISplitViewController
        self.presentViewController(initViewController, animated: true, completion: nil)
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func formatString(dateString: String) -> String {
        let dateFormatter = NSDateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.000Z"
        if let datePublished = dateFormatter.dateFromString(dateString) {
            dateFormatter.dateFormat = "MMM dd, yyyy 'at' h:mm a"
            let dateFormated = dateFormatter.stringFromDate(datePublished)
            return dateFormated
        }
        return ""
    }
}
