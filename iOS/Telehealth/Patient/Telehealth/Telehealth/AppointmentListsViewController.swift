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
    
    let appointmentService = AppointmentService()
    let alertView = UIAlertView()
    
    var patientUid = String()
    var Appointment : [AppointmentContainer] = []
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
            getAppointmentList(patientUID)
        }
    }
    
    func getAppointmentList(patientUID:String){
        appointmentService.getAppointmentByID(patientUID, Limit: "100", completionHandler: {
            message , appointmentList in
            print(message)
            if message["message"] == "error" {
                self.alertView.alertMessage("Error", message: message["ErrorType"].string!)
                self.refreshControl.endRefreshing()
            }
            else {
                
                self.Appointment = appointmentList
                
                self.view.hideLoading()
                self.refreshControl.endRefreshing()
                self.tableView.reloadData()
            }
            
        })
    }
    
    //sending data by segue
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if segue.identifier == "appointmentDetailsSegue" {
            let appointmentDedtails = segue.destinationViewController as! AppointmentDetailsViewController
            if let indexPath = tableView.indexPathForSelectedRow {
                appointmentDedtails.appointmentDetails = Appointment[indexPath.row]
            }
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
        performSegueWithIdentifier("appointmentDetailsSegue", sender: self)
        tableView.deselectRowAtIndexPath(indexPath, animated: true)
    }
    func tableView(tableView: UITableView, willDisplayCell cell: UITableViewCell, forRowAtIndexPath indexPath: NSIndexPath) {
        cell.alpha = 0
        UIView.animateWithDuration(0.25, animations: {
            cell.alpha = 1
        })
    }
    
}

