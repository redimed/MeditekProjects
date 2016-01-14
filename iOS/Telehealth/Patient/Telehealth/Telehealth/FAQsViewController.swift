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
    @IBOutlet weak var progress: UIProgressView!
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
    func webViewDidStartLoad(webView: UIWebView) {
        hasFinishedLoading = false
        updateProgress()
    }
    func webViewDidFinishLoad(webView: UIWebView) {
        delay(1) { [weak self] in
            if let _self = self {
                _self.hasFinishedLoading = true
            }
        }
    }
    deinit {
        webView.stopLoading()
        webView.delegate = nil
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func updateProgress() {
        if progress.progress >= 1 {
            progress.hidden = true
        } else {
            
            if hasFinishedLoading {
                progress.progress += 0.002
            } else {
                if progress.progress <= 0.3 {
                    progress.progress += 0.004
                } else if progress.progress <= 0.6 {
                    progress.progress += 0.002
                } else if progress.progress <= 0.9 {
                    progress.progress += 0.002
                } else if progress.progress <= 0.94 {
                    progress.progress += 0.0002
                } else {
                    progress.progress = 0.9401
                }
            }
            delay(0.008) { [weak self] in
                if let _self = self {
                    _self.updateProgress()
                }
            }
        }
    }

}
