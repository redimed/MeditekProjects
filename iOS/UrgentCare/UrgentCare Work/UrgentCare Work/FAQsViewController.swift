//
//  FAQsViewController.swift
//  UrgentCare Sport
//
//  Created by Nguyen Duc Manh on 11/3/15.
//  Copyright © 2015 Nguyen Duc Manh. All rights reserved.
//

import UIKit

class FAQsViewController: UIViewController {
    var fileName = String()
    var navigationBarString = String()
    
    @IBOutlet weak var navigationBar: UINavigationBar!
    @IBOutlet weak var webView: UIWebView!
    override func viewDidLoad() {
        super.viewDidLoad()
        navigationBar.topItem?.title = navigationBarString
        let localfilePath = NSBundle.mainBundle().URLForResource(fileName, withExtension: "html");
        let myRequest = NSURLRequest(URL: localfilePath!);
        webView.loadRequest(myRequest);
    }
    override func viewWillAppear(animated: Bool) {
        self.navigationController?.navigationBarHidden = true
    }
        

}
