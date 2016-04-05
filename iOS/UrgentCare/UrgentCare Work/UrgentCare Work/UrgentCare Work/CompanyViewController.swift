//
//  CompanyViewController.swift
//  UrgentCare Work
//
//  Created by Meditek on 3/25/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit

class CompanyViewController: BaseViewController {


    var arrayTitle = ["Company Information", "Accounts", "", "", ""]
    var StringIncompleteProfile :String = "Incomplete Profile"
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.navigationItem.title = "Company"
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    override func viewWillAppear(animated: Bool) {
        self.navigationController?.navigationBarHidden = false
        self.navigationController?.navigationBar.topItem?.title = "Back"
    }
}
