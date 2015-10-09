//
//  InformationViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/23/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit

class InformationViewController: UIViewController {
    let InformationPatient = VerifyPhoneNumberController()
    var uid = String()
    override func viewDidLoad() {
        super.viewDidLoad()
       
        if let uuid = defaults.valueForKey("UserInformation") as? String {
            uid = uuid
           
        }
        InformationPatient.getInformationPatientByUUID(uid){
            response in
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

}
