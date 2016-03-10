//
//  TelehealthContainer.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 1/20/16.
//  Copyright © 2016 Giap Vo Duc. All rights reserved.
//

import Foundation
class TelehealthContainer : PatientContainer{
    var typeTelehealth: String!
    var description: String!
    var imageTelehealth: [UIImage]!
    
     init(firstName:String,lastName:String,mobilePhone:String,homePhone:String,type:String,suburb:String,dob:String,email:String,description:String,imageArray:[UIImage]){
        super.init()
        FirstName = firstName
        LastName = lastName
        PhoneNumber = mobilePhone
        HomePhoneNumber = homePhone
        self.typeTelehealth = type
        Suburb = suburb
        DOB = dob
        Email = email
        self.description = description
        self.imageTelehealth = imageArray
    }
}