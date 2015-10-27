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
    var messageFrom = String()
    
    @IBOutlet weak var imageView: UIImageView!
    
    
    @IBOutlet weak var btnHomeView: DesignableButton!
    @IBOutlet weak var avatarImageView: UIImageView!
    @IBOutlet weak var naviProfile: UINavigationBar!
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
                    self.emailLabel.text = PatientInfo.Email
                    self.homePhoneLabel.text = PatientInfo.HomePhoneNumber
                } else if response["message"] == "error"{
                    self.alertMessage("Error", message: ErrorMessage.NoData)
                }else {
                    self.view.hideLoading()
                    if response["TimeOut"].string ==  ErrorMessage.TimeOut {
                        self.alertMessage("Error", message: ErrorMessage.TimeOut)
                    }else {
                        let message : String = String(response["ErrorsList"][0])
                        self.alertMessage("Error", message: message)
                    }
                }
            }
        }
        //Check message show button if change from Verify to PatientInfo
        if messageFrom == "VerifyToProfile" {
            btnHomeView.hidden = false
            naviProfile.hidden = false
        }
    }
    override func viewWillAppear(animated: Bool) {
        //Set image
        let imageName = "A1a Copy 2.png"
        let image = UIImage(named: imageName)
        avatarImageView.image = image
        imageView.image = image
        
        
        //cicle image view
        avatarImageView.layer.cornerRadius = avatarImageView.frame.size.width / 2
        avatarImageView.clipsToBounds = true;
        avatarImageView.layer.borderWidth = 2.0
        avatarImageView.layer.borderColor = UIColor.whiteColor().CGColor
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
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


