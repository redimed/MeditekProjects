//
//  Appointment.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 10/27/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import Foundation
import SwiftyJSON
class AppointmentContainer {
    let api = AppointmentAPI()
    var UIDApointment,ToTime,Status,FromTime,NameDoctor: String!,Type:String!,refName:String!,CreatedDate:String!
    init(){}
    init(UIDApointment:String,ToTime:String,Status:String,FromTime:String,NameDoctor:String,Type:String,refName:String,CreatedDate:String){
        self.UIDApointment = UIDApointment
        self.ToTime = ToTime
        self.Status = Status
        self.FromTime = FromTime
        self.NameDoctor = NameDoctor
        self.Type = Type
        self.refName = refName
        self.CreatedDate = CreatedDate
    }
    
}


