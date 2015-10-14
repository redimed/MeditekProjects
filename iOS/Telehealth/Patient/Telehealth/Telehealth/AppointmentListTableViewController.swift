//
//  AppointmentListTableViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 10/14/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit

class AppointmentListTableViewController: UITableViewController {
    let appointmentApi = GetAndPostDataController()
    var patientUid = String()
    override func viewDidLoad() {
        super.viewDidLoad()
        if let patientUID = defaults.valueForKey("patientUID") as? String {
            patientUid = patientUID
        }
        appointmentApi.getListAppointmentByUID(patientUid, Limit: "", completionHandler: {
            response in
            print(response)
        })
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - Table view data source

    override func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        return 0
    }

    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        return 0
    }

   

}
