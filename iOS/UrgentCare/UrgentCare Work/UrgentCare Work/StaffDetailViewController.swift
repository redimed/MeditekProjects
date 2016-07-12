//
//  StaffDetailViewController.swift
//  UrgentCare Work
//
//  Created by Meditek on 4/21/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit

class StaffDetailViewController: BaseViewController {
    var staff = DataPatientDetail()
    @IBOutlet weak var txtFirstName: UITextField!
    @IBOutlet weak var txtMiddleName: UITextField!
    @IBOutlet weak var txtLastName: UITextField!
    @IBOutlet weak var txtHomePhone: UITextField!
    @IBOutlet weak var txtDOB: UITextField!
    @IBOutlet weak var txtEmail: UITextField!
    @IBOutlet weak var txtAddress: UITextField!
    @IBOutlet weak var txtSuburb: UITextField!
    @IBOutlet weak var txtPostCode: UITextField!
    @IBOutlet weak var txtCountry: UITextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        txtFirstName.text = staff.data[0].FirstName
        txtMiddleName.text = staff.data[0].MiddleName
        txtLastName.text = staff.data[0].LastName
        txtHomePhone.text = staff.data[0].HomePhoneNumber
        txtDOB.text = staff.data[0].DOB
        txtEmail.text = staff.data[0].Email1
        txtAddress.text = staff.data[0].Address1
        txtSuburb.text = staff.data[0].Suburb
        txtPostCode.text = staff.data[0].Postcode
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
}
