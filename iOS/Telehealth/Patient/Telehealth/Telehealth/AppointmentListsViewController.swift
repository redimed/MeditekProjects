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
    let appointmentApi = GetAndPostDataController()
    var patientUid = String()
    var Appointment : [AppointmentList] = []

    override func viewDidLoad() {
        super.viewDidLoad()
        getAppointmentList()
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    //Giap: Get Appointment List
    func getAppointmentList() {
        if let patientUID = defaults.valueForKey("patientUID") as? String {
            appointmentApi.getListAppointmentByUID(patientUID, Limit: "100", completionHandler: {
                response in
                
                if response["ErrorsList"] != nil {
                    print("Error")
                    self.alertMessage("Error", message: response["ErrorsList"][0].string!)
                }else if response["TimeOut"] ==  "Request Time Out" {
                    self.alertMessage("Error", message: "Request Time Out")
                }
                else {
                    var UIDApointment : String!
                    var FromTime : String!
                    var ToTime : String!
                    var Status : String!
                    var NameDoctor : String!
                    var Type:String!
                    var data = response["rows"]
                    let countAppointment = data.count
          
                    for var i = 0 ; i < countAppointment ;i++ {
                        
                        UIDApointment = data[i]["UID"].string ?? ""
                        FromTime = data[i]["FromTime"].string ?? ""
                        ToTime = data[i]["ToTime"].string ?? ""
                        Status = data[i]["Status"].string ?? ""
                        NameDoctor = data[i]["Doctors"][0]["FirstName"].string ?? ""
                        Type = data[0]["TelehealthAppointment"]["Type"].string ?? ""
                        self.Appointment.append(AppointmentList(UIDApointment: UIDApointment, ToTime: ToTime, Status: Status, FromTime: FromTime, NameDoctor: NameDoctor,Type:Type))
                    }
                    self.view.hideLoading()
                    self.tableView.reloadData()
                }
            })
        }
        
        
    }
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
        cell.configAppointment(data)
        return cell
    }
    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
         
        print(Appointment[indexPath.row].UIDApointment)
        performSegueWithIdentifier("TrackingRefferalSegue", sender: self)
        tableView.deselectRowAtIndexPath(indexPath, animated: true)
    }
   
}

