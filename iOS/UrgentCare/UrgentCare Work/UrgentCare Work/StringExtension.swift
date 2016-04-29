//
//  String+Cusome.swift
//  VgoUserApp
//
//  Created by admin on 31/01/16.
//  Copyright © 2016 Trung.Vu. All rights reserved.
//

import Foundation
import UIKit
extension String {
    
    var capitalizeFirst:String {
        var result = self
        result.replaceRange(startIndex...startIndex, with: String(self[startIndex]).capitalizedString)
        return result
    }
    
    func heightWithConstrainedWidth(width: CGFloat, font: UIFont) -> CGFloat {
        let constraintRect = CGSize(width: width, height: CGFloat.max)
        
        let boundingBox = self.boundingRectWithSize(constraintRect, options: NSStringDrawingOptions.UsesLineFragmentOrigin, attributes: [NSFontAttributeName: font], context: nil)
        
        return boundingBox.height
    }
    
    func toDateTimeZone(time:String,format:String) -> String
    {
        let dateFormatter = NSDateFormatter()
        dateFormatter.dateFormat = time
        let date = dateFormatter.dateFromString(self)
        if date != nil {
            dateFormatter.dateFormat = format
            let timeStamp = dateFormatter.stringFromDate(date!)
            return String(timeStamp)
        }else {
            return String(self)
        }
    }

}