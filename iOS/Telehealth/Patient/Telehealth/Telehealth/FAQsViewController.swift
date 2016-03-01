//
//  FAQsViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 10/13/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit

class FAQsViewController: UIViewController,UIWebViewDelegate {
    @IBOutlet weak var webView: UIWebView!
    @IBOutlet weak var titleLabel: UILabel!
    var hasFinishedLoading = false
    var titleString = String()
    override func viewDidLoad() {
        super.viewDidLoad()
        titleLabel.text = titleString
        let localfilePath = NSBundle.mainBundle().URLForResource(titleString, withExtension: "html");
        let myRequest = NSURLRequest(URL: localfilePath!);
        webView.loadRequest(myRequest);
        webView.delegate = self
    }

    deinit {
        webView.stopLoading()
        webView.delegate = nil
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    
}
