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
    @IBOutlet var navigaButton: [UIButton]!
    var refreshControl : UIRefreshControl!
    let userDefaults = NSUserDefaults.standardUserDefaults().valueForKey("teleUserInfo") as! NSDictionary
    var titleView2: String!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        SingleTon.onlineUser_Singleton.removeAll()
        
        NSNotificationCenter.defaultCenter().removeObserver(self, name: "reloadDataTable", object: nil)
        NSNotificationCenter.defaultCenter().addObserver(self, selector: "reloadTable:", name: "reloadDataTable", object: nil)
        
        if SingleTon.flagSegue == true { // list telehealth-appointment
            titleView2 = "Telehealth Appointment"
            getAppointmentList(APPOINTMENTLIST_TeleHealth)
        } else { // list WA-appointment
            titleView2 = "WA Appointment"
            getAppointmentList(APPOINTMENTLIST_WA)
        }
        
        self.refreshControl = UIRefreshControl()
        self.refreshControl.attributedTitle = NSAttributedString(string: "Refresh Appointment List")
        self.refreshControl.addTarget(self, action: "emitOnlineUser:", forControlEvents: UIControlEvents.ValueChanged)
        self.tableView.addSubview(refreshControl)
        
        tableView.estimatedRowHeight = 90.0
        tableView.rowHeight = UITableViewAutomaticDimension
    }
    
    override func viewDidAppear(animated: Bool) {
        tableView.reloadData()
    }
    
    override func viewWillAppear(animated: Bool) {
        navigationController?.setNavigationBarHidden(false, animated: true)
        self.navigationItem.setHidesBackButton(true, animated: true)
        
        for button in navigaButton {
            switch button.tag {
            case 50:
                button.setTitle("Home", forState: UIControlState.Normal)
            default:
                button.setTitle(titleView2, forState: UIControlState.Normal)
                break;
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
    func reloadTable(notification: NSNotification) {
        if notification.name.containsString("reloadDataTable") {
            if SingleTon.flagSegue == true { // list telehealth-appointment
                getAppointmentList(APPOINTMENTLIST_TeleHealth)
            }
            else { // list WA-appointment
                getAppointmentList(APPOINTMENTLIST_WA)
            }
        }
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
        
        guard let numberArrOnline: Int = SingleTon.onlineUser_Singleton.count where numberArrOnline > 0 else {
            print("AppointmentListViewController - table view array fatal error optional value")
            self.tableView.reloadData()
            return cell
        }
        
        let singletonOnlineUser = SingleTon.onlineUser_Singleton[indexPath.row]
        cell.noRows.text = String(indexPath.row + 1)
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
        cell.doctorName.text = singletonOnlineUser.fullNameDoctor.characters.count > 2 ? singletonOnlineUser.fullNameDoctor : "Unlink Treating Practitioner"
        cell.submitDate.text = formatforList(singletonOnlineUser.requestDateAppoinment)
        cell.appoinmentDate.text = formatforList(singletonOnlineUser.appoinmentDate)
        cell.callButton.enabled = true
        cell.statusApt.text = singletonOnlineUser.statusApt
        if let status = singletonOnlineUser.status {
            if status != 0 {
                cell.statusImageView.hidden = false
            } else {
                cell.statusImageView.hidden = true
            }
        }
        return cell
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        guard let identiSegue = segue.identifier else {
            print("unwind home segue")
            return
        }
        switch identiSegue {
        case "callAction":
            if let indexPath = sender!.tag {
                let destinationController = segue.destinationViewController as! MakeCallViewController
                destinationController.idOnlineUser = indexPath
            }
        case "TeleAppointment":
            if let indexPath = sender!.tag {
                let destinationController = segue.destinationViewController as! DetailAppointmentVC
                destinationController.uidUser = indexPath
                destinationController.oldTitle = "Telehealth Appointment"
            }
        case "WAAppointment":
            if let indexPath = sender!.tag {
                let destinationController = segue.destinationViewController as! DetailAppointmentVC
                destinationController.uidUser = indexPath
                destinationController.oldTitle = "WA Appointment"
            }
        default:
            return
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    func getAppointmentList(url: String) {
        request(.GET, url, headers: SingleTon.headers)
            .responseJSONReToken { response in
                guard response.2.error == nil else {
                    if let data = response.2.data {
                        JSSAlertView().warning(self, title: "Error", text: resJSONError(data))
                    }
                    print("error calling GET", response.2.error!)
                    return
                }
                
                if let value: AnyObject = response.2.value {
                    let readableJSON = JSON(value)
                    SingleTon.onlineUser_Singleton.removeAll()
                    for var i = 0; i < readableJSON.count ; ++i {
                        let onlineObj : OnlineUsers = OnlineUsers(userId: "\(i+1)",
                            requestDateAppoinment: readableJSON[i]["CreatedDate"].stringValue,
                            appoinmentDate: readableJSON[i]["FromTime"].stringValue,
                            UID: readableJSON[i]["UID"].stringValue,
                            status: readableJSON[i]["IsOnline"].intValue,
                            firstNameDoctor: readableJSON[i]["Doctors"][0]["FirstName"].stringValue,
                            midleNameDoctor: readableJSON[i]["Doctors"][0]["MiddleName"].stringValue,
                            lastNameDoctor: readableJSON[i]["Doctors"][0]["LastName"].stringValue,
                            
                            firstNamePatient: readableJSON[i]["Patients"][0]["FirstName"].stringValue.isEmpty ? readableJSON[i]["TelehealthAppointment"]["PatientAppointment"]["FirstName"].stringValue : readableJSON[i]["Patients"][0]["FirstName"].stringValue,
                            midleNamePatient: readableJSON[i]["Patients"][0]["MiddleName"].stringValue.isEmpty ? readableJSON[i]["TelehealthAppointment"]["PatientAppointment"]["MiddleName"].stringValue : readableJSON[i]["Patients"][0]["MiddleName"].stringValue,
                            lastNamePatient: readableJSON[i]["Patients"][0]["LastName"].stringValue.isEmpty ? readableJSON[i]["TelehealthAppointment"]["PatientAppointment"]["LastName"].stringValue : readableJSON[i]["Patients"][0]["LastName"].stringValue,
                            TeleUID: readableJSON[i]["TeleUID"].stringValue,
                            statusApt: readableJSON[i]["Status"].stringValue
                        )
                        
                        SingleTon.onlineUser_Singleton.append(onlineObj)
                        self.tableView.reloadData()
                        self.tableView.tableFooterView = UIView(frame: CGRect.zero)
                    }
                }
        }
    }
}

