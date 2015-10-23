//
//  ConfigurationSystem.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/24/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import SwiftyJSON
import Alamofire

let config = ConfigurationSystem()
var savedData  = saveData()
let defaults = NSUserDefaults.standardUserDefaults()
var tokens = String()
var PatientInfo : Patient!

struct ConfigurationSystem {
    static let Http = "http://192.168.1.2:3009"
    let deviceID = UIDevice.currentDevice().identifierForVendor?.UUIDString
    
    let headers = [
        "Authorization": "Bearer \(tokens)",
        "Content-Type": "application/x-www-form-urlencoded",
        "Version" : "1.0"
    ]
    //change border color textfield
    func borderTextFieldValid(textField:DesignableTextField,color:UIColor){
        textField.layer.borderColor = color.CGColor
        textField.layer.borderWidth = 1
        textField.cornerRadius = 4
    }
    //Giap: Check input only number
    func validateInputOnlyNumber(value: Int) -> Bool {
        switch value {
        case numberHashValue.number0 :
            return true
        case numberHashValue.number1 :
            return true
        case numberHashValue.number2 :
            return true
        case numberHashValue.number3 :
            return true
        case numberHashValue.number4 :
            return true
        case numberHashValue.number5 :
            return true
        case numberHashValue.number6 :
            return true
        case numberHashValue.number7 :
            return true
        case numberHashValue.number8 :
            return true
        case numberHashValue.number9 :
            return true
        case numberHashValue.delete :
            return true
        default:
            return false
        }
    }
}
//class handle get and set data calling
class saveData {
    var data: JSON = ""
    init(){}
    init(data:JSON){
        self.data = data
    }
}

class AppointmentList {
     var UIDApointment,ToTime,Status,FromTime,NameDoctor: String!
    init(UIDApointment:String,ToTime:String,Status:String,FromTime:String,NameDoctor:String){
        self.UIDApointment = UIDApointment
        self.ToTime = ToTime
        self.Status = Status
        self.FromTime = FromTime
        self.NameDoctor = NameDoctor
    }
}


class Patient{
    var MiddleName : String!
    var Address2 : String!
    var Title : String!
    var WorkPhoneNumber: String!
    var Enable : String!
    var PhoneNumber : String!
    var Occupation : String!
    var LastName : String!
    var Postcode : String!
    var UID : String!
    var UserAccountID : String!
    var Gender : String!
    var FirstName : String!
    var State : String!
    var ModifiedDate : String!
    var Email : String!
    var Country : String!
    var ID : String!
    var Address1 : String!
    var CountryID : String!
    var DOB : String!
    var Suburb : String!
    var HomePhoneNumber : String!
    init(MiddleName:String,Address2:String,Title:String,WorkPhoneNumber:String,Enable:String,PhoneNumber:String,Occupation:String,LastName:String,Postcode:String,UID:String,UserAccountID:String,Gender:String,FirstName:String,State:String,ModifiedDate:String,Email:String,Country:String,ID:String,Address1:String,CountryID:String,DOB:String,Suburb:String,HomePhoneNumber:String){
        
        self.MiddleName = MiddleName
        self.Address2 = Address2
        self.Title = Title
        self.WorkPhoneNumber = WorkPhoneNumber
        self.Enable = Enable
        self.PhoneNumber = PhoneNumber
        self.Occupation = Occupation
        self.LastName = LastName
        self.Postcode = Postcode
        self.UID = UID
        self.UserAccountID = UserAccountID
        self.Gender = Gender
        self.FirstName = FirstName
        self.State = State
        self.ModifiedDate = ModifiedDate
        self.Email = Email
        self.Country = Country
        self.DOB = DOB
        self.Suburb = Suburb
        self.HomePhoneNumber = HomePhoneNumber
        self.Address1 = Address1
        
    }

    
    
}





