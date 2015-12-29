//
//  Patient.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 10/27/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import Foundation

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
    var Email1 : String!
    var Country : String!
    var ID : String!
    var Address1 : String!
    var CountryID : String!
    var DOB : String!
    var Suburb : String!
    var HomePhoneNumber : String!
    var Image : UIImage!
    init(MiddleName:String,Address2:String,Title:String,WorkPhoneNumber:String,Enable:String,PhoneNumber:String,Occupation:String,LastName:String,Postcode:String,UID:String,UserAccountID:String,Gender:String,FirstName:String,State:String,ModifiedDate:String,Email1:String,Country:String,ID:String,Address1:String,CountryID:String,DOB:String,Suburb:String,HomePhoneNumber:String,Image:UIImage){
        
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
        self.Email1 = Email1
        self.Country = Country
        self.DOB = DOB
        self.Suburb = Suburb
        self.HomePhoneNumber = HomePhoneNumber
        self.Address1 = Address1
        self.Image = Image
        
    }
    
    func getAPI(){
        
    }

    
    
    
}