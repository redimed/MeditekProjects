//
//  UIColorExtension.swift
//  StoreApp
//
//  Created by Hien Le on 2/19/16.
//  Copyright © 2016 HarveyNash. All rights reserved.
//

import Foundation

extension UIColor {
    
    class func mainColor()-> UIColor {
        
        return UIColor(red: 47, green: 166, blue: 254)
    }
    
    convenience init(red: Int, green: Int, blue: Int)
    {
        let newRed = CGFloat(red)/255
        let newGreen = CGFloat(green)/255
        let newBlue = CGFloat(blue)/255
        
        self.init(red: newRed, green: newGreen, blue: newBlue, alpha: 1.0)
    }
    class func colorAlertError() -> UIColor {
        return UIColor (red: 0.655, green: 0.000, blue: 0.060, alpha: 1.0)
    }
    class func colorAlertSuccess() -> UIColor {
        return UIColor (red: 0.078, green: 0.596, blue: 0.243, alpha: 1.0)
    }
    class func colorAlertInfo() -> UIColor {
        return UIColor (red: 1.000, green: 0.517, blue: 0.000, alpha: 1.000)
    }
    class func colorBackgroundAlert() -> UIColor {
        return UIColor(red: 244, green: 244, blue: 244)
    }
    class func colorShadowBackground()-> UIColor {
        return UIColor(red: 149, green: 165, blue: 166)
    }
    class func corloBorder() -> UIColor {
        return UIColor(red: 201, green: 205, blue: 206)
    }
    
    class func colorClearBlack()->UIColor {
        return UIColor(hex: "333333")
    }
}
