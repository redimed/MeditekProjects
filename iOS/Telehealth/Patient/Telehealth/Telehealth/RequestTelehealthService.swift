//
//  RequestTelehealthService.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 1/19/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import Foundation
import SwiftyJSON
class RequestTelehealthService {
    let telehealthAPI = TelehealthAPI()
    func checkMaxLength(data:String,length:Int)->Bool{
        if data.characters.count > length {
            return false
        }else{
            return true
        }
    }
    func NowDate(formatDate:String = formatTime.dateTimeZone)->String{
        let nowdate = NSDate()
        var DateString:String = ""
        let dateFormatter = NSDateFormatter()
        dateFormatter.dateFormat = formatDate
        DateString = dateFormatter.stringFromDate(nowdate)
        return DateString
    }
    
    func borderTextFieldValid(textField:UITextField,color:UIColor,check:Bool = false){
        textField.attributedPlaceholder = NSAttributedString(string:textField.placeholder!,attributes: [NSForegroundColorAttributeName: color])
        if check == true {
            textField.textColor  = UIColor.blackColor()
        }else {
            textField.textColor = color
        }
    }
    
    func handleSearchData(pastUrls:[String],substring:String) -> [String]{
        let dataSource : [String] = pastUrls
        let searchString = substring.uppercaseString
        let predicate = NSPredicate(format: "SELF beginswith[c] %@", searchString)
        let searchDataSource = dataSource.filter { predicate.evaluateWithObject($0) }
        return searchDataSource
    }
    
    //check date
    func compareDate(dateDOB:NSDate)->Bool {
        let now = NSDate()
        if now.compare(dateDOB) == NSComparisonResult.OrderedDescending
        {
            return true
        } else
        {
            return false
        }
    }
    // load data from JSON file
    func loadDataJson() -> [String]{
        var pastUrls = [String]()
        if let path = NSBundle.mainBundle().pathForResource("Suburb", ofType: "json") {
            do {
                let data = try NSData(contentsOfURL: NSURL(fileURLWithPath: path), options: NSDataReadingOptions.DataReadingMappedIfSafe)
                let jsonObj = JSON(data: data)
                if jsonObj != JSON.null {
                    for var i = 0; i < jsonObj["suburb"].count; ++i {
                        let a = jsonObj["suburb"][i]["name"].string
                        pastUrls.append(a!)
                    }
                    return pastUrls
                    
                } else {
                    print("could not get json from file, make sure that file contains valid json.")
                }
            } catch let error as NSError {
                print(error.localizedDescription)
            }
        } else {
            print("Invalid filename/path.")
        }
        return pastUrls
    }
    
    
    func requestTelehealth(RequestDate:String,Type:String,Description:String,FirstName:String,LastName:String,PhoneNumber:String,HomePhoneNumber:String,Suburd:String,DOB:String,Email:String,FileUploads:[[String:String]],handler:(JSON) -> Void){
        telehealthAPI.requestTelehealth(RequestDate, Type: Type, Description: Description, FirstName: FirstName, LastName: LastName, PhoneNumber: PhoneNumber, HomePhoneNumber: HomePhoneNumber, Suburd: Suburd, DOB: DOB, Email: Email ,FileUploads:FileUploads, compailer: {
            response in
            handler(response)
        })
    }
}