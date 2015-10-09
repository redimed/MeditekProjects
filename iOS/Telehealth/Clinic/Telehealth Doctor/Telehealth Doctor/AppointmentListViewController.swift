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
    
    override func viewDidLoad() {
        super.viewDidLoad()
        navigationController?.navigationBar.tintColor = UIColor.whiteColor()
        /**
        Reload table view with new data receive from socket
        */
        NSNotificationCenter.defaultCenter().removeObserver(self, name: "reloadDataTable", object: nil)
        NSNotificationCenter.defaultCenter().addObserver(self, selector: "reloadTable:", name: "reloadDataTable", object: nil)
    }
    
    override func viewWillAppear(animated: Bool) {
        SingleTon.socket.emit("get", GET_ONLINE_USERS)
        Alamofire.request(.GET, GENERATESESSION).responseJSON() { data in
            let data = data.2.value!["data"] as! NSDictionary
            SingleTon.infoOpentok = JSON(data)
        }
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return SingleTon.onlineUser_Singleton.count
    }
    
    /**
    Reload data func for notification
    
    - parameter notification: notification center
    */
    func reloadTable(notification: NSNotification){
        print(SingleTon.onlineUser_Singleton.count)
        self.tableView.reloadData()
        tableView.tableFooterView = UIView(frame: CGRectZero)
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("cell", forIndexPath: indexPath) as! AppointmentTableViewCell
        
        let singletonOnlineUser = SingleTon.onlineUser_Singleton[indexPath.row]
        cell.noRows.text = singletonOnlineUser.userId
        cell.callButton.tag = Int(indexPath.row)
        cell.doctorName.text = singletonOnlineUser.UUID
        cell.note.text = "Lorem non isum..."
        cell.patientName.text = singletonOnlineUser.numberPhone
        cell.date.text = "17/10/2015"
        
        
        return cell
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if segue.identifier == "callAction" {
            if let indexPath = sender!.tag {
                let destinationController = segue.destinationViewController as! MakeCallViewController
                destinationController.idOnlineUser = indexPath
            }
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
}
