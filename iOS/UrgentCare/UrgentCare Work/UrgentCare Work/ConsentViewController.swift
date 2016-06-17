//
//  ConsentViewController.swift
//  UrgentCare Work
//
//  Created by Meditek on 6/16/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit

class ConsentViewController: BaseViewController     {
    @IBOutlet weak var txtSupervisorName: UITextField!
    override func viewDidLoad() {
        super.viewDidLoad()
        txtSupervisorName.textFiledOnlyLine(txtSupervisorName)
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
