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
    func heightWithConstrainedWidth(width: CGFloat, font: UIFont) -> CGFloat {
        let constraintRect = CGSize(width: width, height: CGFloat.max)
        
        let boundingBox = self.boundingRectWithSize(constraintRect, options: NSStringDrawingOptions.UsesLineFragmentOrigin, attributes: [NSFontAttributeName: font], context: nil)
        
        return boundingBox.height
    }
}