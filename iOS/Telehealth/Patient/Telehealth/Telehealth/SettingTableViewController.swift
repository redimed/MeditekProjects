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
    let api = TokenAPI()
    let verifyPhoneAPI = VerifyPhoneAPI()
    @IBOutlet weak var emailLabel: UILabel!
    @IBOutlet weak var userNameLabel: UILabel!
    
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
        self.view.showLoading()
        if let uuid = defaults.valueForKey("uid") as? String {
            
            patientService.getInformationPatientByUUID(uuid){
                message , data in
                
                if message["message"] == "success" {
                    self.view.hideLoading()
                    self.patientInformation = data!
                    self.setDataToForm()
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
    
    func setDataToForm(){
        emailLabel.text = patientInformation.PhoneNumber
        userNameLabel.text = "\(patientInformation.FirstName ) \(patientInformation.LastName)"
    }
    
    @IBAction func logoutButton(sender: AnyObject) {
        print("logout")
        
        let alertController = UIAlertController(title: "Logout", message: MessageString.MessageLogout, preferredStyle: .Alert)
        
        let cancelAction = UIAlertAction(title: "Cancel", style: .Cancel) { (action) in
        }
        alertController.addAction(cancelAction)
        
        let OKAction = UIAlertAction(title: "OK", style: .Default) { (action) in
            if let uuid = defaults.valueForKey("uid") as? String {
                self.api.updateTokenPush(uuid,deviceToken:"")
            }
            self.verifyPhoneAPI.logOut({
                response in
                print(response)
                if response["status"] == "success"{
                    self.patientService.logOut()
                    self.performSegueWithIdentifier("logOutUnwind", sender: self)
                }
            })
        }
        alertController.addAction(OKAction)
        
        self.presentViewController(alertController, animated: true) {
            // ...
        }
        
    }
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if segue.identifier == "informationSegue" {
            let info = segue.destinationViewController as! InformationViewController
            info.patientInformation = patientInformation
        }else if segue.identifier == "Aboutsegue"{
            let FAQs = segue.destinationViewController as! FAQsViewController
            FAQs.titleString = "ABOUT US"
        }

    }
    
    
    
}
