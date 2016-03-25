//
//  BaseViewController.swift
//  VgoUserApp
//
//  Created by admin on 02/02/16.
//  Copyright © 2016 Trung.Vu. All rights reserved.
//

import UIKit

class BaseViewController: UIViewController,DTAlertViewDelegate {
    
    var alertView: DTAlertView!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    // show alert with param
    func showAlertWithMessageTitle(message: String, title: String, alertStyle: DTAlertStyle){
        self.alertView = DTAlertView(alertStyle: alertStyle, message: message, title: title, object: self)
        self.alertView.show()
    }
    
    func leftNavButtonClick(sender:UIButton!)
    {
        self.navigationController?.popViewControllerAnimated(true)
    }
    //MARK: - deletate DT ALERT
    func willPresentDTAlertView(alertView: DTAlertView) {
        NSLog("%@", "will present")
    }
    func didPresentDTAlertView(alertView: DTAlertView) {
        NSLog("%@", "Did present")
    }
    func DTAlertViewWillDismiss(alertView: DTAlertView) {
        NSLog("%@", "Will Dismiss")
    }
    func DTAlertViewDidDismiss(alertView: DTAlertView) {
        NSLog("%@", "did Dismiss")
    }
}
