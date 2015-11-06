//
//  FAQsViewController.swift
//  UrgentCare Sport
//
//  Created by Giap Vo Duc on 11/3/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
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

}
