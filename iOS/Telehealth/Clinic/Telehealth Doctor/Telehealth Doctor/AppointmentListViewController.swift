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
import ReachabilitySwift

class AppointmentListViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {
    
    @IBOutlet weak var tableView: UITableView!
    var refreshControl : UIRefreshControl!
    let userDefaults = NSUserDefaults.standardUserDefaults().valueForKey("infoDoctor") as! NSDictionary
    let reachability = Reachability.reachabilityForInternetConnection()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        navigationController?.navigationBar.tintColor = UIColor.whiteColor()
        SingleTon.onlineUser_Singleton = []
        
        NSNotificationCenter.defaultCenter().removeObserver(self, name: "reloadTable", object: nil)
        NSNotificationCenter.defaultCenter().addObserver(self, selector: "reloadTable:", name: "reloadDataTable", object: nil)
        
        // list telehealth-appointment
        if SingleTon.flagSegue == true {
            navigationItem.title = "TeleHealth Appointment"
            getAppointmentList(APPOINTMENTLIST_TeleHealth)
        }
            // list WA-appointment
        else {
            navigationItem.title = "WA Appointment"
            getAppointmentList(APPOINTMENTLIST_WA)
        }
        
        self.refreshControl = UIRefreshControl()
        self.refreshControl.attributedTitle = NSAttributedString(string: "Refresh Appointment List")
        self.refreshControl.addTarget(self, action: "emitOnlineUser:", forControlEvents: UIControlEvents.ValueChanged)
        self.tableView.addSubview(refreshControl)
    }
    
    override func viewWillAppear(animated: Bool) {
        navigationController?.setNavigationBarHidden(false, animated: true)
        
        request(.GET, GENERATESESSION, headers: SingleTon.headers).responseJSON() { response in
            if let data = response.2.value {
                if let readableJSON: NSDictionary = data["data"] as? NSDictionary {
                    SingleTon.infoOpentok = JSON(readableJSON)
                }
            }
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
        getAppointmentList(APPOINTMENTLIST_TeleHealth)
        getAppointmentList(APPOINTMENTLIST_WA)
    }
    
    func emitOnlineUser(sender: AnyObject) {
        if SingleTon.flagSegue == true {
            getAppointmentList(APPOINTMENTLIST_TeleHealth)
        } else {
            getAppointmentList(APPOINTMENTLIST_WA)
        }
        self.refreshControl?.endRefreshing()
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("cell", forIndexPath: indexPath) as! AppointmentTableViewCell
        
        let singletonOnlineUser = SingleTon.onlineUser_Singleton[indexPath.row]
        cell.noRows.text = singletonOnlineUser.userId
        cell.callButton.tag = Int(indexPath.row)
        
        //        button view detail
        if SingleTon.flagSegue == true {
            cell.waAppointment.hidden = true
            cell.teleAppointment.tag = Int(indexPath.row)
        } else {
            cell.teleAppointment.hidden = true
            cell.waAppointment.tag = Int(indexPath.row)
        }
        
        
        
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
        } else if segue.identifier == "TeleAppointment" {
            if let indexPath = sender!.tag {
                let destinationController = segue.destinationViewController as! DetailAppointmentVC
                destinationController.uidUser = indexPath
            }
        } else if segue.identifier == "WAAppointment" {
            if let indexPath = sender!.tag {
                let destinationController = segue.destinationViewController as! DetailAppointmentVC
                destinationController.uidUser = indexPath
            }
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    func getAppointmentList(url: String) {
        SingleTon.onlineUser_Singleton = []
        print(SingleTon.headers["Authorization"])
        request(.GET, url, headers: SingleTon.headers)
            .validate(statusCode: 200..<300)
            .validate(contentType: ["application/json"])
            .responseJSONReToken { response in
                
                print(response.1)
                print(response.2.value)
//                if let data = response.2.value {
//                    if let readJSON: JSON = JSON(data) {
//                        for var i = 0; i < readJSON.count ; ++i {
//                            let onlineObj : OnlineUsers = OnlineUsers(userId: "\(i+1)",
//                                requestDateAppoinment: readJSON[i]["RequestDate"].stringValue,
//                                appoinmentDate: readJSON[i]["FromTime"].stringValue,
//                                UID: readJSON[i]["UID"].stringValue,
//                                status: readJSON[i]["IsOnline"].intValue,
//                                firstNameDoctor: readJSON[i]["Doctors"][0]["FirstName"].stringValue,
//                                midleNameDoctor: readJSON[i]["Doctors"][0]["MiddleName"].stringValue,
//                                lastNameDoctor: readJSON[i]["Doctors"][0]["LastName"].stringValue,
//                                firstNamePatient: readJSON[i]["Patients"][0]["FirstName"].stringValue,
//                                midleNamePatient: readJSON[i]["Patients"][0]["MiddleName"].stringValue,
//                                lastNamePatient: readJSON[i]["Patients"][0]["LastName"].stringValue
//                            )
//                            
//                            SingleTon.onlineUser_Singleton.append(onlineObj)
//                        }
//                        self.tableView.reloadData()
//                    }
//                }
        }
    }
}
