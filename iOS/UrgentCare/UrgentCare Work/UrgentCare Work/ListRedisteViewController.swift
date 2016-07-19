//
//  ListRedisteViewController.swift
//  UrgentCare Work
//
//  Created by Meditek on 7/13/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
//

import UIKit

class ListRedisteViewController: UIViewController {

    @IBOutlet weak var webContentView: UIWebView!
    var AppointmentUID = ""
    override func viewDidLoad() {
        super.viewDidLoad()
        webContentView.backgroundColor = UIColor.whiteColor()
        let urlString = Constants.UserURL.URL_EFORM + "/appointment?apptUID=" + AppointmentUID  + "&userUID=" + (Context.getDataDefasults(Define.keyNSDefaults.UserUID) as! String)
        print(urlString)
        NSURL.validateUrl(urlString, completion: { (success, urlString, error) -> Void in
            dispatch_async(dispatch_get_main_queue(), { () -> Void in
                if (success)
                {
                    self.webContentView.hidden = false
                    let request = NSURLRequest(URL: NSURL(string: urlString!)!)
                    self.webContentView.loadRequest(request)
                }
                else
                {
                    self.webContentView.stopLoading()
                    self.webContentView.hidden = true
                }
            })
        })
    }
    override func viewWillAppear(animated: Bool) {
         self.navigationController?.navigationBarHidden = true
    }
    @IBAction func ActionBack(sender: AnyObject) {
        self.navigationController?.popViewControllerAnimated(true)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
}
