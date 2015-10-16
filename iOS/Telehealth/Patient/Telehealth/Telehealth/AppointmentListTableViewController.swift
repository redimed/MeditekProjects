//
//  AppointmentListTableViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 10/14/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit

class AppointmentListTableViewController: UITableViewController,AppointmentListTableViewCellDelegate {
    let appointmentApi = GetAndPostDataController()
    var patientUid = String()
    override func viewDidLoad() {
        super.viewDidLoad()
        
        if let patientUID = defaults.valueForKey("patientUID") as? String {
            patientUid = patientUID
        }
        self.tableView.separatorStyle = UITableViewCellSeparatorStyle.None
        appointmentApi.getListAppointmentByUID(patientUid, Limit: "1", completionHandler: {
            response in
            var UIDApointment : String!
            var FromTime : String!
            var ToTime : String!
            var Status : String!
            var NameDoctor : String!
            let countAppointment = response["rows"].count
           
            Appointment = []
            for var i = 0 ; i < countAppointment ;i++ {
                UIDApointment = response["rows"][i]["UID"].string
                FromTime = response["rows"][i]["FromTime"].string
                ToTime = response["rows"][i]["ToTime"].string
                Status = response["rows"][i]["Status"].string
                NameDoctor = response["rows"][i]["Doctors"][0]["FirstName"].string
                 print(response["rows"][i]["Doctors"][0]["FirstName"].string)
                Appointment.append(AppointmentList(UIDApointment: UIDApointment, ToTime: ToTime, Status: Status, FromTime: FromTime, NameDoctor: NameDoctor))

            }
            self.tableView.reloadData()
        })
        
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


   

}
