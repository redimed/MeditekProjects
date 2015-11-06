//
//  AppointmentListTableViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 10/14/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit

class AppointmentListTableViewController: UITableViewController,AppointmentListTableViewCellDelegate{
    let appointmentApi = GetAndPostDataController()
    var patientUid = String()
    var Appointment : [AppointmentList] = []

  
    override func viewDidLoad() {
        super.viewDidLoad()
        
        if let patientUID = defaults.valueForKey("patientUID") as? String {
            patientUid = patientUID
        }
        if Appointment.count <= 0 {
            self.view.showLoading()
        }
        //clear bottom line in table view
        self.tableView.separatorStyle = UITableViewCellSeparatorStyle.None
        getAppointmentList()
        
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return Appointment.count
    }
    
    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("appointmentCell") as! AppointmentListTableViewCell
        let data = Appointment[indexPath.row]
        cell.configAppointment(data)
        cell.delegate = self
        return cell
        
    }
    
    func AppointmentUpload(cell: AppointmentListTableViewCell, sender: String) {
        performSegueWithIdentifier("uploadSegue", sender: cell)
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
    //Giap: Get Appointment List
    func getAppointmentList() {
        appointmentApi.getListAppointmentByUID(patientUid, Limit: "100", completionHandler: {
            response in
            print(response)
            
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
                var data = response["rows"]
                let countAppointment = data.count
                
                for var i = 0 ; i < countAppointment ;i++ {
                    UIDApointment = data[i]["UID"].string
                    FromTime = data[i]["FromTime"].string
                    ToTime = data[i]["ToTime"].string
                    Status = data[i]["Status"].string
                    NameDoctor = data[i]["Doctors"][0]["FirstName"].string != nil ? data[i]["Doctors"][0]["FirstName"].string : ""
                    
                    self.Appointment.append(AppointmentList(UIDApointment: UIDApointment, ToTime: ToTime, Status: Status, FromTime: FromTime, NameDoctor: NameDoctor))
                    
                }
                self.view.hideLoading()
                self.tableView.reloadData()
            }
        })
        
    }
    

    
    
    
    
    
}
