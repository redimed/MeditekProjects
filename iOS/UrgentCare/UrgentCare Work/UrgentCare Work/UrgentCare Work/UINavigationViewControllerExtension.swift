//
//  UINavigationViewController+Customize.swift
//  AppPromotion
//
//  Created by IosDeveloper on 26/10/15.
//  Copyright © 2015 Trung.vu. All rights reserved.
//

import Foundation
import UIKit

extension UINavigationController {

    func pushViewControllerCustomize(viewController: UIViewController, animate:Bool)
    {
        self.pushViewController(viewController, animated: animate)
        NSLog("%@", "Custome Navi")
        
    }
     
}