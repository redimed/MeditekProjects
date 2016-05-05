//
//  UIViewController+Customize.swift
//  AppPromotion
//
//  Created by IosDeveloper on 26/10/15.
//  Copyright © 2015 Trung.vu. All rights reserved.
//

import UIKit

extension UIViewController {
    
    private func removeInactiveViewController(inactiveViewController: UIViewController?) {
        if let inActiveVC = inactiveViewController {
            // call before removing child view controller's view from hierarchy
            inActiveVC.willMoveToParentViewController(nil)
            
            inActiveVC.view.removeFromSuperview()
            
            // call after removing child view controller's view from hierarchy
            inActiveVC.removeFromParentViewController()
        }
    }
    public func handleApiError(JSON: AnyObject?)
    {
        
    }
    public func showMessageNoNetwork()
    {
        let alert = UIAlertView()
        alert.title = "Warning"
        alert.message = "Not connect to server"
        alert.addButtonWithTitle("OK")
        alert.show()
    }
    
    func showloading(message:String){
        let alert = UIAlertController(title: nil, message : message , preferredStyle: .Alert)
        
        alert.view.tintColor = UIColor.blackColor()
        let loadingIndicator: UIActivityIndicatorView = UIActivityIndicatorView(frame: CGRectMake(10, 5, 50, 50)) as UIActivityIndicatorView
        loadingIndicator.hidesWhenStopped = true
        loadingIndicator.activityIndicatorViewStyle = UIActivityIndicatorViewStyle.Gray
        loadingIndicator.startAnimating();
        
        alert.view.addSubview(loadingIndicator)
        presentViewController(alert, animated: true, completion: nil)
    }
    func hideLoading(){
        dismissViewControllerAnimated(true, completion: nil)
    }
}