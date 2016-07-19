//
//  Request+Extension.swift
//  UrgentCare Work
//
//  Created by Meditek on 7/13/16.
//  Copyright © 2016 Nguyen Duc Manh. All rights reserved.
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

extension NSDate {
    
    func startOfMonth() -> NSDate? {
        guard
            let cal: NSCalendar = NSCalendar.currentCalendar(),
            let comp: NSDateComponents = cal.components([.Year, .Month], fromDate: self) else { return nil }
        comp.to12pm()
        return cal.dateFromComponents(comp)!
    }
    
    func endOfMonth() -> NSDate? {
        guard
            let cal: NSCalendar = NSCalendar.currentCalendar(),
            let comp: NSDateComponents = NSDateComponents() else { return nil }
        comp.month = 1
        comp.day -= 1
        comp.to12pm()
        return cal.dateByAddingComponents(comp, toDate: self.startOfMonth()!, options: [])!
    }
}

internal extension NSDateComponents {
    func to12pm() {
        self.hour = 12
        self.minute = 0
        self.second = 0
    }
}