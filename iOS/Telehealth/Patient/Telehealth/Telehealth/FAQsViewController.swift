//
//  FAQsViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 10/13/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit

class FAQsViewController: UIViewController {
    @IBOutlet weak var webView: UIWebView!
  
        override func viewDidLoad() {
        super.viewDidLoad()
            let localfilePath = NSBundle.mainBundle().URLForResource("FAQs", withExtension: "html");
            let myRequest = NSURLRequest(URL: localfilePath!);
            webView.loadRequest(myRequest);
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    


}
