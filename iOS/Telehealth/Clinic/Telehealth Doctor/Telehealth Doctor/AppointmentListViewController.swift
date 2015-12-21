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
    
    var aptFrom: String!
    var aptTo: String!
    var totalCountData: Int!
    
    var titleView2: String!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        NSNotificationCenter.defaultCenter().removeObserver(self, name: "handleCallNotification", object: nil)
        NSNotificationCenter.defaultCenter().removeObserver(self, name: "reloadDataTable", object: nil)
        NSNotificationCenter.defaultCenter().addObserver(self, selector: "reloadTable:", name: "reloadDataTable", object: nil)
        
        SingleTon.onlineUser_Singleton.removeAll()
        paramFilter(0, aptFrom: getReFormat().filterFormat, aptTo: getReFormat().filterFormat)
        titleView2 = "Telehealth Appointment"
        getAppointmentList(APPOINTMENTLIST)
        self.refreshControl = UIRefreshControl()
        self.refreshControl.attributedTitle = NSAttributedString(string: "Refresh Appointment List")
        self.refreshControl.addTarget(self, action: "refreshList:", forControlEvents: UIControlEvents.ValueChanged)
        self.tableView.addSubview(refreshControl)
        
        tableView.estimatedRowHeight = 90.0
        tableView.rowHeight = UITableViewAutomaticDimension
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
    
    override func viewDidAppear(animated: Bool) {
        tableView.reloadData()
    }
    
    func reloadTable(notification: NSNotification) {
        if notification.name == "reloadDataTable" {
            SingleTon.onlineUser_Singleton.removeAll()
            let data: JSON = JSON(notification.userInfo!)
            aptFrom = data["data"]["aptFrom"].stringValue
            aptTo = data["data"]["aptTo"].stringValue
            paramFilter(0, aptFrom: aptFrom, aptTo: aptTo)
            getAppointmentList(APPOINTMENTLIST)
        }
    }
    
    func refreshList(sender: AnyObject) {
        if let offset = SingleTon.filterParam["data"]!.valueForKey("Offset") as? Int {
            if offset <= totalCountData && offset != 0 {
                SingleTon.onlineUser_Singleton.removeAll()
                getAppointmentList(APPOINTMENTLIST)
            }
        }
        self.refreshControl?.endRefreshing()
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return SingleTon.onlineUser_Singleton.count
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
        cell.submitDate.text = FormatStrDate(singletonOnlineUser.requestDateAppoinment)
        cell.appoinmentDate.text = FormatStrDate(singletonOnlineUser.appoinmentDate)
        cell.callButton.enabled = true
        cell.statusApt.text = singletonOnlineUser.statusApt
        if let status = singletonOnlineUser.status {
            if status != 0 {
                //                cell.statusImageView.hidden = false
            } else {
                //                cell.statusImageView.hidden = true
            }
        }
        return cell
    }
    
    func tableView(tableView: UITableView, willDisplayCell cell: UITableViewCell, forRowAtIndexPath indexPath: NSIndexPath) {
        
        if let offSet = SingleTon.filterParam["data"]!.valueForKey("Offset") as? Int {
            if offSet == 0 && indexPath.row == 15 {
                paramFilter(offSet + 20, aptFrom: aptFrom, aptTo: aptTo)
                getAppointmentList(APPOINTMENTLIST)
            }
            if offSet != 0 && indexPath.row == offSet - 5 {
                paramFilter(offSet + 20, aptFrom: aptFrom, aptTo: aptTo)
                getAppointmentList(APPOINTMENTLIST)
            }
        }
        
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
                destinationController.oldTitle = "Telehealth Appointment"
            }
        default:
            return
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    func getAppointmentList(url: String) {
        request(.POST, url, headers: SingleTon.headers, parameters: SingleTon.filterParam)
            .responseJSONReToken { response in
                guard response.2.error == nil else {
                    if let data = response.2.data {
                        print("error calling GET", resJSONError(data))
                    }
                    return
                }
                
                if let value: AnyObject = response.2.value {
                    let readableJSON = JSON(value)["data"]
                    self.totalCountData = JSON(value)["count"].intValue
                    if readableJSON.count != 0 {
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
}


