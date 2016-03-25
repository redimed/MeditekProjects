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
    
    }
}