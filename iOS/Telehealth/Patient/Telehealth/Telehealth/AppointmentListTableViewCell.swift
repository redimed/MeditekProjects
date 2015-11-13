//
//  AppointmentListTableViewCell.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 10/15/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
protocol AppointmentListTableViewCellDelegate : class{
    func AppointmentUpload(cell:AppointmentListTableViewCell,sender:String)
}

class AppointmentListTableViewCell: UITableViewCell {

    @IBOutlet weak var appointmentDate: UILabel!
    @IBOutlet weak var doctorName: UILabel!
    @IBOutlet weak var status: UILabel!
    var UIDAppointment = String()
 
    weak var delegate : AppointmentListTableViewCellDelegate?
    
    func configAppointment(Appointment:AppointmentList){
        print(Appointment.FromTime)
        if Appointment.FromTime == "" {
        }else {
            appointmentDate.text = Appointment.FromTime.toDateTimeZone(formatTime.dateTimeZone, format: formatTime.formatDateTime)
            doctorName.text = Appointment.NameDoctor
            status.text = Appointment.Status
            UIDAppointment = Appointment.UIDApointment
        }

       
      

    }
   
}
