//
//  AppointmentListsViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 11/2/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit

class AppointmentListsViewController: UIViewController {
    
    @IBOutlet weak var tableView: UITableView!
    let api = GetAndPostDataController()
    var patientUid = String()
    var Appointment : [AppointmentList] = []
    var refreshControl: UIRefreshControl!
    override func viewDidLoad() {
        super.viewDidLoad()
        getAppointmentList()
        
        //create refreshControl
        refreshControl = UIRefreshControl()
        refreshControl.tintColor = UIColor.whiteColor()
        refreshControl.addTarget(self, action: "getAppointmentList", forControlEvents: UIControlEvents.ValueChanged)
        tableView.addSubview(refreshControl)
        
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    //Giap: Get Appointment List
    func getAppointmentList() {
        if let token = defaults.valueForKey("token") as? String {
            tokens = token
            
        }
        if let patientUID = defaults.valueForKey("patientUID") as? String {
            api.getListAppointmentByUID(patientUID, Limit: "100", completionHandler: {
                response in
//                print("sdadas--",response)
                if response["ErrorsList"] != nil {
                    print("Error")
                    self.alertMessage("Error", message: response["ErrorsList"][0].string!)
                    self.refreshControl.endRefreshing()
                }else if response["TimeOut"] ==  "Request Time Out" {
                    self.alertMessage("Error", message: "Request Time Out")
                    self.refreshControl.endRefreshing()
                }
                else {
                    self.Appointment = []
                    var UIDApointment : String!
                    var FromTime : String!
                    var ToTime : String!
                    var Status : String!
                    var NameDoctor : String!
                    var Type:String!
                    var refName:String!
                    var data = response["rows"]
                    let countAppointment = data.count
                    for var i = 0 ; i < countAppointment ;i++ {
                        refName = data[i]["TelehealthAppointment"]["RefName"].string ?? ""
                        UIDApointment = data[i]["UID"].string ?? ""
                        FromTime = data[i]["FromTime"].string ?? ""
                        ToTime = data[i]["ToTime"].string ?? ""
                        Status = data[i]["Status"].string ?? ""
                        NameDoctor = data[i]["Doctors"][0]["FirstName"].string ?? ""
                        Type = data[0]["TelehealthAppointment"]["Type"].string ?? ""
                        self.Appointment.append(AppointmentList(UIDApointment: UIDApointment, ToTime: ToTime, Status: Status, FromTime: FromTime, NameDoctor: NameDoctor,Type:Type,refName:refName))
                    }
                    self.view.hideLoading()
                    self.refreshControl.endRefreshing()
                    self.tableView.reloadData()
                }
            })
        }
    }
    
    //sending data by segue
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if segue.identifier == "TrackingRefferalSegue" {
            let Tracking = segue.destinationViewController as! TrackingRefferalViewController
            if let indexPath = tableView.indexPathForSelectedRow {
                Tracking.appointmentDetails = Appointment[indexPath.row]
            }
        }
    }
    
    
    //Giap: Show alert message
    func alertMessage(title : String,message : String){
        let alertController = UIAlertController(title: title, message: message, preferredStyle: .Alert)
        let OKAction = UIAlertAction(title: "OK", style: .Default) { (action) in
            
        }
        alertController.addAction(OKAction)
        
        self.presentViewController(alertController, animated: true) {
            
        }
    }
    
    
    
}

extension AppointmentListsViewController:UITableViewDataSource,UITableViewDelegate{
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return Appointment.count
        
    }
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("AppointmentCell", forIndexPath: indexPath) as! AppointmentListTableViewCell
        let data = Appointment[indexPath.row]
        cell.configAppointment(data,indexPath: indexPath.row)
        return cell
    }
    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        performSegueWithIdentifier("TrackingRefferalSegue", sender: self)
        tableView.deselectRowAtIndexPath(indexPath, animated: true)
    }
    func tableView(tableView: UITableView, willDisplayCell cell: UITableViewCell, forRowAtIndexPath indexPath: NSIndexPath) {
        cell.layer.transform = CATransform3DMakeScale(0.1, 0.1, 1)
        UIView.animateWithDuration(0.25, animations: {
            cell.layer.transform = CATransform3DMakeScale(1, 1, 1)
        })
    }
    
}

