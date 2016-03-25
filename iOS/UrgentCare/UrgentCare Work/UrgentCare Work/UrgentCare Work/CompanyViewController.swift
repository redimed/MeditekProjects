//
//  CompanyViewController.swift
//  UrgentCare Work
//
//  Created by Meditek on 3/25/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import UIKit

class CompanyViewController: UIViewController ,UITableViewDelegate ,UITableViewDataSource {

    @IBOutlet weak var tableView: UITableView!

    var arrayTitle = ["Company Information", "Accounts", "", "", ""]
    var StringIncompleteProfile :String = "Incomplete Profile"
    
    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.delegate = self
        tableView.dataSource = self
        self.navigationItem.title = "Company"
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    override func viewWillAppear(animated: Bool) {
        self.navigationController?.navigationBarHidden = false
        self.navigationController?.navigationBar.topItem?.title = "Back"
    }
    func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return 1
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 5
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        return UITableViewCell()
    }
    func tableView(tableView: UITableView, titleForHeaderInSection section: Int) -> String?
    {
        return arrayTitle[section]
    }

}
