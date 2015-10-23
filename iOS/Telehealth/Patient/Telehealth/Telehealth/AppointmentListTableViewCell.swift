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

    @IBOutlet weak var dateLabel: UILabel!
    @IBOutlet weak var timeLabel: UILabel!
    @IBOutlet weak var doctorName: UILabel!
    @IBOutlet weak var status: UILabel!
    var UIDAppointment = String()
    var fromTime = String()
    var toTime = String()
    weak var delegate : AppointmentListTableViewCellDelegate?
    
    func configAppointment(Appointment:AppointmentList){
        
        dateLabel.text = Appointment.FromTime.toDateTimeZone(formatTime.dateTimeZone, format: formatTime.formatDate)
        timeLabel.text = "\(Appointment.FromTime.toDateTimeZone(formatTime.dateTimeZone, format: formatTime.formatTime)) - \(Appointment.ToTime.toDateTimeZone(formatTime.dateTimeZone, format: formatTime.formatTime))"
        doctorName.text = Appointment.NameDoctor
        status.text = Appointment.Status
        UIDAppointment = Appointment.UIDApointment
    }
    @IBAction func changeViewUploadButton(sender: AnyObject) {
        delegate?.AppointmentUpload(self, sender: UIDAppointment)
    }
}
