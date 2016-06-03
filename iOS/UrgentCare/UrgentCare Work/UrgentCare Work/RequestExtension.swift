//
//  Request+Extension.swift
//  StoreApp
//
//  Created by admin on 18/02/16.
//  Copyright © 2016 HarveyNash. All rights reserved.
//

import Foundation
import Alamofire

public extension UIDevice {
    
    var modelName: String {
        var systemInfo = utsname()
        uname(&systemInfo)
        let machineMirror = Mirror(reflecting: systemInfo.machine)
        let identifier = machineMirror.children.reduce("") { identifier, element in
            guard let value = element.value as? Int8 where value != 0 else { return identifier }
            return identifier + String(UnicodeScalar(UInt8(value)))
        }
        return identifier
    }
    
}