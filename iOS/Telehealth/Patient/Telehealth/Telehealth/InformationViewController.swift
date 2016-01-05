//
//  InformationViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/23/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit

class InformationViewController: UIViewController {
    let api = GetAndPostDataController()
    

   
    @IBOutlet weak var fullName: UILabel!
    @IBOutlet weak var dobLabel: UILabel!
    @IBOutlet weak var suburbLabel: UILabel!
    @IBOutlet weak var postCodeLabel: UILabel!
    @IBOutlet weak var countryLabel: UILabel!
    @IBOutlet weak var addressLabel: UILabel!
    @IBOutlet weak var emailLabel: UILabel!
    @IBOutlet weak var homePhoneLabel: UILabel!
    @IBOutlet weak var avarta: UIImageView!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        
      
    }
    override func viewWillAppear(animated: Bool) {
        getInformationPatient()
    }
    
    //get information patient
    func getInformationPatient(){
        if let uuid = defaults.valueForKey("uid") as? String {
            
            api.getInformationPatientByUUID(uuid){
                response in
                
                if response["message"] == "success" {
                    self.view.hideLoading()
                    self.avarta.image = PatientInfo.Image
                    self.fullName.text = PatientInfo.FirstName + " " + PatientInfo.MiddleName + " " + PatientInfo.LastName
                    self.dobLabel.text = (PatientInfo.DOB).toDateTimeZone(formatTime.dateTime, format: formatTime.formatDate)
                    self.suburbLabel.text = PatientInfo.Suburb
                    self.postCodeLabel.text = PatientInfo.Postcode
                    self.countryLabel.text = PatientInfo.Country
                    self.addressLabel.text = PatientInfo.Address1
                    self.emailLabel.text = PatientInfo.Email1
                    self.homePhoneLabel.text = PatientInfo.HomePhoneNumber
                } else if response["message"] == "error"{
                    self.alertMessage("Error", message: response["ErrorType"].string!)
                }else {
                    self.view.hideLoading()
                    if response["TimeOut"].string ==  ErrorMessage.TimeOut {
                        self.alertMessage("Error", message: ErrorMessage.TimeOut)
                    }else if response["message"].string == ErrorMessage.TimeOutToken {
                         
                    }else {
                        let message : String = String(response["ErrorsList"][0])
                        self.alertMessage("Error", message: message)
                    }
                }
            }
        }

    }
    
    override func touchesBegan(touches: Set<UITouch>, withEvent event: UIEvent?) {
        view.endEditing(true)
    }
    //Giap: Show alert message
    func alertMessage(title : String,message : String){
        let alertController = UIAlertController(title: title, message: message, preferredStyle: .Alert)
        let OKAction = UIAlertAction(title: "OK", style: .Default) { (action) in
            //Handle if click OK
        }
        alertController.addAction(OKAction)
        
        self.presentViewController(alertController, animated: true) {
            
        }
    }
    
    
    //handle logout
    @IBAction func LogoutAction(sender: AnyObject) {
        
        let alertController = UIAlertController(title: "Unregistered", message: "Are you sure you want to unregister? This will delete your user account on this device.", preferredStyle: .Alert)
        
        let cancelAction = UIAlertAction(title: "Cancel", style: .Cancel) { (action) in
        }
        alertController.addAction(cancelAction)
        
        let OKAction = UIAlertAction(title: "OK", style: .Default) { (action) in
           
            if let uuid = defaults.valueForKey("uid") as? String {
                self.api.updateTokenPush(uuid,deviceToken:"")
            }
            
            self.api.logOut({
            response in
                print(response)
                if response["status"] == "success"{
                    statusCallingNotification = ""
                    let defaults = NSUserDefaults.standardUserDefaults()
                    defaults.removeObjectForKey("verifyUser")
                    defaults.synchronize()
                    sharedSocket.socket.disconnect()
                  

                    self.performSegueWithIdentifier("logoutSegue", sender: self)
                }
                
            })
            
        }
        alertController.addAction(OKAction)
        
        self.presentViewController(alertController, animated: true) {
            // ...
        }
        
    }
    
    
}


