//
//  ApiManager.swift
//  RedimedAfterHours
//
//  Created by DucManh on 9/18/15.
//  Copyright (c) 2015 DucManh. All rights reserved.
//

import Foundation
import UIKit
struct personal {
    static let keyOne = "firstName"
    static let keyTwo = "lastName"
    static let keyThree = "phoneNumber"
    static let keyFour = "email"
    static let keyFive = "DOB"
    static let keySeven = "DOBShow"
    static let keySive = "suburb"
}
class RestApiManager: NSObject {
    static let sharedInstance = RestApiManager()
    
    let phoneNumber = "0892300900"
    let url = "http://testapp.redimed.com.au:3001/api/urgent-care/urgent-request"
    //let url = "http://192.168.1.2:3001/api/urgent-care/urgent-request"
    
    func setPersonalData(data:Dictionary<String,String>,date:NSString){
        let defaults = NSUserDefaults.standardUserDefaults()
        var phonenumber = data["phoneNumber"]!.substringWithRange(Range<String.Index>(start: advance(data["phoneNumber"]!.startIndex, 3), end: data["phoneNumber"]!.endIndex))
        defaults.setValue(data["firstName"], forKey: personal.keyOne)
        defaults.setValue(data["lastName"], forKey: personal.keyTwo)
        defaults.setValue(phonenumber, forKey: personal.keyThree)
        defaults.setValue(data["email"], forKey: personal.keyFour)
        defaults.setValue(data["DOB"], forKey: personal.keyFive)
        defaults.setValue(data["suburb"], forKey: personal.keySive)
        defaults.setValue(date, forKey: personal.keySeven)
        defaults.synchronize()
    }
    
    func getPersonalData()->NSDictionary{
        var data: Dictionary<String, String> = [:]
       
        let defaults = NSUserDefaults.standardUserDefaults()
        data["firstName"] = defaults.stringForKey(personal.keyOne)
        data["lastName"] = defaults.stringForKey(personal.keyTwo)
        data["phoneNumber"] = defaults.stringForKey(personal.keyThree)
        data["email"] = defaults.stringForKey(personal.keyFour)
        data["DOB"] = defaults.stringForKey(personal.keyFive)
        data["suburb"] = defaults.stringForKey(personal.keySive)
        data["DOB"] = defaults.stringForKey(personal.keySeven)
        
        return data
    }
    
    func compareChangeValue(data:Dictionary<String,String>,dataCompare:Dictionary<String,String>)->Bool{
        
        var dataCompareResult:Dictionary<String,String> = [:]
         var phonenumber = dataCompare["phoneNumber"]!.substringWithRange(Range<String.Index>(start: advance(dataCompare["phoneNumber"]!.startIndex, 3), end: dataCompare["phoneNumber"]!.endIndex))
        dataCompareResult["firstName"] = dataCompare["firstName"]
        dataCompareResult["lastName"] = dataCompare["lastName"]
        dataCompareResult["phoneNumber"] = phonenumber
        dataCompareResult["email"] = dataCompare["email"]
        dataCompareResult["DOB"] = dataCompare["DOB"]
        dataCompareResult["suburb"] = dataCompare["suburb"]
        return NSDictionary(dictionary: data).isEqualToDictionary(dataCompareResult)
    }
    
}