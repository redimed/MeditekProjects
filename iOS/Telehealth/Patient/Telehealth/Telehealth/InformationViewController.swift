//
//  InformationViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/23/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit

class InformationViewController: UIViewController,signatureDelegate {
    
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
    @IBOutlet weak var imageSignature: UIImageView!
    
    
    @IBOutlet weak var phoneNumberLabel: UILabel!
    
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        //        avarta.layer.cornerRadius = CGRectGetWidth(avarta.frame) / 4.0
        //        avarta.clipsToBounds = true
        config.radiusAvatar(avarta)
        
        
    }
    override func viewWillAppear(animated: Bool) {
        getInformationPatient()
    }
    
    //get information patient
    func getInformationPatient(){
        
        if patientInformation != nil {
            
            if patientInformation.Image == nil {
                self.avarta.image =  UIImage(named: "A1a Copy 2.png")!
                self.patientService.getImage((patientInformation?.ImageUID)!, completionHandler: { image in
                    self.avarta.image = image
                    self.patientInformation.Image = image
                })
            }else {
                self.avarta.image = patientInformation.Image
            }
            if patientInformation.SignatureUID != nil {
                if imageSignature.image == nil {
                    self.patientService.getImage((patientInformation.SignatureUID)!, completionHandler: { image in
                        self.imageSignature.image = image
                        
                    })
                }
            }
            self.fullName.text = patientInformation!.FirstName + " " + patientInformation!.MiddleName + " " + patientInformation!.LastName
            self.dobLabel.text = (patientInformation!.DOB).toDateTimeZone(formatTime.dateTime, format: formatTime.formatDate)
            self.suburbLabel.text = patientInformation!.Suburb
            self.postCodeLabel.text = patientInformation!.Postcode
            self.countryLabel.text = patientInformation!.Country
            self.addressLabel.text = patientInformation!.Address1
            self.emailLabel.text = patientInformation!.Email
            self.homePhoneLabel.text = patientInformation!.HomePhoneNumber
            self.phoneNumberLabel.text = patientInformation.PhoneNumber
            
            
        }
        
    }
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if segue.identifier == "updateProfileSegue" {
            let updateProfile = segue.destinationViewController as! UpdateProfileViewController
            updateProfile.patientInformation = patientInformation
        }else if segue.identifier == "updateSignatureSegue"{
            let updateSignature = segue.destinationViewController as! SignatureViewController
            updateSignature.delegate = self
            updateSignature.patientUID = patientInformation.UID
        }
    }
    
    
    
    
    
    //handle logout
    @IBAction func LogoutAction(sender: AnyObject) {
        
    }
    
    //undwid home
    @IBAction func unwindToProfile(segue:UIStoryboardSegue) {
        //check back controller to unwind
        
        
    }
    
    func updateSignature(controller: SignatureViewController, sender: UIImage,imageUID:String) {
        
        patientInformation.SignatureUID = imageUID
        imageSignature.image = sender
        
    }
    
    
    
}


