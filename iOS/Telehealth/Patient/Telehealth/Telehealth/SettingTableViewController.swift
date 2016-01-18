//
//  SettingTableViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 1/18/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit
import SwiftyJSON
class SettingTableViewController: UITableViewController {
    let patientService = PatientService()
    let alertView = UIAlertView()
    var patientInformation : PatientContainer!
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.tableView.tableFooterView = UIView(frame: CGRect.zero)
        let leftButton =  UIBarButtonItem(title: "Back", style:  UIBarButtonItemStyle.Plain, target: self, action: "backButtonAction")

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
         self.navigationItem.leftBarButtonItem = leftButton
        self.navigationItem.title = "Setting"
    }
    
  
    
    func backButtonAction(){
        self.dismissViewControllerAnimated(true, completion: nil)
    }
    
    override func viewWillAppear(animated: Bool) {
        getInformationPatient()
    }
    
    //get information patient
    func getInformationPatient(){
        if let uuid = defaults.valueForKey("uid") as? String {
            
            patientService.getInformationPatientByUUID(uuid){
                message , data in
                
                if message["message"] == "success" {
                    self.view.hideLoading()
                    self.patientInformation = data!
                    
                } else if message["message"] == "error"{
                    self.alertView.alertMessage("Error", message: message["ErrorType"].string!)
                }else {
                    self.view.hideLoading()
                    if message["TimeOut"].string ==  ErrorMessage.TimeOut {
                        self.alertView.alertMessage("Error", message: ErrorMessage.TimeOut)
                    }else if message["message"].string == ErrorMessage.TimeOutToken {
                        
                    }else {
                        let message : String = String(message["ErrorsList"][0])
                        self.alertView.alertMessage("Error", message: message)
                    }
                }
            }
        }
    }
    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if segue.identifier == "informationSegue" {
            let info = segue.destinationViewController as! InformationViewController
            info.patientInformation = patientInformation
        }
    }
    

}
