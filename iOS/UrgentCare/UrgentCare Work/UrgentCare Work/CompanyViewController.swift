//
//  CompanyViewController.swift
//  UrgentCare Work
//
//  Created by Meditek on 3/25/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit
import ObjectMapper

class CompanyViewController: BaseViewController {

    var companyInfo = DetailCompanyResponse()
    
    @IBOutlet weak var txtName: UITextField!
    @IBOutlet weak var txtAddress: UITextField!
    @IBOutlet weak var txtSuburb: UITextField!
    @IBOutlet weak var txtPostCode: UITextField!
    @IBOutlet weak var txtState: UITextField!
    
    var site = Site()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.navigationItem.title = "Company"
        
        if let companyInfoDict:NSDictionary = Context.getDataDefasults(Define.keyNSDefaults.companyInfor) as? NSDictionary {
            companyInfo = Mapper().map(companyInfoDict)!
        }
        if(companyInfo.data.count > 0){
           txtName.text = companyInfo.data[0].CompanyName
        }
        
        txtAddress.text = site.Address1
        txtSuburb.text = site.Suburb
        txtPostCode.text = site.Postcode
        txtState.text = site.State
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    override func viewWillAppear(animated: Bool) {
        self.navigationController?.navigationBarHidden = false
        self.navigationController?.navigationBar.topItem?.title = "Back"
    }
}
