//
//  LoadingAnimation.swift
//  StoreApp
//
//  Created by Hien Le on 2/19/16.
//  Copyright © 2016 HarveyNash. All rights reserved.
//

import UIKit

class LoadingAnimation {
    
    class func showLoading() {
        
        let adelegate : AppDelegate = UIApplication.sharedApplication().delegate as! AppDelegate
        
        let animationView = RPLoadingAnimationView(
            frame: CGRect(origin: CGPointZero, size: (Utility.getTopViewController()?.view.frame.size)!),
            type: RPLoadingAnimationType.SpininngDot,
            color: UIColor.mainColor(),
            size: CGSizeMake(80, 80)
        )
        animationView.tag = 999
        animationView.setupAnimation()
        
    
        adelegate.window?.addSubview(animationView)
    }
    class func stopLoading() {
        let adelegate : AppDelegate = UIApplication.sharedApplication().delegate as! AppDelegate
        for (var i = 0; i < adelegate.window?.subviews.count; i += 1) {
            let view = adelegate.window?.subviews[i]
            if view?.tag == 999 || view?.tag == 991{
                view?.removeFromSuperview()
            }
        }
    }
    
}
