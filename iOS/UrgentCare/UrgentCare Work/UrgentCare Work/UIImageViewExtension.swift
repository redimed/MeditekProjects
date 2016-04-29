//
//  UIImageView+Customize.swift
//  AppPromotion
//
//  Created by IosDeveloper on 27/10/15.
//  Copyright © 2015 Trung.vu. All rights reserved.
//

import Foundation
import UIKit
extension UIImageView {
    func makeImageViewAvatar()
    {
        self.layer.cornerRadius = self.frame.width / 2;
        self.layer.borderWidth = 1.0
        self.layer.borderColor = UIColor.whiteColor().CGColor
        self.clipsToBounds = true
        self.image = UIImage(named: "avatar")
    }
}