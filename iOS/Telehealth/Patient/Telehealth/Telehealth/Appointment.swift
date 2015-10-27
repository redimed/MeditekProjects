//
//  Appointment.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 10/27/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import Foundation

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


