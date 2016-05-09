//
//  StaffDetailViewController.swift
//  UrgentCare Work
//
//  Created by Meditek on 4/21/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit

class StaffDetailViewController: BaseViewController {
    var staff = Staff()
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
        txtFirstName.text = staff.FirstName
        txtMiddleName.text = staff.MiddleName
        txtLastName.text = staff.LastName
        txtHomePhone.text = staff.HomePhoneNumber
        txtDOB.text = staff.DOB
        txtEmail.text = staff.Email1
        txtAddress.text = staff.Address1
        txtSuburb.text = staff.Suburb
        txtPostCode.text = staff.Postcode
        
        print(staff)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
}
