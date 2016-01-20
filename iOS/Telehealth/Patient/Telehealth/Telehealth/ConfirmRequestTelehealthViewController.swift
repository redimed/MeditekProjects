//
//  ConfirmRequestTelehealthViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 1/20/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit

class ConfirmRequestTelehealthViewController: UIViewController {
    var telehealthData = TelehealthContainer!()
    let requestTelehealthService = RequestTelehealthService()
    @IBOutlet weak var emailLabel: UILabel!
    @IBOutlet weak var dobLabel: UILabel!
    @IBOutlet weak var surburbLabel: UILabel!
    @IBOutlet weak var phoneNumberLabel: UILabel!
    @IBOutlet weak var fullNameLabel: UILabel!
    @IBOutlet weak var dateTime: UILabel!
    override func viewDidLoad() {
        super.viewDidLoad()
        dateTime.text = requestTelehealthService.NowDate()
        
        fullNameLabel.text = "\(telehealthData.FirstName) \(telehealthData.LastName)"
        phoneNumberLabel.text = "Phone: " + telehealthData.PhoneNumber
        surburbLabel.text = "Suburb: " + telehealthData.Suburb
        dobLabel.text = "Date of Birth: " + telehealthData.DOB
        emailLabel.text = "Email: " + telehealthData.Email1
        
        print(telehealthData.imageTelehealth)
    }

 
    @IBAction func completeRequestAction(sender: AnyObject) {
        
    }


}
