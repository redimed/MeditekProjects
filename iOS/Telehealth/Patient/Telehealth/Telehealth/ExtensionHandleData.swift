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
    //Format date time
    func toDate() -> String
    {
        let dateFormatter = NSDateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd"//this your string date format
        dateFormatter.timeZone = NSTimeZone(name: "UTC")
        let date = dateFormatter.dateFromString(self)
        
        dateFormatter.dateFormat = "dd/MM/yyyy"///this is you want to convert format
        dateFormatter.timeZone = NSTimeZone(name: "UTC")
        let timeStamp = dateFormatter.stringFromDate(date!)
        //Return Parsed Date
        return String(timeStamp)
    }
    func toDateTime() -> String
    {
        let dateFormatter = NSDateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"//this your string date format
        dateFormatter.timeZone = NSTimeZone(name: "UTC")
        let date = dateFormatter.dateFromString(self)
        
        dateFormatter.dateFormat = "dd/MM/yyyy HH:mm"///this is you want to convert format
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