//
//  Appointment.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 10/27/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import Foundation
import SwiftyJSON
struct AppointmentContainer {
    let api = AppointmentAPI()
    var UIDApointment,ToTime,Status,Code,FromTime,NameDoctor: String!,Type:String!,refName:String!,CreatedDate:String!
    var FirstName,LastName,Suburb,HomePhoneNumber,PhoneNumber,Email,DOB : String!
    init(){}
    init(UIDApointment:String,ToTime:String,Status:String,Code:String,FromTime:String,NameDoctor:String,Type:String,refName:String,CreatedDate:String){
        self.UIDApointment = UIDApointment
        self.ToTime = ToTime
        self.Status = Status
        self.Code = Code
        self.FromTime = FromTime
        self.NameDoctor = NameDoctor
        self.Type = Type
        self.refName = refName
        self.CreatedDate = CreatedDate
    }
    init(FirstName:String,LastName:String,Suburb:String,HomePhoneNumber:String,PhoneNumber:String,Email:String,DOB:String){
        self.FirstName = FirstName
        self.LastName = LastName
        self.Suburb = Suburb
        self.HomePhoneNumber = HomePhoneNumber
        self.PhoneNumber = PhoneNumber
        self.Email = Email
        self.DOB = DOB
    }
    
}


