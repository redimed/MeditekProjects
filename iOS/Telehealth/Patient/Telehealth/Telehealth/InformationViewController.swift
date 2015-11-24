//
//  InformationViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/23/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit

class InformationViewController: UIViewController {
    let InformationPatient = GetAndPostDataController()
    

   
    @IBOutlet weak var fullName: UILabel!
    @IBOutlet weak var dobLabel: UILabel!
    @IBOutlet weak var suburbLabel: UILabel!
    @IBOutlet weak var postCodeLabel: UILabel!
    @IBOutlet weak var countryLabel: UILabel!
    @IBOutlet weak var addressLabel: UILabel!
    @IBOutlet weak var emailLabel: UILabel!
    @IBOutlet weak var homePhoneLabel: UILabel!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        
      
    }
    override func viewWillAppear(animated: Bool) {
        getInformationPatient()
    }
    
    //get information patient
    func getInformationPatient(){
        if let uuid = defaults.valueForKey("uid") as? String {
            InformationPatient.getInformationPatientByUUID(uuid){
                response in
                if response["message"] == "success" {
                    self.view.hideLoading()
                    self.fullName.text = PatientInfo.FirstName + " " + PatientInfo.MiddleName + " " + PatientInfo.LastName
                    self.dobLabel.text = (PatientInfo.DOB).toDateTimeZone(formatTime.dateTime, format: formatTime.formatDate)
                    self.suburbLabel.text = PatientInfo.Suburb
                    self.postCodeLabel.text = PatientInfo.Postcode
                    self.countryLabel.text = PatientInfo.Country
                    self.addressLabel.text = PatientInfo.Address1
                    self.emailLabel.text = PatientInfo.Email1
                    self.homePhoneLabel.text = PatientInfo.HomePhoneNumber
                } else if response["message"] == "error"{
                    self.alertMessage("Error", message: ErrorMessage.NoData)
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
    
    
    
}


