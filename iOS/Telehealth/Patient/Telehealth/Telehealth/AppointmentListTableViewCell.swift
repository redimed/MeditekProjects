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

    @IBOutlet weak var fromTime: UILabel!
    @IBOutlet weak var toTime: UILabel!
    @IBOutlet weak var doctorName: UILabel!
    @IBOutlet weak var status: UILabel!
    var UIDAppointment = String()
    weak var delegate : AppointmentListTableViewCellDelegate?
    
    func configAppointment(Appointment:AppointmentList){
        fromTime.text = Appointment.FromTime.toDateTime()
        toTime.text = Appointment.ToTime.toDateTime()
        doctorName.text = Appointment.NameDoctor
        status.text = Appointment.Status
        UIDAppointment = Appointment.UIDApointment
    }
    @IBAction func changeViewUploadButton(sender: AnyObject) {
        delegate?.AppointmentUpload(self, sender: UIDAppointment)
    }
}
