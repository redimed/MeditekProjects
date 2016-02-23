//
//  InformationViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/23/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit

class InformationViewController: UIViewController {
    
    let patientService = PatientService()
    let alertView = UIAlertView()
    var patientInformation : PatientContainer!
   
    @IBOutlet weak var fullName: UILabel!
    @IBOutlet weak var dobLabel: UILabel!
    @IBOutlet weak var suburbLabel: UILabel!
    @IBOutlet weak var postCodeLabel: UILabel!
    @IBOutlet weak var countryLabel: UILabel!
    @IBOutlet weak var addressLabel: UILabel!
    @IBOutlet weak var emailLabel: UILabel!
    @IBOutlet weak var homePhoneLabel: UILabel!
    @IBOutlet weak var avarta: UIImageView!
    
    @IBOutlet weak var phoneNumberLabel: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        avarta.layer.cornerRadius = CGRectGetWidth(avarta.frame) / 4.0
        avarta.clipsToBounds = true  
      
    }
    override func viewWillAppear(animated: Bool) {
        getInformationPatient()
    }
    
    //get information patient
    func getInformationPatient(){
                
        if patientInformation != nil {
            self.avarta.image = UIImage(named: "A1a Copy 2.png")!
            self.fullName.text = patientInformation!.FirstName + " " + patientInformation!.MiddleName + " " + patientInformation!.LastName
            self.dobLabel.text = (patientInformation!.DOB).toDateTimeZone(formatTime.dateTime, format: formatTime.formatDate)
            self.suburbLabel.text = patientInformation!.Suburb
            self.postCodeLabel.text = patientInformation!.Postcode
            self.countryLabel.text = patientInformation!.Country
            self.addressLabel.text = patientInformation!.Address1
            self.emailLabel.text = patientInformation!.Email1
            self.homePhoneLabel.text = patientInformation!.HomePhoneNumber
            self.phoneNumberLabel.text = patientInformation.PhoneNumber
            self.patientService.getImage((patientInformation?.ImageUID)!, completionHandler: { image in
                self.avarta.image = image
            })
        }
        
        
    
    }
    
    override func touchesBegan(touches: Set<UITouch>, withEvent event: UIEvent?) {
        view.endEditing(true)
    }
    
    
    
    //handle logout
    @IBAction func LogoutAction(sender: AnyObject) {
               
    }
    
    
}


