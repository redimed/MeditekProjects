//
//  ExtensionHandleData.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 10/12/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import Foundation

//Extension Handle
extension String
{
    func toDateTimeZone(time:String,format:String) -> String
    {
        let dateFormatter = NSDateFormatter()
        dateFormatter.dateFormat = time//this your string date format
        dateFormatter.timeZone = NSTimeZone(name: "UTC")
        let date = dateFormatter.dateFromString(self)
        
        dateFormatter.dateFormat = format///this is you want to convert format
        dateFormatter.timeZone = NSTimeZone(name: "UTC")
        let timeStamp = dateFormatter.stringFromDate(date!)
        //Return Parsed Date
        return String(timeStamp)
    }

    //Change format Male or Female
    func toGender() -> String
    {
        var gender = String()
        if self == "F" {
            gender = "Female"
        }else {
            gender = "Male"
        }
        return gender
    }
    

  
}