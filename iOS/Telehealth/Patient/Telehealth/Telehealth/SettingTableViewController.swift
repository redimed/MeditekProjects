//
//  SettingTableViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 1/18/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit
import SwiftyJSON
class SettingTableViewController: UITableViewController ,DTAlertViewDelegate {
    let patientService = PatientService()
    let alertView = UIAlertView()
    var patientInformation : PatientContainer!
    let api = TokenAPI()
    let verifyPhoneAPI = VerifyPhoneAPI()
    @IBOutlet weak var emailLabel: UILabel!
    @IBOutlet weak var userNameLabel: UILabel!
    @IBOutlet weak var deviceID: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.tableView.tableFooterView = UIView(frame: CGRect.zero)
        let leftButton =  UIBarButtonItem(title: "Back", style:  UIBarButtonItemStyle.Plain, target: self, action: "backButtonAction")
        
        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        self.navigationItem.leftBarButtonItem = leftButton
        self.navigationItem.title = "Setting"
        deviceID.text = UIDevice.currentDevice().identifierForVendor!.UUIDString
    }
    
    
    
    func backButtonAction(){
        self.dismissViewControllerAnimated(true, completion: nil)
    }
    
    override func viewWillAppear(animated: Bool) {
        getInformationPatient()
    }
    
    //get information patient
    func getInformationPatient(){
        //self.view.showLoading()
        if let uuid = defaults.valueForKey("uid") as? String {
            
            patientService.getInformationPatientByUUID(uuid){
                message , data in
                
                if message["message"] == "success" {
                    //self.view.hideLoading()
                    self.patientInformation = data!
                    self.setDataToForm()
                } else if message["message"] == "error"{
                   // self.view.hideLoading()
                    self.alertView.alertMessage("Error", message: message["ErrorType"].string!)
                }else {
                    
                    if message["TimeOut"].string ==  ErrorMessage.TimeOut {
                      //  self.view.hideLoading()
                        self.alertView.alertMessage("Error", message: ErrorMessage.TimeOut)
                    }else if message["message"].string == ErrorMessage.TimeOutToken {
                        //self.view.hideLoading()
                    }else {
                       // self.view.hideLoading()
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
            self.view.showLoading()
            if let uuid = defaults.valueForKey("uid") as? String {
                self.api.updateTokenPush(uuid,deviceToken:"")
            }
            self.verifyPhoneAPI.logOut((defaults.valueForKey("uid") as? String)!,completionHandler: {
                response in
                print(response)
                if response["status"] == "success"{
                    self.view.hideLoading()
                    self.patientService.logOut()
                    self.performSegueWithIdentifier("logOutUnwind", sender: self)
                    
                }else{
                    self.view.hideLoading()
                    let defaults : NSUserDefaults = NSUserDefaults.standardUserDefaults()
                    defaults.setValue("Fail", forKey: "logoutFail")
                    defaults.setValue(defaults.valueForKey("uid") as? String, forKey: "UIDLogoutFail")
                    defaults.synchronize()
                    self.patientService.logOut()
                    self.performSegueWithIdentifier("logOutUnwind", sender: self)
                }
            })
        }
        alertController.addAction(OKAction)
        
        self.presentViewController(alertController, animated: true) {
           self.view.hideLoading()
        }
        
    }
    //MARK: - deletate DT ALERT
    func willPresentDTAlertView(alertView: DTAlertView) {
        NSLog("%@", "will present")
    }
    func didPresentDTAlertView(alertView: DTAlertView) {
        NSLog("%@", "Did present")
    }
    func DTAlertViewWillDismiss(alertView: DTAlertView) {
        NSLog("%@", "Will Dismiss")
    }
    func DTAlertViewDidDismiss(alertView: DTAlertView) {
        NSLog("%@", "did Dismiss")
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
