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
    var uid = String()
    
    @IBOutlet weak var fullName: DesignableLabel!
    @IBOutlet weak var dobLabel: DesignableLabel!
    @IBOutlet weak var genderLabel: DesignableLabel!
    @IBOutlet weak var suburbLabel: DesignableLabel!
    @IBOutlet weak var postCodeLabel: DesignableLabel!
    @IBOutlet weak var countryLabel: DesignableLabel!
    @IBOutlet weak var addressLabel: DesignableLabel!
    @IBOutlet weak var emailLabel: DesignableLabel!
    @IBOutlet weak var homePhoneLabel: DesignableLabel!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.view.showLoading()
        if let uuid = defaults.valueForKey("uid") as? String {
            uid = uuid
            
        }
       
        InformationPatient.getInformationPatientByUUID(uid){
            response in
            
            if response["message"] == "success" {
                self.view.hideLoading()
                let jsonInformation = response["data"][0]
                self.fullName.text = jsonInformation["FirstName"].string! + " " + jsonInformation["MiddleName"].string! + " " + jsonInformation["LastName"].string!
                self.dobLabel.text = (jsonInformation["DOB"].string)?.toDate()
                self.suburbLabel.text = jsonInformation["Suburb"].string
                self.postCodeLabel.text = jsonInformation["Postcode"].string
                self.countryLabel.text = jsonInformation["Country"]["ShortName"].string
                self.addressLabel.text = jsonInformation["Address"].string
                self.emailLabel.text = jsonInformation["Email"].string
                self.homePhoneLabel.text = jsonInformation["HomePhoneNumber"].string
                self.genderLabel.text = (jsonInformation["Gender"].string)?.toGender()
            }else {
                self.view.hideLoading()
                if response["TimeOut"] ==  "Request Time Out" {
                    self.alertMessage("Error", message: "Request Time Out")
                }else {
                    let message : String = String(response["ErrorsList"][0])
                    self.alertMessage("Error", message: message)
                }
                
            }
           print(response)
        }
        
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
            
        }
        alertController.addAction(OKAction)
        
        self.presentViewController(alertController, animated: true) {
            
        }
    }

    
    
}


